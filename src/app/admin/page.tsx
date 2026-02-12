'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                setError('Password non corretta');
            }
        } catch (err) {
            setError('Errore di connessione');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center bg-[var(--bg)] p-6">
            <div className="reveal w-full max-w-[400px] border border-[var(--border)] p-8 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)]" style={{ borderRadius: 'var(--r-3)' }}>
                <h1 className="h2 text-center mb-6">Admin Access</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="micro" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-[var(--r-ui)] border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn--primary w-full py-3.5 rounded-[var(--r-ui)] bg-[var(--accent)] text-[var(--bg)] font-black uppercase tracking-[0.14em]"
                    >
                        {loading ? 'Entering...' : 'Enter'}
                    </button>
                </form>
            </div>

            <style jsx global>{`
        .reveal { opacity: 1 !important; transform: none !important; filter: none !important; }
      `}</style>
        </div>
    );
}
