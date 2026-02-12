import React from 'react';
import { getSiteContent } from '@/lib/content-server';
import PageWrapper from '@/components/layout/PageWrapper';
import HomeView from '@/components/sections/HomeView';
import { Metadata } from 'next';

const content = getSiteContent();

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  alternates: {
    canonical: '/',
    languages: {
      'it': '/',
      'en': '/en',
      'x-default': '/'
    }
  },
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    images: [content.seo.ogImage],
    locale: 'it_IT',
    type: 'website',
  }
};

export default function HomePage() {
  return (
    <PageWrapper locale="it" content={content}>
      <HomeView content={content} />
    </PageWrapper>
  );
}
