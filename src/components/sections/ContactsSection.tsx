'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';
import Link from 'next/link';

export default function ContactsSection({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = (content as any).contactsSection || { buttonLabel: { it: 'Contatti', en: 'Contact' } }; // Fallback

    return (
        <section className="section py-[var(--s-6)] text-center" aria-label="Contatti rapzidi">
            <div className="wrap">
                <Link
                    href={locale === 'it' ? "/contatti" : "/en/contatti"}
                    className="btn btn--ghost inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[var(--border)] hover:bg-[var(--surface)] transition-all uppercase tracking-widest text-sm"
                >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>{getLocalizedValue(data.buttonLabel, locale)}</span>
                </Link>
            </div>
        </section>
    );
}
