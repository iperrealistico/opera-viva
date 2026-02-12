import React from 'react';
import { getSiteContent } from '@/lib/content-server';
import PageWrapper from '@/components/layout/PageWrapper';
import ContattiView from '@/components/sections/ContattiView';
import { Metadata } from 'next';

const content = getSiteContent();

export const metadata: Metadata = {
    title: "Contatti | Opera Viva",
    description: content.seo.description,
};

export default function ContattiPage() {
    return (
        <PageWrapper locale="it" content={content}>
            <ContattiView content={content} />
        </PageWrapper>
    );
}
