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
        // In a Vercel deployment, this only updates the ephemeral filesystem
        const contentPath = path.join(process.cwd(), 'content', 'site.json');
        try {
            fs.writeFileSync(contentPath, JSON.stringify(newContent, null, 2));
        } catch (fsError) {
            console.error("Failed to write local file (expected in Vercel)", fsError);
        }

        // 2. Commit to GitHub (Required for Vercel updates)
        if (!process.env.GITHUB_TOKEN || !OWNER || !REPO) {
            console.error("Missing GitHub Environment Variables: ", {
                hasToken: !!process.env.GITHUB_TOKEN,
                owner: !!OWNER,
                repo: !!REPO
            });
            // If we are in production (simulated by checking for these vars), we should probably error or warn
            // But for local dev without them, we just return success based on local file write
            return NextResponse.json({
                success: true,
                warning: 'GitHub credentials missing. Content saved locally only (ephemeral if on server).'
            });
        }

        const pathInRepo = 'content/site.json';

        // Get current file sha
        let sha;
        try {
            const { data: currentFile } = await octokit.repos.getContent({
                owner: OWNER,
                repo: REPO,
                path: pathInRepo,
                ref: BRANCH
            }) as any;
            sha = currentFile?.sha;
        } catch (e: any) {
            console.error("GitHub GetContent Error:", e.status, e.message);
            // If file doesn't exist, sha remains undefined, which is fine for createOrUpdate
        }

        try {
            await octokit.repos.createOrUpdateFileContents({
                owner: OWNER,
                repo: REPO,
                path: pathInRepo,
                message: 'Admin: update content/site.json',
                content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
                branch: BRANCH,
                sha: sha
            });
        } catch (e: any) {
            console.error("GitHub Commit Error:", e.status, e.message);
            throw new Error(`GitHub Commit Failed: ${e.message}`);
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Content update error:', err);
        return NextResponse.json({
            error: err.message || 'Unknown Error',
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}
