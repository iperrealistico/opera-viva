'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SiteContent, getLocalizedValue, Event } from '@/lib/content';

export default function EventsTimeline({ content }: { content: SiteContent }) {
    const { locale } = useLanguage();
    // Use events from content (will need to add to schema) or fallback to empty array
    // CASTING to any for now until we update the SiteContent interface
    const events = (content as any).events || [];
    const timelineData = (content as any).eventsTimeline || { // Fallback if old JSON
        title: { it: 'Eventi', en: 'Events' },
        lead: { it: 'Mostre, incontri e appuntamenti.', en: 'Exhibitions, meetings and appointments.' },
        detailsLabel: { it: 'Dettagli', en: 'Details' }
    };

    // Sort events by date descending
    const sortedEvents = [...events].sort((a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (!sortedEvents || sortedEvents.length === 0) return null;

    return (
        <section id="events-timeline" className="section py-[var(--s-6)]" aria-label="Eventi">
            <div className="wrap max-w-[75ch] mx-auto">
                <div className="reveal text-center mb-12">
                    <h2 className="h2 mb-4">
                        {getLocalizedValue(timelineData.title, locale)}
                    </h2>
                    <p className="lead opacity-80">
                        {getLocalizedValue(timelineData.lead, locale)}
                    </p>
                </div>

                <div className="timeline relative space-y-12">
                    {/* Central Line for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border)] -translate-x-1/2"></div>

                    {/* Left Line for Mobile */}
                    <div className="md:hidden absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]"></div>

                    {sortedEvents.map((event: any, idx: number) => (
                        <div key={idx} className="timeline-item relative md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 items-center group">

                            {/* Date (Left on Desktop, Right of line on mobile) */}
                            <div className="date pl-12 md:pl-0 md:text-right text-[var(--muted)] font-mono text-sm mb-2 md:mb-0">
                                {new Date(event.date).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>

                            {/* Dot (Center) */}
                            <div className="absolute left-2 md:static md:flex md:justify-center">
                                <div className="w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] z-10 group-hover:bg-[var(--accent)] transition-colors relative"></div>
                            </div>

                            {/* Content (Right on Desktop) */}
                            <div className="content pl-12 md:pl-0 pb-8 md:pb-0 border-b border-[var(--border)] md:border-0 last:border-0">
                                <h3 className="text-xl font-bold mb-2">{getLocalizedValue(event.title, locale)}</h3>
                                <p className="text-[var(--muted)] leading-relaxed">
                                    {getLocalizedValue(event.description, locale)}
                                </p>
                                {event.link && (
                                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm border-b border-[var(--border)] hover:border-[var(--text)] transition-colors">
                                        {getLocalizedValue(timelineData.detailsLabel, locale)}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
