import React from 'react';
import { getSiteContent } from '@/lib/content-server';
import PageWrapper from '@/components/layout/PageWrapper';
import HomeView from '@/components/sections/HomeView';
import { Metadata } from 'next';

const content = getSiteContent();

export const metadata: Metadata = {
    title: "Opera Viva | Photographic project",
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: {
        canonical: '/en',
        languages: {
            'it': '/',
            'en': '/en',
            'x-default': '/'
        }
    },
    openGraph: {
        title: "Opera Viva | Photographic project",
        description: content.seo.description,
        images: [content.seo.ogImage],
        locale: 'en_US',
        type: 'website',
    }
};

export default function EnglishHomePage() {
    return (
        <PageWrapper locale="en" content={content}>
            <HomeView content={content} />
        </PageWrapper>
    );
}
