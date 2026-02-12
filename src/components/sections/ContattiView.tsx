'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';
import Link from 'next/link';

export default function ContattiView({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.sections.contatti;
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(data.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="contactPage pt-[clamp(7.5rem,12vh,10.5rem)] pb-[var(--s-6)]" aria-label="Contatti">
            <div className="wrap">
                <div className="reveal">
                    <p className="kicker">{getLocalizedValue(data.kicker, locale)}</p>
                    <h1 className="h2 mb-[var(--s-2)]">{getLocalizedValue(data.title, locale)}</h1>

                    <p className="lead m-0 text-[var(--muted)]">
                        {getLocalizedValue(data.lead, locale)}
                    </p>

                    <p className="micro mt-3">
                        {getLocalizedValue(data.location, locale)}
                    </p>
                </div>

                <div className="contactCard reveal mt-[var(--s-4)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] rounded-[var(--r-3)] p-[var(--s-5)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-[0_30px_140px_var(--shadow)] flex flex-wrap items-start justify-between gap-[var(--s-4)]" style={{ borderRadius: 'var(--r-ui)' }}>
                    <div style={{ maxWidth: '72ch' }}>
                        <p className="lead m-0">
                            {getLocalizedValue(data.cardLead, locale)}
                        </p>
                    </div>

                    <div className="contactCard__right flex flex-wrap gap-3 items-center" aria-label="Azioni contatto" style={{ borderRadius: 'var(--r-ui)' }}>
                        <button
                            className="btn btn--primary relative flex items-center gap-2 px-5 py-3.5 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-2)_85%,transparent)] transition-all hover:translate-y-[-1px] min-w-[160px] justify-center"
                            onClick={copyEmail}
                            aria-label="Vedi email e copia"
                        >
                            <span className={cn(
                                "btnBadge absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] border border-[var(--border)] rounded-full px-3 py-1.5 shadow-[0_22px_80px_var(--shadow)] flex items-center gap-2 transition-all text-[0.72em] font-[950] tracking-[0.1em] uppercase whitespace-nowrap z-20",
                                copied ? "opacity-100 translate-y-[-12px]" : "opacity-0 translate-y-[-4px] pointer-events-none"
                            )}>
                                <i className="fa-solid fa-circle-check text-[var(--ok)]"></i>
                                <span>{locale === 'en' ? "Copied" : "Copiata"}</span>
                            </span>

                            <div className="flex items-center gap-2.5">
                                <i className="fa-solid fa-envelope"></i>
                                {!copied ? (
                                    <span className="font-bold">
                                        {locale === 'en' ? "View email" : "Vedi email"}
                                    </span>
                                ) : (
                                    <span className="font-black text-[var(--accent)] tracking-tighter">
                                        {data.email}
                                    </span>
                                )}
                            </div>
                        </button>

                        <a
                            className="btn btn--ghost flex items-center gap-2 px-5 py-3.5 rounded-full border border-[var(--border)] transition-all hover:translate-y-[-1px]"
                            href={data.instagram}
                            rel="noopener"
                            target="_blank"
                        >
                            <i className="fa-brands fa-instagram"></i>
                            <span>Instagram</span>
                        </a>

                        <Link
                            href={locale === 'en' ? "/en" : "/"}
                            className="btn btn--ghost flex items-center gap-2 px-5 py-3.5 rounded-full border border-[var(--border)] transition-all hover:translate-y-[-1px]"
                        >
                            <i className="fa-solid fa-house"></i>
                            <span>{getLocalizedValue(data.homeLabel, locale)}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
