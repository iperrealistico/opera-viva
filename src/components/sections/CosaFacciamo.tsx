'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';
import Link from 'next/link';

export default function CosaFacciamo({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.sections.cosaFacciamo;

    return (
        <section id="cosa-facciamo" className="section py-[var(--s-6)]" aria-label="Cosa facciamo">
            <div className="wrap">
                <div className="reveal">
                    <p className="kicker">{getLocalizedValue(data.kicker, locale)}</p>
                    <h2 className="h2">{getLocalizedValue(data.title, locale)}</h2>
                    <p className="lead" style={{ maxWidth: '72ch' }}>
                        {getLocalizedValue(data.lead, locale)}
                    </p>

                    <div className="pillRow mt-[var(--s-4)] grid grid-cols-1 sm:grid-cols-2 gap-[var(--s-3)]" aria-label="Servizi principali">
                        {data.items.map((item, idx) => (
                            <article key={idx} className="pill reveal border-0 rounded-0 p-0 bg-transparent shadow-none">
                                <h3 className="pill__title mb-[0.35rem] font-[950] uppercase tracking-[0.14em] text-[0.9em] text-[var(--text)] flex items-center gap-[0.6rem]">
                                    <i className={`fa-solid fa-${item.icon}`} style={{ color: 'var(--accent)', opacity: 0.95 }}></i>
                                    <span>{getLocalizedValue(item.title, locale)}</span>
                                </h3>
                                <p className="pill__text m-0 text-[var(--muted)] max-w-[66ch]">{getLocalizedValue(item.text, locale)}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="reveal mt-[var(--s-3)]">
                    <Link
                        href={locale === 'en' ? `/en${data.cta.href}` : data.cta.href}
                        className="btn btn--primary inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-2)_85%,transparent)] font-black uppercase tracking-[0.14em] text-[0.86em] transition-all hover:translate-y-[-1px] hover:border-[var(--border-2)] active:translate-y-0"
                        style={{ borderRadius: 'var(--r-ui)' }}
                    >
                        <i className="fa-solid fa-circle-info"></i>
                        <span>{getLocalizedValue(data.cta.label, locale)}</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
