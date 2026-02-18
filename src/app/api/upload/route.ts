import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Octokit } from '@octokit/rest';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { SiteContent } from '@/lib/content';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_REPO_OWNER || '';
const REPO = process.env.GITHUB_REPO_NAME || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function POST(req: NextRequest) {
    const contentLength = req.headers.get('content-length');
    console.log(`[Upload] Request started. Content-Length: ${contentLength}`);
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

        // Load content to get Admin Config
        let config = { storage: 'vercel-blob', maxDimension: 1920, maxSizeKB: 700 };
        try {
            const contentPath = path.join(process.cwd(), 'content', 'site.json');
            if (fs.existsSync(contentPath)) {
                const siteContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8')) as SiteContent;
                if (siteContent.adminConfig) {
                    config = { ...config, ...siteContent.adminConfig };
                }
            }
        } catch (e) {
            console.error("Failed to load admin config:", e);
        }

        let buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name;

        // --- Image Optimization ---
        // Check if it's an image
        if (file.type.startsWith('image/')) {
            try {
                let image = sharp(buffer);
                const metadata = await image.metadata();

                let needsResize = false;
                if (metadata.width && metadata.width > config.maxDimension) {
                    needsResize = true;
                    image = image.resize({ width: config.maxDimension, withoutEnlargement: true });
                }

                if (metadata.height && metadata.height > config.maxDimension) {
                    needsResize = true;
                    image = image.resize({ height: config.maxDimension, withoutEnlargement: true, fit: 'inside' });
                }

                if (needsResize || (buffer.length > config.maxSizeKB * 1024)) {
                    // Compress
                    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                        image = image.jpeg({ quality: 80, mozjpeg: true });
                    } else if (metadata.format === 'png') {
                        image = image.png({ quality: 80, compressionLevel: 8 });
                    } else if (metadata.format === 'webp') {
                        image = image.webp({ quality: 80 });
                    }

                    buffer = (await image.toBuffer()) as any;
                }

                // Hard limit check after optimization (if it's still somehow massive, fail? No, just warn log)
                if (buffer.length > 5 * 1024 * 1024) { // 5MB Absolute max safety
                    console.warn("Optimized image is still > 5MB");
                }

            } catch (sharpError) {
                console.error("Sharp optimization failed:", sharpError);
                // Fallback to original buffer if optimization fails
            }
        }


        // --- Upload Strategy ---

        if (config.storage === 'vercel-blob') {
            // Vercel Blob Upload
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return NextResponse.json({ error: 'Vercel Blob Token missing' }, { status: 500 });
            }
            const blob = await put(`media/${Date.now()}_${originalName}`, buffer, {
                access: 'public',
                contentType: file.type
            });
            return NextResponse.json({
                url: blob.url,
                success: true
            });

        } else {
            // GitHub Upload (Old Logic)
            const fileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const targetPath = `public/img/${Date.now()}_${fileName}`;

            // 1. Save locally (for local dev)
            const localDir = path.join(process.cwd(), 'public', 'img');
            if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
            fs.writeFileSync(path.join(process.cwd(), targetPath), buffer);

            // 2. Commit to GitHub
            if (process.env.GITHUB_TOKEN && OWNER && REPO) {
                await octokit.repos.createOrUpdateFileContents({
                    owner: OWNER,
                    repo: REPO,
                    path: targetPath,
                    message: `Admin: upload asset ${fileName}`,
                    content: buffer.toString('base64'),
                    branch: BRANCH
                });
            } else {
                // For local dev without GitHub sync
            }

            return NextResponse.json({
                url: `/${targetPath.replace(/^public\//, '')}`,
                success: true
            });
        }

    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
