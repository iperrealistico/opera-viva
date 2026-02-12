'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteContent } from '@/lib/content';
import { Save, LogOut, Upload, Plus, Trash2, Globe, Type, Image as LucideImage, Film, Calendar } from 'lucide-react';

export default function AdminDashboard() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('sections');
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            const res = await fetch('/api/content');
            if (res.ok) {
                const data = await res.json();
                setContent(data);
            } else {
                router.push('/admin');
            }
            setLoading(false);
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

    const updateNested = (path: string, value: any) => {
        if (!content) return;
        const newContent = { ...content };
        const parts = path.split('.');
        let current: any = newContent;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setContent(newContent);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
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
                updateNested(path, data.url);
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
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            {/* Header */}
            <header className="border-b border-[var(--border)] py-4 sticky top-0 bg-[var(--bg)] z-50">
                <div className="wrap flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="h2 m-0 text-xl font-black uppercase tracking-widest">Admin</h1>
                        <nav className="flex items-center gap-2">
                            <button onClick={() => setActiveTab('sections')} className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${activeTab === 'sections' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'hover:bg-[var(--surface)]'}`}>Sections</button>
                            <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${activeTab === 'events' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'hover:bg-[var(--surface)]'}`}>Events</button>
                            <button onClick={() => setActiveTab('seo')} className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${activeTab === 'seo' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'hover:bg-[var(--surface)]'}`}>SEO</button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSave} disabled={saving} className="btn bg-[var(--accent)] text-[var(--bg)] px-6 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                            <Save size={16} />
                            {saving ? 'Publishing...' : 'Publish'}
                        </button>
                        <button onClick={handleLogout} className="btn bg-red-900/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="py-8">
                <div className="wrap grid grid-cols-1 gap-8">
                    {activeTab === 'sections' && (
                        <div className="grid grid-cols-1 gap-12">
                            {/* Hero Section */}
                            <section className="border border-[var(--border)] p-6 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] rounded-[var(--r-ui)]">
                                <h3 className="h2 text-lg mb-6 flex items-center gap-2"><Film size={20} /> Hero</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Video URL" value={content.sections.hero.videoUrl} onChange={(v) => updateNested('sections.hero.videoUrl', v)} />
                                    <Field label="Video Start (s)" value={content.sections.hero.videoStart.toString()} onChange={(v) => updateNested('sections.hero.videoStart', parseInt(v) || 0)} />
                                    <I18nField label="Title" value={content.sections.hero.title} onChange={(v) => updateNested('sections.hero.title', v)} />
                                    <I18nField label="Subtitle" value={content.sections.hero.subtitle} onChange={(v) => updateNested('sections.hero.subtitle', v)} />
                                </div>
                            </section>

                            {/* Galleria Section */}
                            <section className="border border-[var(--border)] p-6 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] rounded-[var(--r-ui)]">
                                <h3 className="h2 text-lg mb-6 flex items-center gap-2"><LucideImage size={20} /> Galleria</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {content.sections.galleria.items.map((item, idx) => (
                                        <div key={idx} className="relative group aspect-[3/4] border border-[var(--border)] overflow-hidden rounded-lg bg-[var(--bg-2)]">
                                            <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                                                <label className="cursor-pointer bg-white text-black px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <Upload size={10} /> Change
                                                    <input type="file" className="hidden" onChange={(e) => handleUpload(e, `sections.galleria.items.${idx}.src`)} />
                                                </label>
                                                <button onClick={() => {
                                                    const items = [...content.sections.galleria.items];
                                                    items.splice(idx, 1);
                                                    updateNested('sections.galleria.items', items);
                                                }} className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <Trash2 size={10} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => {
                                        const items = [...content.sections.galleria.items, { src: '/img/placeholder.jpg', alt: 'Nuova foto' }];
                                        updateNested('sections.galleria.items', items);
                                    }} className="aspect-[3/4] border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-[var(--surface)] text-[var(--muted)]">
                                        <Plus size={24} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Item</span>
                                    </button>
                                </div>
                            </section>

                            {/* Contatti Section */}
                            <section className="border border-[var(--border)] p-6 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] rounded-[var(--r-ui)]">
                                <h3 className="h2 text-lg mb-6 flex items-center gap-2"><Globe size={20} /> Contatti</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Email" value={content.sections.contatti.email} onChange={(v) => updateNested('sections.contatti.email', v)} />
                                    <Field label="Instagram URL" value={content.sections.contatti.instagram} onChange={(v) => updateNested('sections.contatti.instagram', v)} />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="grid grid-cols-1 gap-12">
                            <section className="border border-[var(--border)] p-6 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] rounded-[var(--r-ui)]">
                                <h3 className="h2 text-lg mb-6 flex items-center gap-2"><Type size={20} /> Site Metadata</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <Field label="Site Title" value={content.seo.title} onChange={(v) => updateNested('seo.title', v)} />
                                    <Field label="Description" value={content.seo.description} onChange={(v) => updateNested('seo.description', v)} textarea />
                                    <div className="flex flex-col gap-2">
                                        <label className="micro">OG Image</label>
                                        <div className="flex items-center gap-4">
                                            <img src={content.seo.ogImage} alt="OG" className="h-20 w-32 object-cover border border-[var(--border)] rounded" />
                                            <label className="btn bg-[var(--surface)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2">
                                                <Upload size={14} /> Change Image
                                                <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'seo.ogImage')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="grid grid-cols-1 gap-12">
                            <section className="border border-[var(--border)] p-6 bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] rounded-[var(--r-ui)]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="h2 text-lg flex items-center gap-2"><Calendar size={20} /> Events</h3>
                                    <button onClick={() => {
                                        const newEvent = {
                                            title: { it: 'Nuovo Evento', en: 'New Event' },
                                            date: new Date().toISOString().split('T')[0],
                                            description: { it: 'Descrizione...', en: 'Description...' },
                                            link: ''
                                        };
                                        const events = [...(content.events || []), newEvent];
                                        updateNested('events', events);
                                    }} className="btn bg-[var(--surface)] text-[var(--text)] px-4 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs border border-[var(--border)] hover:bg-[var(--bg-2)]">
                                        <Plus size={16} /> Add Event
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {(content.events || []).map((event: any, idx: number) => (
                                        <div key={idx} className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-2)] relative group">
                                            <button onClick={() => {
                                                const events = [...(content.events || [])];
                                                events.splice(idx, 1);
                                                updateNested('events', events);
                                            }} className="absolute top-4 right-4 text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors" title="Remove Event">
                                                <Trash2 size={18} />
                                            </button>

                                            <div className="grid grid-cols-1 gap-6 pr-12">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Field label="Date (YYYY-MM-DD)" value={event.date} onChange={(v) => updateNested(`events.${idx}.date`, v)} />
                                                    <Field label="Link (optional)" value={event.link || ''} onChange={(v) => updateNested(`events.${idx}.link`, v)} />
                                                </div>
                                                <I18nField label="Title" value={event.title} onChange={(v) => updateNested(`events.${idx}.title`, v)} />
                                                <I18nField label="Description" value={event.description} onChange={(v) => updateNested(`events.${idx}.description`, v)} />
                                            </div>
                                        </div>
                                    ))}

                                    {(!content.events || content.events.length === 0) && (
                                        <p className="text-[var(--muted)] text-center py-8">No events found. Click "Add Event" to create one.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>

            <style jsx global>{`
        .h2 { opacity: 1 !important; transform: none !important; filter: none !important; }
      `}</style>
        </div>
    );
}

// ... existing helper components ...

function Field({ label, value, onChange, textarea }: { label: string, value: string, onChange: (v: string) => void, textarea?: boolean }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="micro">{label}</label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[100px]"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
            )}
        </div>
    );
}

function I18nField({ label, value, onChange }: { label: string, value: { it: string, en: string }, onChange: (v: { it: string, en: string }) => void }) {
    return (
        <div className="flex flex-col gap-3 p-4 border border-[var(--border)]/50 rounded-lg">
            <label className="micro text-[var(--accent)] font-black">{label}</label>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-[var(--muted)] w-6">IT</span>
                    <input
                        type="text"
                        value={value.it}
                        onChange={(e) => onChange({ ...value, it: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-[var(--muted)] w-6">EN</span>
                    <input
                        type="text"
                        value={value.en}
                        onChange={(e) => onChange({ ...value, en: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
                    />
                </div>
            </div>
        </div>
    );
}
