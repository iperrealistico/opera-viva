import React from 'react';
import { getSiteContent } from '@/lib/content-server';
import PageWrapper from '@/components/layout/PageWrapper';
import ContattiView from '@/components/sections/ContattiView';
import { Metadata } from 'next';

const content = getSiteContent();

export const metadata: Metadata = {
    title: "Contact | Opera Viva",
    description: content.seo.description,
};

export default function EnglishContattiPage() {
    return (
        <PageWrapper locale="en" content={content}>
            <ContattiView content={content} />
        </PageWrapper>
    );
}
