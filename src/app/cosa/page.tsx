import React from 'react';
import { getSiteContent } from '@/lib/content-server';
import PageWrapper from '@/components/layout/PageWrapper';
import CosaView from '@/components/sections/CosaView';
import { Metadata } from 'next';

const content = getSiteContent();

export const metadata: Metadata = {
    title: "Cosa facciamo | Opera Viva",
    description: content.seo.description,
};

export default function CosaPage() {
    return (
        <PageWrapper locale="it" content={content}>
            <CosaView content={content} />
        </PageWrapper>
    );
}
