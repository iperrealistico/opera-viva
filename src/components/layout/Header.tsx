'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue } from '@/lib/content';
import { useTheme } from 'next-themes';
import { Menu, X, Globe, Sun, Moon, House } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Header({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 12);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    const toggleLanguage = () => {
        const nextLocale = locale === 'it' ? 'en' : 'it';
        const path = window.location.pathname;
        let newPath = '';

        if (locale === 'it') {
            newPath = `/en${path === '/' ? '' : path}`;
        } else {
            newPath = path.replace(/^\/en/, '') || '/';
        }

        window.location.href = newPath;
    };

    return (
        <header
            className={cn(
                "site-header fixed top-0 left-0 right-0 z-[70] transition-colors duration-300",
                isScrolled ? "is-scrolled" : ""
            )}
        >
            <div className="wrap flex items-center justify-end py-4 relative">
                <div
                    className={cn(
                        "headerPill inline-flex items-center gap-2.5 rounded-[var(--r-ui)] p-0 transition-all duration-320",
                        isScrolled && "backdrop-blur-[14px] bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] shadow-[0_22px_110px_var(--shadow)] p-1.5"
                    )}
                >
                    <button
                        className="icon-btn w-[42px] h-[42px] rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] grid place-items-center hover:translate-y-[-1px] active:translate-y-0 transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
                    </button>

                    <div
                        className={cn(
                            "popMenu absolute top-[calc(100%+10px)] right-0 flex items-center gap-2 p-2 rounded-[18px] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] backdrop-blur-[14px] shadow-[0_26px_120px_var(--shadow)] origin-top-right transition-all duration-320",
                            isMenuOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-[-6px] scale-[0.98] pointer-events-none"
                        )}
                        style={{ borderRadius: 'var(--r-ui)' }}
                    >
                        {(typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '/en') && (
                            <Link href={locale === 'it' ? "/" : "/en"} className="icon-btn w-[42px] h-[42px] rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] grid place-items-center hover:translate-y-[-1px] transition-all">
                                <i className="fa-solid fa-house"></i>
                            </Link>
                        )}

                        <Link href={locale === 'it' ? "/tecniche" : "/en/tecniche"} className="icon-btn w-[42px] h-[42px] rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] grid place-items-center hover:translate-y-[-1px] transition-all">
                            <i className="fa-solid fa-layer-group"></i>
                        </Link>

                        <Link href={locale === 'it' ? "/contatti" : "/en/contatti"} className="icon-btn w-[42px] h-[42px] rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] grid place-items-center hover:translate-y-[-1px] transition-all">
                            <i className="fa-solid fa-paper-plane"></i>
                        </Link>

                        <button
                            className="chip-btn h-[42px] px-3 rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] inline-flex items-center gap-2 hover:translate-y-[-1px] transition-all font-[950] text-[0.78em] uppercase tracking-[0.14em]"
                            onClick={toggleLanguage}
                        >
                            <i className="fa-solid fa-globe"></i>
                            <span>{locale.toUpperCase()}</span>
                        </button>
                    </div>

                    {(typeof window !== 'undefined' && window.location.pathname !== '/' && window.location.pathname !== '/en') && (
                        <Link href={locale === 'it' ? "/" : "/en"} className="icon-btn headerHomeBtn w-[42px] h-[42px] rounded-[var(--r-ui)] border border-[color-mix(in_oklab,var(--border)_85%,transparent)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] grid place-items-center hover:translate-y-[-1px] active:translate-y-0 transition-all ml-auto">
                            <i className="fa-solid fa-house"></i>
                        </Link>
                    )}
                </div>
            </div>

            <style jsx>{`
        .site-header.is-over-hero .icon-btn,
        .site-header.is-over-hero .chip-btn {
          color: rgba(255,255,255,.93);
          border-color: rgba(255,255,255,.20);
          background: rgba(0,0,0,.18);
        }
        .site-header.is-over-hero.is-scrolled .headerPill {
          background: rgba(0,0,0,.32);
          border-color: rgba(255,255,255,.18);
        }
      `}</style>
        </header>
    );
}
