'use client';

import React, { useEffect } from 'react';
import { Locale, SiteContent } from '@/lib/content';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function PageWrapper({
    children,
    locale,
    content
}: {
    children: React.ReactNode;
    locale: Locale;
    content: SiteContent;
}) {
    const pathname = usePathname();

    useEffect(() => {
        // Reveal animation logic
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <LanguageProvider locale={locale}>
            <Header content={content} />
            <main id="main">
                <div className="viewShell opacity-100 translate-y-0 transition-all duration-720">
                    {children}
                </div>
            </main>
            <Footer content={content} />
        </LanguageProvider>
    );
}
