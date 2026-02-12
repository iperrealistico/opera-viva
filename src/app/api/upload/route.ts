import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_REPO_OWNER || '';
const REPO = process.env.GITHUB_REPO_NAME || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
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
        }

        return NextResponse.json({
            url: `/${targetPath.replace(/^public\//, '')}`,
            success: true
        });
    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
