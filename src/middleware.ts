import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect admin dashboard
    if (path.startsWith('/__manage/dashboard')) {
        const session = request.cookies.get('session')?.value;
        if (!session) {
            return NextResponse.redirect(new URL('/__manage', request.url));
        }
        try {
            await decrypt(session);
        } catch {
            return NextResponse.redirect(new URL('/__manage', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/__manage/dashboard/:path*'],
};
