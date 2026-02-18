import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Octokit } from '@octokit/rest';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const checks = {
            envVars: {
                GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
                GITHUB_REPO_OWNER: !!process.env.GITHUB_REPO_OWNER,
                GITHUB_REPO_NAME: !!process.env.GITHUB_REPO_NAME,
                GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main (default)'
            },
            connection: {
                success: false,
                message: ''
            },
            permissions: {
                admin: false,
                push: false,
                pull: false
            }
        };

        if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO_OWNER || !process.env.GITHUB_REPO_NAME) {
            return NextResponse.json({
                success: false,
                checks,
                error: 'Missing required Environment Variables'
            });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_REPO_OWNER;
        const repo = process.env.GITHUB_REPO_NAME;

        try {
            const { data } = await octokit.repos.get({ owner, repo });
            checks.connection.success = true;
            checks.connection.message = `Connected to ${data.full_name}`;
            if (data.permissions) {
                checks.permissions = {
                    admin: data.permissions.admin,
                    push: data.permissions.push,
                    pull: data.permissions.pull
                };
            }
        } catch (err: any) {
            checks.connection.success = false;
            checks.connection.message = `Failed to connect: ${err.message}`;
            return NextResponse.json({ success: false, checks, error: err.message });
        }

        return NextResponse.json({ success: checks.connection.success, checks });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
