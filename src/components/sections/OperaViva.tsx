'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue, getAlignment } from '@/lib/content';

export default function OperaViva({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.sections.operaViva;

    return (
        <section id="opera-viva" className="section py-[var(--s-6)]" aria-label="Opera Viva">
            <div className="wrap max-w-[75ch] mx-auto">
                <div className="reveal">
                    {/* Intro text from previous Hero section implementation */}
                    {/* Intro text from previous Hero section implementation */}
                    <h2 className="h2 mb-8" style={{ textAlign: getAlignment(data.title) }}>
                        {getLocalizedValue(data.title, locale)}
                    </h2>

                    <div className="lead space-y-8 text-[1.12em] leading-relaxed">
                        <p style={{ textAlign: getAlignment(data.lead) }}>
                            {getLocalizedValue(data.lead, locale)}
                        </p>

                        {data.paragraphs.map((p: any, i: number) => (
                            <p key={i} className="opacity-90" style={{ textAlign: getAlignment(p) }}>
                                {getLocalizedValue(p, locale)}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
            #opera-viva .lead p {
                margin-left: auto;
                margin-right: auto;
            }
            `}</style>
        </section>
    );
}
