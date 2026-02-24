'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue, getAlignment } from '@/lib/content';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';

export default function TecnicheView({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const data = content.techniques;

    const [isClient, setIsClient] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (data.locked && sessionStorage.getItem('techniquesUnlocked') === 'true') {
            setUnlocked(true);
        } else if (!data.locked) {
            setUnlocked(true);
        }
    }, [data.locked]);

    useEffect(() => {
        if (!unlocked) return;
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
    }, [unlocked]);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        if (!data.passwordHash) return;

        const encoder = new TextEncoder();
        const pd = encoder.encode(passwordInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', pd);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex === data.passwordHash) {
            setUnlocked(true);
            sessionStorage.setItem('techniquesUnlocked', 'true');
        } else {
            setError(true);
            setPasswordInput('');
        }
    };

    if (isClient && !unlocked && data.locked) {
        return (
            <section className="techStack pt-[calc(var(--s-6)+30px)] pb-[var(--s-6)] min-h-screen flex items-center justify-center">
                <div className="wrap max-w-lg mx-auto w-full">
                    <div className="techStack__head py-[var(--s-5)] pb-[var(--s-4)] text-center animate-[fadeInUp_0.8s_ease-out_forwards]">
                        <p className="kicker mb-4">{getLocalizedValue(data.kicker, locale)}</p>
                        <h1 className="h2 mb-6" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                            {locale === 'en' ? "Protected Content" : "Contenuto Protetto"}
                        </h1>
                        <p className="lead text-[var(--muted)] max-w-md mx-auto mb-8">
                            {locale === 'en'
                                ? "This section is reserved. Please enter the password to view the techniques."
                                : "Questa sezione è riservata. Inserisci la password per visualizzare le tecniche."}
                        </p>

                        <form onSubmit={handleUnlock} className="flex flex-col gap-4 max-w-sm mx-auto">
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder={locale === 'en' ? "Password" : "Password"}
                                className={`bg-transparent border ${error ? 'border-red-500 text-red-500' : 'border-[var(--border)]'} rounded-full px-6 py-4 text-center focus:outline-none focus:border-[var(--accent)] transition-colors`}
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-500 text-sm">{locale === 'en' ? "Incorrect password" : "Password errata"}</p>
                            )}
                            <button type="submit" className="btn btn--primary px-6 py-4 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-2)_85%,transparent)] transition-all hover:translate-y-[-1px]">
                                {locale === 'en' ? "Enter" : "Accedi"}
                            </button>
                        </form>

                        <div className="mt-8">
                            <Link href={locale === 'en' ? "/en" : "/"} className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors underline underline-offset-4">
                                {getLocalizedValue(data.backLabel, locale)}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="techStack pt-[calc(var(--s-6)+30px)] pb-[var(--s-6)]" aria-label="Come lo facciamo">
            <div className="wrap">
                <div className="techStack__head py-[var(--s-5)] pb-[var(--s-4)]">
                    <p className="kicker techAnim" data-tech-anim style={{ textAlign: getAlignment(data.kicker) }}>{getLocalizedValue(data.kicker, locale)}</p>
                    <h1 className="h2 techAnim" data-tech-anim style={{ textAlign: getAlignment(data.title) }}>{getLocalizedValue(data.title, locale)}</h1>
                    <p className="lead techAnim" data-tech-anim style={{ maxWidth: '72ch', textAlign: getAlignment(data.lead), marginInline: getAlignment(data.lead) === 'center' ? 'auto' : 'unset' }}>
                        {getLocalizedValue(data.lead, locale)}
                    </p>

                    <div className="techAnim mt-[var(--s-3)]" data-tech-anim style={{ textAlign: getAlignment(data.lead) === 'center' ? 'center' : 'left' }}>
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
                                {section.images && section.images.length > 1 ? (
                                    <TechSlider images={section.images} altPrefix={getLocalizedValue(section.title, locale)} />
                                ) : (
                                    <div className="techMedia relative border border-[color-mix(in_oklab,var(--border)_75%,transparent)] overflow-hidden bg-[color-mix(in_oklab,var(--surface)_82%,transparent)]" style={{ borderRadius: 'var(--r-ui)' }}>
                                        <img src={section.images?.length === 1 ? section.images[0].src : section.image} alt={section.images?.length === 1 ? section.images[0].alt : getLocalizedValue(section.title, locale)} className="w-full h-auto block" />
                                    </div>
                                )}
                            </div>
                            <div className="techSection__copy">
                                <h2 className="techSection__title techAnim font-[var(--serif)] tracking-[0.02em] mb-3 text-[clamp(1.4rem,2.2vw,2.1rem)]" data-tech-anim style={{ textAlign: getAlignment(section.title) }}>
                                    {getLocalizedValue(section.title, locale)}
                                </h2>
                                {section.paragraphs.map((p, pIdx) => (
                                    <p key={pIdx} className="techSection__p techAnim m-0 mb-3 text-[var(--muted)] leading-[1.6] max-w-[68ch]" data-tech-anim style={{ textAlign: getAlignment(p) }}>
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

function TechSlider({ images, altPrefix }: { images: Array<{ src: string, alt: string }>, altPrefix: string }) {
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

    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    return (
        <div className="techMedia relative border border-[color-mix(in_oklab,var(--border)_75%,transparent)] overflow-hidden bg-[color-mix(in_oklab,var(--surface)_82%,transparent)]" style={{ borderRadius: 'var(--r-ui)' }}>
            <div className="hScroll overflow-hidden relative" style={{ borderRadius: 'var(--r-ui)' }}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y">
                        {images.map((item, idx) => (
                            <div key={idx} className="flex-[0_0_100%] min-w-0 relative bg-[var(--bg-2)] border-r border-[color-mix(in_oklab,var(--border)_70%,transparent)] last:border-r-0 overflow-hidden">
                                <img
                                    className="w-full h-auto block object-cover"
                                    src={item.src}
                                    alt={item.alt || altPrefix}
                                    onLoad={(e) => {
                                        const parent = e.currentTarget.parentElement;
                                        if (parent && !parent.classList.contains('is-loaded')) {
                                            parent.classList.add('is-loaded');
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hScroll__meta p-[0.85rem_1.05rem] flex justify-center items-center absolute bottom-0 w-full z-10 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="dots flex gap-[0.45rem]">
                        {scrollSnaps.map((_, idx) => (
                            <button
                                key={idx}
                                className={`dot w-[10px] h-[10px] rounded-full border border-white/50 bg-white/30 transition-all p-0 cursor-pointer ${idx === selectedIndex ? '!bg-[var(--accent)] !border-[color-mix(in_oklab,var(--accent)_70%,transparent)] scale-115' : ''}`}
                                onClick={() => scrollTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
