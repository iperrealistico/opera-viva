import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch {
        return null;
    }
}

export async function login(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    if (password === adminPassword) {
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({ admin: true, expires });
        (await cookies()).set('session', session, { expires, httpOnly: true, secure: true, sameSite: 'strict' });
        return true;
    }
    return false;
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
}
