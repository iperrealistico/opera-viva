'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export default function ComeLoFacciamo({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.sections.comeLoFacciamo;

    // Embla Carousel Setup
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    // GLightbox Setup
    useEffect(() => {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });
        return () => lightbox.destroy();
    }, []);

    return (
        <section id="come-lo-facciamo" className="section py-[var(--s-6)]" aria-label="Come lo facciamo">
            <div className="wrap">
                <div className="split grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[var(--s-5)] items-start">
                    <div className="reveal">
                        <h2 className="h2">{getLocalizedValue(data.title, locale)}</h2>
                        <p className="lead" style={{ maxWidth: '72ch' }}>
                            {getLocalizedValue(data.lead, locale)}
                        </p>

                        <div className="pillRow mt-[var(--s-4)] grid grid-cols-1 sm:grid-cols-2 gap-[var(--s-3)]" aria-label="Sintesi tecniche">
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

                        <div className="reveal mt-[var(--s-3)]">
                            <Link
                                href={locale === 'en' ? `/en${data.cta.href}` : data.cta.href}
                                className="btn btn--primary inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-2)_85%,transparent)] font-black uppercase tracking-[0.14em] text-[0.86em] transition-all hover:translate-y-[-1px] hover:border-[var(--border-2)] active:translate-y-0"
                                style={{ borderRadius: 'var(--r-ui)' }}
                            >
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                <span>{getLocalizedValue(data.cta.label, locale)}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="reveal">
                        {/* Embla Carousel Container */}
                        <div className="hScroll overflow-hidden relative rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-gradient-to-b from-[var(--bg-2)] to-[var(--bg)] shadow-[0_28px_120px_var(--shadow)]">
                            <div className="overflow-hidden" ref={emblaRef}>
                                <div className="flex touch-pan-y shadow-[0_28px_120px_var(--shadow)]">
                                    {data.gallery.map((item, idx) => (
                                        <div key={idx} className="flex-[0_0_100%] min-w-0 relative aspect-[4/5] bg-gradient-to-b from-[var(--bg-3)] to-[var(--bg)] border-r border-[color-mix(in_oklab,var(--border)_70%,transparent)] last:border-r-0 overflow-hidden">
                                            <a className="media glightbox block absolute inset-0 cursor-zoom-in" href={item.src} data-gallery="tre-strade">
                                                <div className="media__ph absolute inset-0 bg-[radial-gradient(140%_120%_at_18%_10%,var(--ph-2),transparent_60%),radial-gradient(120%_120%_at_82%_85%,var(--ph-1),transparent_65%),linear-gradient(180deg,var(--bg-3),var(--bg))] animate-[phBreath_2.6s_cubic-bezier(.16,1,.3,1)_infinite]"></div>
                                                <img
                                                    className="media__img absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105"
                                                    src={item.src}
                                                    alt={item.alt}
                                                    onLoad={(e) => e.currentTarget.parentElement?.classList.add('is-loaded')}
                                                />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hScroll__meta p-[0.85rem_1.05rem] flex justify-center items-center border-t border-[color-mix(in_oklab,var(--border)_70%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)]">
                                <div className="dots flex gap-[0.45rem]">
                                    {scrollSnaps.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`dot w-[10px] h-[10px] rounded-full border border-[color-mix(in_oklab,var(--border)_70%,transparent)] bg-[color-mix(in_oklab,var(--border)_70%,transparent)] transition-all p-0 cursor-pointer ${idx === selectedIndex ? '!bg-[var(--accent)] !border-[color-mix(in_oklab,var(--accent)_70%,transparent)] scale-115' : ''
                                                }`}
                                            onClick={() => scrollTo(idx)}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
