'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';

export default function Footer({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const year = new Date().getFullYear();

    const copyrightText = content.footer.copyright.replace('{year}', year.toString());

    return (
        <footer className="site-footer py-8 border-top border-[color-mix(in_oklab,var(--border)_80%,transparent)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)]">
            <div className="wrap flex justify-between gap-4 items-center flex-wrap">
                <p className="micro m-0">{copyrightText}</p>
                <div className="footer__links flex gap-[0.9rem] items-center flex-wrap">
                    {content.footer.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.href.startsWith('/') ? (locale === 'en' ? `/en${link.href === '/' ? '' : link.href}` : link.href) : link.href}
                            className="text-[color:var(--muted)] tracking-[0.12em] uppercase text-[0.82em] inline-flex items-center gap-[0.45rem] p-1 rounded-lg transition-all hover:text-[var(--text)] hover:bg-[color-mix(in_oklab,var(--surface)_92%,transparent)]"
                            style={{ borderRadius: 'var(--r-ui)' }}
                            onClick={(e) => {
                                if (link.action === 'back-to-top') {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                        >
                            <i className={idx === 0 ? "fa-solid fa-arrow-up" : (idx === 1 ? "fa-solid fa-layer-group" : "fa-solid fa-paper-plane")} style={{ color: 'var(--accent)', opacity: 0.95 }}></i>
                            <span>{getLocalizedValue(link.label, locale)}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
