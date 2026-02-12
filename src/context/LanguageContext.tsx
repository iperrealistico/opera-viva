'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Locale } from '@/lib/content';

interface LanguageContextType {
    locale: Locale;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
    return (
        <LanguageContext.Provider value={{ locale }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
