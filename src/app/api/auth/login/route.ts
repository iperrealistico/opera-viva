import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        const success = await login(password);
        if (success) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
