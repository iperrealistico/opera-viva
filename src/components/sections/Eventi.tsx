'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue, getAlignment } from '@/lib/content';
import { marked } from 'marked';

export default function Eventi({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.sections.eventi;
    const [eventsHtml, setEventsHtml] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/eventi.md');
                if (res.ok) {
                    const text = await res.text();
                    if (text.trim()) {
                        const html = await marked.parse(text);
                        setEventsHtml(html);
                    }
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        }
        fetchEvents();
    }, []);

    if (!eventsHtml) return null;

    return (
        <section id="eventi" className="section py-[var(--s-6)]" aria-label="Eventi" data-events-section>
            <div className="wrap">
                <div className="reveal">
                    <p className="kicker" style={{ textAlign: getAlignment(data.kicker) }}>{getLocalizedValue(data.kicker, locale)}</p>
                    <h2 className="h2" style={{ textAlign: getAlignment(data.title) }}>{getLocalizedValue(data.title, locale)}</h2>
                    <p className="lead" style={{ maxWidth: '72ch', textAlign: getAlignment(data.lead), marginInline: getAlignment(data.lead) === 'center' ? 'auto' : 'unset' }}>
                        {getLocalizedValue(data.lead, locale)}
                    </p>
                </div>

                <div className="eventsCard reveal mt-[var(--s-3)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-[0_28px_120px_var(--shadow)] p-[var(--s-4)]" style={{ borderRadius: 'var(--r-ui)' }}>
                    <div className="md" dangerouslySetInnerHTML={{ __html: eventsHtml }} />
                </div>
            </div>
        </section>
    );
}
