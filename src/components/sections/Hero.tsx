'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';

export default function Hero({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const hero = content.sections.hero;
    const showVideo = hero.mediaType === 'video' && hero.videoUrl;
    const showLogo = hero.showLogo !== false; // Default to true

    // Helper to extract YouTube ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = showVideo ? getYoutubeId(hero.videoUrl) : null;

    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center text-center text-white bg-black">
            {/* Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {showVideo && videoId ? (
                    <div className="absolute inset-0 w-full h-full pointer-events-none scale-150">
                        <iframe
                            className="w-full h-full object-cover"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&start=${hero.videoStart || 0}&playsinline=1&showinfo=0&rel=0`}
                            allow="autoplay; encrypted-media"
                            title="Hero Video"
                        />
                    </div>
                ) : (
                    <img
                        src={hero.backgroundImage || "/img/opera-viva-1.jpg"}
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl px-6 animate-fade-in-up">
                {/* Logo */}
                {showLogo && (
                    <div className="w-56 md:w-80 lg:w-[420px] opacity-90 drop-shadow-2xl">
                        <img src="/logo.png" alt="Opera Viva Logo" className="w-full h-auto" />
                    </div>
                )}

                {/* Main Title */}
                {/* Main Title Removed as per request */}

                {/* Intro Text / Poem */}
                {/* User asked to remove 'Progetto fotografico' subtitle. We will skip hero.subtitle here. */}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-bounce hover:opacity-100 transition-opacity opacity-60 cursor-pointer" onClick={() => {
                const operaVivaSection = document.getElementById('opera-viva');
                if (operaVivaSection) operaVivaSection.scrollIntoView({ behavior: 'smooth' });
            }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                    {getLocalizedValue(hero.scrollLabel, locale)}
                </span>
                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-md shadow-lg">
                    <i className="fa-solid fa-arrow-down text-white/90 text-sm"></i>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
