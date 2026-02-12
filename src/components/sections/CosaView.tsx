'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';
import Link from 'next/link';

export default function CosaView({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.offer;

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        document.querySelectorAll('[data-tech-anim]').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="techStack pt-[calc(var(--s-6)+30px)] pb-[var(--s-6)]" aria-label="Cosa facciamo">
            <div className="wrap">
                <div className="techStack__head py-[var(--s-5)] pb-[var(--s-4)]">
                    <p className="kicker techAnim" data-tech-anim>{getLocalizedValue(data.kicker, locale)}</p>
                    <h1 className="h2 techAnim" data-tech-anim>{getLocalizedValue(data.title, locale)}</h1>
                    <p className="lead techAnim" data-tech-anim style={{ maxWidth: '72ch' }}>
                        {getLocalizedValue(data.lead, locale)}
                    </p>

                    <div className="techAnim mt-[var(--s-3)]" data-tech-anim>
                        <Link
                            href={locale === 'en' ? "/en" : "/"}
                            className="btn btn--ghost inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-[var(--border)] transition-all hover:translate-y-[-1px]"
                            style={{ borderRadius: 'var(--r-ui)' }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>{getLocalizedValue(data.backLabel, locale)}</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="techStack__sections flex flex-col gap-[var(--s-6)] pb-[var(--s-6)]">
                {data.sections.map((section, idx) => (
                    <section key={section.id} className="techSection border-t border-[color-mix(in_oklab,var(--border)_75%,transparent)] pt-[var(--s-5)]" id={section.id}>
                        <div className={cn(
                            "wrap techSection__grid grid grid-cols-1 md:grid-cols-2 gap-[var(--s-4)] items-start",
                            idx % 2 !== 0 && "techSection__grid--flip"
                        )}>
                            <div className="techSection__media techAnim" data-tech-anim>
                                <div className="techMedia relative border border-[color-mix(in_oklab,var(--border)_75%,transparent)] overflow-hidden bg-[color-mix(in_oklab,var(--surface)_82%,transparent)]" style={{ borderRadius: 'var(--r-ui)' }}>
                                    <img src={section.image} alt={getLocalizedValue(section.title, locale)} className="w-full h-auto block" />
                                </div>
                            </div>
                            <div className="techSection__copy">
                                <h2 className="techSection__title techAnim font-[var(--serif)] tracking-[0.02em] mb-3 text-[clamp(1.4rem,2.2vw,2.1rem)]" data-tech-anim>
                                    {getLocalizedValue(section.title, locale)}
                                </h2>
                                {section.paragraphs.map((p, pIdx) => (
                                    <p key={pIdx} className="techSection__p techAnim m-0 mb-3 text-[var(--muted)] leading-[1.6] max-w-[68ch]" data-tech-anim>
                                        {getLocalizedValue(p, locale)}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </section>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
