import React from 'react';
import { getSiteContent } from '@/lib/content-server';
import PageWrapper from '@/components/layout/PageWrapper';
import TecnicheView from '@/components/sections/TecnicheView';
import { Metadata } from 'next';

const content = getSiteContent();

export const metadata: Metadata = {
    title: "Come lo facciamo | Opera Viva",
    description: content.seo.description,
};

export default function TecnichePage() {
    return (
        <PageWrapper locale="it" content={content}>
            <TecnicheView content={content} />
        </PageWrapper>
    );
}
