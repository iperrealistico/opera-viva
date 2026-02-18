'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteContent } from '@/lib/content';
import { Save, LogOut, Film, Image as LucideImage, Globe, Type, Calendar, LayoutTemplate, Camera, Lightbulb, Ship } from 'lucide-react';
import { AdminSection } from './components/AdminSection';
import { Field } from './components/Field';
import { I18nField } from './components/I18nField';
import { SortableGallery } from './components/SortableGallery';

export default function AdminDashboard() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('pages');
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const res = await fetch('/api/content');
                if (res.ok) {
                    const data = await res.json();
                    setContent(data);
                } else {
                    router.push('/admin');
                }
            } catch (e) {
                console.error("Failed to fetch content", e);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [router]);

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            });
            if (res.ok) {
                alert('Content saved and publishing triggered!');
            } else {
                alert('Error saving content');
            }
        } catch (err) {
            alert('Error connecting to server');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
    };

    // Helper to update state deeply
    const update = (path: string, value: any) => {
        if (!content) return;
        const newContent = JSON.parse(JSON.stringify(content)); // Deep clone
        const parts = path.split('.');
        let current = newContent;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setContent(newContent);
    };

    const handleUpload = async (file: File, index: number): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) return data.url;
            alert('Upload failed: ' + data.error);
            return null;
        } catch (err) {
            alert('Upload error');
            return null;
        }
    };
    const handleNestedUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                update(path, data.url);
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (err) {
            alert('Upload error');
        }
    };


    if (loading) return <div className="min-h-screen grid place-items-center bg-[var(--bg)]">Loading...</div>;
    if (!content) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20">
            {/* Header */}
            <header className="border-b border-[var(--border)] py-4 sticky top-0 bg-[var(--bg)] z-50 shadow-sm">
                <div className="wrap flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="h2 m-0 text-xl font-black uppercase tracking-widest hidden md:block">Admin</h1>
                        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            {['pages', 'global', 'events', 'seo'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[var(--accent)] text-[var(--bg)]' : 'hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSave} disabled={saving} className={`btn px-6 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${saving ? 'bg-yellow-500 text-white' : 'bg-[var(--accent)] text-[var(--bg)] hover:brightness-110'}`}>
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Publish'}
                        </button>
                        <button onClick={handleLogout} className="btn bg-[var(--bg-2)] text-red-500 border border-red-500/20 px-3 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="py-8 wrap max-w-5xl mx-auto">
                {activeTab === 'pages' && (
                    <div className="grid grid-cols-1 gap-8">
                        {/* Hero */}
                        <AdminSection title="Hero Section" icon={<Film size={18} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Field label="Video URL" value={content.sections.hero.videoUrl} onChange={(v) => update('sections.hero.videoUrl', v)} />
                                <Field label="Video Start (s)" value={content.sections.hero.videoStart.toString()} onChange={(v) => update('sections.hero.videoStart', parseInt(v) || 0)} />
                            </div>
                            <div className="mb-6">
                                <label className="micro mb-2 block">Background Image</label>
                                <div className="flex items-center gap-4">
                                    <img src={content.sections.hero.backgroundImage || "/img/opera-viva-1.jpg"} alt="Hero BG" className="h-24 w-40 object-cover border border-[var(--border)] rounded bg-[var(--bg-3)]" />
                                    <label className="btn bg-[var(--surface)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 hover:bg-[var(--bg-2)] border border-[var(--border)]">
                                        Change Image
                                        <input type="file" className="hidden" onChange={(e) => handleNestedUpload(e, 'sections.hero.backgroundImage')} />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <I18nField label="Title" value={content.sections.hero.title} onChange={(v) => update('sections.hero.title', v)} />
                                <I18nField label="Subtitle" value={content.sections.hero.subtitle} onChange={(v) => update('sections.hero.subtitle', v)} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <I18nField label="CTA 1 Label" value={content.sections.hero.cta[0].label} onChange={(v) => update('sections.hero.cta.0.label', v)} />
                                    <I18nField label="CTA 2 Label" value={content.sections.hero.cta[1].label} onChange={(v) => update('sections.hero.cta.1.label', v)} />
                                </div>
                            </div>
                        </AdminSection>

                        {/* Opera Viva */}
                        <AdminSection title="Opera Viva Intro" icon={<Ship size={18} />}>
                            <I18nField label="Kicker" value={content.sections.operaViva.kicker} onChange={(v) => update('sections.operaViva.kicker', v)} />
                            <div className="h-4" />
                            <I18nField label="Title" value={content.sections.operaViva.title} onChange={(v) => update('sections.operaViva.title', v)} />
                            <div className="h-4" />
                            <I18nField label="Lead Text" value={content.sections.operaViva.lead} onChange={(v) => update('sections.operaViva.lead', v)} textarea />
                            <div className="h-6" />
                            <label className="micro mb-2 block">Paragraphs</label>
                            <div className="space-y-4">
                                {content.sections.operaViva.paragraphs.map((_, idx) => (
                                    <I18nField
                                        key={idx}
                                        label={`Paragraph ${idx + 1}`}
                                        value={content.sections.operaViva.paragraphs[idx]}
                                        onChange={(v) => update(`sections.operaViva.paragraphs.${idx}`, v)}
                                        textarea
                                    />
                                ))}
                            </div>
                        </AdminSection>

                        {/* Galleria (Grid) */}
                        <AdminSection title="Grid Gallery" icon={<LucideImage size={18} />} defaultOpen>
                            <div className="mb-6">
                                <I18nField label="Title" value={content.sections.galleria.title} onChange={(v) => update('sections.galleria.title', v)} />
                                <div className="h-4" />
                                <I18nField label="Lead" value={content.sections.galleria.lead} onChange={(v) => update('sections.galleria.lead', v)} />
                            </div>
                            <SortableGallery
                                items={content.sections.galleria.items}
                                onUpdate={(items) => update('sections.galleria.items', items)}
                                onUpload={handleUpload}
                            />
                        </AdminSection>

                        {/* Come Lo Facciamo (Carousel) */}
                        <AdminSection title="Come Lo Facciamo (Horizontal Gallery)" icon={<Camera size={18} />}>
                            <I18nField label="Title" value={content.sections.comeLoFacciamo.title} onChange={(v) => update('sections.comeLoFacciamo.title', v)} />
                            <div className="h-4" />
                            <I18nField label="Lead" value={content.sections.comeLoFacciamo.lead} onChange={(v) => update('sections.comeLoFacciamo.lead', v)} />

                            <div className="my-8 border-t border-[var(--border)]/50 pt-6">
                                <h4 className="micro mb-4 text-[var(--accent)]">Horizontal Gallery Images</h4>
                                <SortableGallery
                                    items={content.sections.comeLoFacciamo.gallery}
                                    onUpdate={(items) => update('sections.comeLoFacciamo.gallery', items)}
                                    onUpload={handleUpload}
                                />
                            </div>
                        </AdminSection>

                        {/* Cosa Facciamo */}
                        <AdminSection title="Cosa Facciamo (Offer)" icon={<LayoutTemplate size={18} />}>
                            <I18nField label="Title" value={content.sections.cosaFacciamo.title} onChange={(v) => update('sections.cosaFacciamo.title', v)} />
                            <div className="h-4" />
                            <I18nField label="Lead" value={content.sections.cosaFacciamo.lead} onChange={(v) => update('sections.cosaFacciamo.lead', v)} textarea />
                        </AdminSection>

                        {/* Tecniche */}
                        <AdminSection title="Tecniche" icon={<Lightbulb size={18} />}>
                            <I18nField label="Title" value={content.techniques.title} onChange={(v) => update('techniques.title', v)} />
                            <div className="h-4" />
                            <I18nField label="Lead" value={content.techniques.lead} onChange={(v) => update('techniques.lead', v)} textarea />
                        </AdminSection>

                    </div>
                )}

                {activeTab === 'global' && (
                    <AdminSection title="Contact Info" icon={<Globe size={18} />} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Email" value={content.sections.contatti.email} onChange={(v) => update('sections.contatti.email', v)} />
                            <Field label="Instagram URL" value={content.sections.contatti.instagram} onChange={(v) => update('sections.contatti.instagram', v)} />
                        </div>
                        <div className="h-4" />
                        <I18nField label="Button Label" value={(content as any).contactsSection.buttonLabel} onChange={(v) => update('contactsSection.buttonLabel', v)} />
                        <div className="h-6" />
                        <I18nField label="Title" value={content.sections.contatti.title} onChange={(v) => update('sections.contatti.title', v)} />
                        <div className="h-4" />
                        <I18nField label="Lead" value={content.sections.contatti.lead} onChange={(v) => update('sections.contatti.lead', v)} />
                    </AdminSection>
                )}

                {activeTab === 'events' && (
                    <AdminSection title="Events Management" icon={<Calendar size={18} />} defaultOpen>
                        <button onClick={() => {
                            const newEvent = {
                                title: { it: 'Nuovo Evento', en: 'New Event' },
                                date: new Date().toISOString().split('T')[0],
                                description: { it: 'Descrizione...', en: 'Description...' },
                                link: ''
                            };
                            const events = [...(content.events || []), newEvent];
                            update('events', events);
                        }} className="btn bg-[var(--surface)] text-[var(--text)] px-4 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs border border-[var(--border)] hover:bg-[var(--bg-2)] mb-6">
                            + Add Event
                        </button>

                        <div className="mb-8 p-6 border border-[var(--border)] bg-[var(--bg-2)]/30 rounded-lg">
                            <h4 className="micro mb-4 text-[var(--accent)]">Events Section Texts</h4>
                            <I18nField label="Section Title" value={(content as any).eventsTimeline.title} onChange={(v) => update('eventsTimeline.title', v)} />
                            <div className="h-4" />
                            <I18nField label="Section Lead" value={(content as any).eventsTimeline.lead} onChange={(v) => update('eventsTimeline.lead', v)} />
                            <div className="h-4" />
                            <I18nField label="Details Button Label" value={(content as any).eventsTimeline.detailsLabel} onChange={(v) => update('eventsTimeline.detailsLabel', v)} />
                        </div>

                        <div className="space-y-4">
                            {(content.events || []).map((event: any, idx: number) => (
                                <div key={idx} className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-2)] relative">
                                    <button onClick={() => {
                                        const events = [...(content.events || [])];
                                        events.splice(idx, 1);
                                    }} className="absolute top-4 right-4 text-red-500 hover:bg-red-500/10 p-2 rounded" title="Remove">
                                        <LogOut size={16} className="rotate-180" />
                                    </button>

                                    <div className="grid grid-cols-1 gap-6 pr-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Field label="Date" value={event.date} onChange={(v) => update(`events.${idx}.date`, v)} />
                                            <Field label="Link" value={event.link || ''} onChange={(v) => update(`events.${idx}.link`, v)} />
                                        </div>
                                        <I18nField label="Title" value={event.title} onChange={(v) => update(`events.${idx}.title`, v)} />
                                        <I18nField label="Description" value={event.description} onChange={(v) => update(`events.${idx}.description`, v)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AdminSection>
                )}

                {activeTab === 'seo' && (
                    <AdminSection title="SEO & Metadata" icon={<Type size={18} />} defaultOpen>
                        <Field label="Site Title" value={content.seo.title} onChange={(v) => update('seo.title', v)} />
                        <div className="h-6" />
                        <Field label="Description" value={content.seo.description} onChange={(v) => update('seo.description', v)} textarea />
                        <div className="h-6" />
                        <div className="flex flex-col gap-2">
                            <label className="micro">OG Image</label>
                            <div className="flex items-center gap-4">
                                <img src={content.seo.ogImage} alt="OG" className="h-24 w-40 object-cover border border-[var(--border)] rounded bg-[var(--bg-3)]" />
                                <label className="btn bg-[var(--surface)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 hover:bg-[var(--bg-2)] border border-[var(--border)]">
                                    Change Image
                                    <input type="file" className="hidden" onChange={(e) => handleNestedUpload(e, 'seo.ogImage')} />
                                </label>
                            </div>
                        </div>
                    </AdminSection>
                )}
            </main>
        </div>
    );
}
