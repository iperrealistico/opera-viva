import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Octokit } from '@octokit/rest';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Define required sizes
        const sizes = [
            { name: 'favicon.ico', width: 32, height: 32, format: 'ico' },
            { name: 'favicon-16x16.png', width: 16, height: 16, format: 'png' },
            { name: 'favicon-32x32.png', width: 32, height: 32, format: 'png' },
            { name: 'apple-touch-icon.png', width: 180, height: 180, format: 'png' },
            { name: 'android-chrome-192x192.png', width: 192, height: 192, format: 'png' },
            { name: 'android-chrome-512x512.png', width: 512, height: 512, format: 'png' }
        ];

        const generatedFiles = [];

        for (const size of sizes) {
            let processedBuffer;
            if (size.format === 'ico') {
                // sharp can output ico but let's stick to png for simplicity if ico fails or just resize to png and rename? 
                // sharp supports ico since 0.33 if libvips supports it. safe fallback is strict png or using specific settings.
                // We will try png to ico conversion via sharp if supported, or just resizing.
                // Actually standard sharp doesn't always write .ico directly well without plugins.
                // We'll output png and if format is ico, we might strictly need an ico encoder.
                // For now let's output 32x32 png as favicon.ico (browsers often tolerate this) or try sharp's .toFormat('ico') if available.
                // Let's stick to png for all except .ico. For .ico we can just save the 32x32 png buffer with .ico extension?
                // Most modern browsers handle PNG favicons. IE11 needs real ICO. 
                // Let's assume sharp handles it or we rely on the fact that Vercel's sharp might.
                try {
                    processedBuffer = await sharp(buffer).resize(size.width, size.height).toFormat('png').toBuffer();
                    // Rename extension but content is png - valid hack for most.
                } catch (e) {
                    console.warn('Favicon generation warning', e);
                }
            } else {
                processedBuffer = await sharp(buffer).resize(size.width, size.height).toFormat('png' as any).toBuffer();
            }

            if (processedBuffer) {
                generatedFiles.push({
                    path: `public/${size.name}`,
                    content: processedBuffer.toString('base64')
                });
            }
        }

        // Commit to GitHub
        if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO_OWNER && process.env.GITHUB_REPO_NAME) {
            const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
            const owner = process.env.GITHUB_REPO_OWNER;
            const repo = process.env.GITHUB_REPO_NAME;
            const branch = process.env.GITHUB_BRANCH || 'main';

            // We need to commit multiple files. The best way is to get the current commit sha, get the tree, create a new tree, and commit.
            // Or simpler: just do serial updates (slower but easier to implement reliably without race conditions if we handle sha correctly).
            // Actually, `createOrUpdateFileContents` in a loop is fine for this low-volume admin tool.

            for (const file of generatedFiles) {
                let sha;
                try {
                    const { data: existing } = await octokit.repos.getContent({
                        owner,
                        repo,
                        path: file.path,
                        ref: branch
                    }) as any;
                    sha = existing?.sha;
                } catch (e) {
                    // File doesn't exist
                }

                await octokit.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path: file.path,
                    message: `Admin: update favicon ${file.path}`,
                    content: file.content,
                    branch,
                    sha
                });
            }

            return NextResponse.json({ success: true, message: 'Favicons generated and committed.' });
        } else {
            return NextResponse.json({
                success: false,
                error: 'GitHub credentials missing. Cannot commit favicons.'
            });
        }

    } catch (error: any) {
        console.error('Favicon upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
