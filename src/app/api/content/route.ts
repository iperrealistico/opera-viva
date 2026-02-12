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

async function verifySession() {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
}

export async function GET(req: NextRequest) {
    try {
        await verifySession();
        const contentPath = path.join(process.cwd(), 'content', 'site.json');
        const content = fs.readFileSync(contentPath, 'utf8');
        return NextResponse.json(JSON.parse(content));
    } catch (err) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await verifySession();
        const newContent = await req.json();

        // 1. Update local file (for local dev)
        const contentPath = path.join(process.cwd(), 'content', 'site.json');
        fs.writeFileSync(contentPath, JSON.stringify(newContent, null, 2));

        // 2. Commit to GitHub (if env vars are present)
        if (process.env.GITHUB_TOKEN && OWNER && REPO) {
            const pathInRepo = 'content/site.json';

            // Get current file sha
            const { data: currentFile } = await octokit.repos.getContent({
                owner: OWNER,
                repo: REPO,
                path: pathInRepo,
                ref: BRANCH
            }).catch(() => ({ data: null })) as any;

            const sha = currentFile?.sha;

            await octokit.repos.createOrUpdateFileContents({
                owner: OWNER,
                repo: REPO,
                path: pathInRepo,
                message: 'Admin: update content/site.json',
                content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
                branch: BRANCH,
                sha: sha
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Content update error:', err);
        return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
    }
}
