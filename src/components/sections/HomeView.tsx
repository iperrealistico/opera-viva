'use client';

import React, { useEffect } from 'react';
import { SiteContent } from '@/lib/content';
import Hero from '@/components/sections/Hero';
import OperaViva from '@/components/sections/OperaViva';
import ComeLoFacciamo from '@/components/sections/ComeLoFacciamo';
import Galleria from '@/components/sections/Galleria';
import EventsTimeline from '@/components/sections/EventsTimeline';
import ContactsSection from '@/components/sections/ContactsSection';


export default function HomeView({ content }: { content: SiteContent }) {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initLightbox = async () => {
            const GLightbox = (await import('glightbox')).default;
            const lightbox = GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true
            });
            return lightbox;
        };

        let lb: any;
        initLightbox().then(instance => lb = instance);

        return () => {
            if (lb) lb.destroy();
        };
    }, []);

    return (
        <>
            <Hero content={content} />
            <OperaViva content={content} />
            <Galleria content={content} />
            <ComeLoFacciamo content={content} />
            <EventsTimeline content={content} />
            <ContactsSection content={content} />
        </>
    );
}
