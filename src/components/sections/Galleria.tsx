'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue, getAlignment } from '@/lib/content';
import Link from 'next/link';

export default function Galleria({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.sections.galleria;

    useEffect(() => {
        // Handle image loading
        const images = document.querySelectorAll('#galleria .media__img');
        images.forEach((img) => {
            const mediaContainer = img.closest('.media');
            if (img instanceof HTMLImageElement) {
                if (img.complete) {
                    mediaContainer?.classList.add('is-loaded');
                } else {
                    img.addEventListener('load', () => {
                        mediaContainer?.classList.add('is-loaded');
                    });
                    img.addEventListener('error', () => {
                        mediaContainer?.classList.add('has-error');
                    });
                }
            }
        });
    }, []);

    return (
        <section id="galleria" className="section py-[var(--s-6)]" aria-label="Galleria">
            <div className="wrap">
                <div className="reveal">
                    {/* Kicker removed */}
                    <h2 className="h2" style={{ textAlign: getAlignment(data.title) }}>
                        {getLocalizedValue(data.title, locale)}
                    </h2>
                    <p className="lead" style={{ maxWidth: '72ch', textAlign: getAlignment(data.lead), marginInline: getAlignment(data.lead) === 'center' ? 'auto' : 'unset' }}>
                        {getLocalizedValue(data.lead, locale)}
                    </p>
                </div>

                <div className="grid3 mt-[var(--s-5)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10" aria-label="Galleria immagini">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                            <figure className="gridItem reveal m-0 border border-[color-mix(in_oklab,var(--border)_85%,transparent)] overflow-hidden bg-[linear-gradient(180deg,var(--bg-3),var(--bg))] shadow-[0_26px_110px_var(--shadow)] aspect-[3/4] relative w-full" style={{ borderRadius: 'var(--r-ui)' }}>
                                <a className="media glightbox absolute inset-0 cursor-zoom-in" href={item.src} data-gallery="galleria" data-type="image">
                                    <div className="media__ph absolute inset-0 bg-[radial-gradient(140%_120%_at_18%_10%,var(--ph-2),transparent_60%),radial-gradient(120%_120%_at_82%_85%,var(--ph-1),transparent_65%),linear-gradient(180deg,var(--bg-3),var(--bg))] animate-[phBreath_2.6s_cubic-bezier(.16,1,.3,1)_infinite]"></div>
                                    <img className="media__img absolute inset-0 w-full h-full object-cover transition-all duration-720 hover:scale-105" src={item.src} alt={item.alt} />
                                </a>
                            </figure>
                            {/* Render alt as title if it's not the generic default */}
                            {item.alt && item.alt !== 'New Image' && (
                                <p className="text-sm font-medium tracking-wide opacity-80 uppercase text-center mt-1">
                                    {item.alt}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
