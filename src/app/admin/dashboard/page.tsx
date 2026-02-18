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
    const [checkResult, setCheckResult] = useState<any>(null);
    const [checking, setChecking] = useState(false);
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
            const data = await res.json();
            if (res.ok) {
                if (data.warning) {
                    alert('Saved locally! Warning: ' + data.warning);
                } else {
                    alert('Content saved and publishing triggered!');
                }
            } else {
                alert('Error saving content: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert('Error connecting to server');
        } finally {
            setSaving(false);
        }
    };

    const handleCheckConnectivity = async () => {
        setChecking(true);
        setCheckResult(null);
        try {
            const res = await fetch('/api/connectivity');
            const data = await res.json();
            setCheckResult(data);
        } catch (err) {
            setCheckResult({ success: false, error: 'Failed to contact server' });
        } finally {
            setChecking(false);
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
        // Enforce 4.5MB limit (Vercel Serverless Function Limit)
        if (file.size > 4.5 * 1024 * 1024) {
            alert(`File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Vercel Serverless Function limit is 4.5 MB. Please compress the image before uploading.`);
            return null;
        }

        console.log(`Uploading file: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });

            let data;
            const text = await res.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                // Not JSON, probably an HTML error page from Vercel/Next
                alert(`Upload failed (Server Error): ${res.status} ${res.statusText}\n${text.substring(0, 100)}...`);
                return null;
            }

            if (res.ok && data.success) return data.url;

            alert(`Upload failed: ${data.error || 'Unknown error'}`);
            return null;
        } catch (err: any) {
            console.error(err);
            alert(`Upload Client Error: ${err.message}`);
            return null;
        }
    };
    const handleNestedUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Enforce 4.5MB limit
        if (file.size > 4.5 * 1024 * 1024) {
            alert(`File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Vercel Serverless Function limit is 4.5 MB.`);
            return;
        }

        console.log(`Uploading nested file: ${file.name}, Size: ${file.size} bytes`);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            let data;
            const text = await res.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                alert(`Upload failed (Server Error): ${res.status} ${res.statusText}\n${text.substring(0, 100)}...`);
                return;
            }

            if (res.ok && data.success) {
                update(path, data.url);
            } else {
                alert(`Upload failed: ${data.error || 'Unknown error'}`);
            }
        } catch (err: any) {
            console.error(err);
            alert(`Upload Client Error: ${err.message}`);
        }
    };


    if (loading) return <div className="min-h-screen grid place-items-center bg-[var(--bg)]">Loading...</div>;
    if (!content) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20 relative">
            {/* Connectivity Modal */}
            {checkResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setCheckResult(null)}>
                    <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-lg p-6 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setCheckResult(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-white">
                            <LogOut size={16} className="rotate-45" />
                        </button>
                        <h3 className="h2 text-lg mb-4 flex items-center gap-2">
                            {checkResult.success ? <div className="w-3 h-3 rounded-full bg-green-500"></div> : <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                            GitHub Connectivity
                        </h3>

                        {checkResult.checks ? (
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-[var(--border)] pb-2">
                                    <span className="text-[var(--muted)]">Env Vars Present</span>
                                    <span className={checkResult.checks.envVars.GITHUB_TOKEN ? "text-green-500" : "text-red-500"}>
                                        {checkResult.checks.envVars.GITHUB_TOKEN ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div className="border-b border-[var(--border)] pb-2">
                                    <div className="text-[var(--muted)] mb-1">Status</div>
                                    <div className={checkResult.success ? "text-green-500" : "text-red-500"}>
                                        {checkResult.checks.connection.message}
                                    </div>
                                </div>
                                {checkResult.checks.permissions && (
                                    <div>
                                        <div className="text-[var(--muted)] mb-1">Permissions</div>
                                        <div className="grid grid-cols-3 gap-2 text-center micro">
                                            <div className={`p-1 rounded ${checkResult.checks.permissions.admin ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>Admin</div>
                                            <div className={`p-1 rounded ${checkResult.checks.permissions.push ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>Push</div>
                                            <div className={`p-1 rounded ${checkResult.checks.permissions.pull ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>Pull</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-red-500">{checkResult.error}</div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setCheckResult(null)} className="btn bg-[var(--surface)] px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border border-[var(--border)] hover:bg-[var(--bg-3)]">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-[var(--border)] py-4 sticky top-0 bg-[var(--bg)] z-50 shadow-sm">
                <div className="wrap flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="h2 m-0 text-xl font-black uppercase tracking-widest hidden md:block">Admin</h1>
                        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            {['pages', 'techniques', 'global', 'events', 'seo', 'advanced'].map(tab => (
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
                        <button
                            onClick={handleCheckConnectivity}
                            disabled={checking}
                            className="btn bg-[var(--bg-2)] text-[var(--muted)] border border-[var(--border)] px-3 py-2 rounded-lg flex items-center gap-2 font-black uppercase tracking-widest text-xs hover:bg-[var(--surface)] transition-colors hidden sm:flex"
                            title="Check GitHub Connection"
                        >
                            <Globe size={16} className={checking ? "animate-spin" : ""} />
                        </button>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-1">
                                    <label className="micro block">Hero Media Type</label>
                                    <select
                                        value={content.sections.hero.mediaType || 'image'}
                                        onChange={(e) => update('sections.hero.mediaType', e.target.value)}
                                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] outline-none"
                                    >
                                        <option value="image">Photo</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>
                                <div className="flex items-center h-full pt-6">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <div className={`w-5 h-5 rounded border border-[var(--border)] flex items-center justify-center transition-colors ${content.sections.hero.showLogo !== false ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--bg)]'}`}>
                                            {content.sections.hero.showLogo !== false && <i className="fa-solid fa-check text-[var(--bg)] text-xs"></i>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={content.sections.hero.showLogo !== false}
                                            onChange={(e) => update('sections.hero.showLogo', e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="micro">Show Logo Overlay</span>
                                    </label>
                                </div>
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

                        {/* Tecniche - Moved to dedicated tab */}

                    </div>
                )}

                {activeTab === 'techniques' && (
                    <div className="grid grid-cols-1 gap-8">
                        {/* Homepage Cards */}
                        <AdminSection title="Homepage Cards (Techniques)" icon={<LayoutTemplate size={18} />}>
                            <p className="text-sm text-[var(--muted)] mb-6">These cards appear on the Homepage under "Come lo facciamo".</p>
                            <div className="grid grid-cols-1 gap-6">
                                {content.sections.comeLoFacciamo.items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-2)]/50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 flex items-center justify-center bg-[var(--surface)] rounded border border-[var(--border)] text-[var(--text)]">
                                                <i className={`fa-solid fa-${item.icon} text-lg`}></i>
                                            </div>
                                            <Field label="Icon Name (FontAwesome)" value={item.icon} onChange={(v) => update(`sections.comeLoFacciamo.items.${idx}.icon`, v)} />
                                        </div>
                                        <I18nField label="Card Title" value={item.title} onChange={(v) => update(`sections.comeLoFacciamo.items.${idx}.title`, v)} />
                                        <div className="h-4" />
                                        <I18nField label="Card Text" value={item.text} onChange={(v) => update(`sections.comeLoFacciamo.items.${idx}.text`, v)} textarea />
                                    </div>
                                ))}
                            </div>
                        </AdminSection>

                        {/* Techniques Page Content */}
                        <AdminSection title="/tecniche/ Page Content" icon={<Lightbulb size={18} />} defaultOpen>
                            <div className="mb-8 p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-2)]/30">
                                <h4 className="micro mb-4 text-[var(--accent)]">Page Header</h4>
                                <I18nField label="Kicker" value={content.techniques.kicker} onChange={(v) => update('techniques.kicker', v)} />
                                <div className="h-4" />
                                <I18nField label="Title" value={content.techniques.title} onChange={(v) => update('techniques.title', v)} />
                                <div className="h-4" />
                                <I18nField label="Lead" value={content.techniques.lead} onChange={(v) => update('techniques.lead', v)} textarea />
                                <div className="h-4" />
                                <I18nField label="Back Button Label" value={content.techniques.backLabel} onChange={(v) => update('techniques.backLabel', v)} />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="micro text-[var(--accent)]">Detailed Sections</h4>
                                    <button onClick={() => {
                                        const newSection = {
                                            id: `section-${Date.now()}`,
                                            image: '',
                                            title: { it: 'Nuova Sezione', en: 'New Section' },
                                            paragraphs: [{ it: 'Paragrafo...', en: 'Paragraph...' }]
                                        };
                                        const sections = [...content.techniques.sections, newSection];
                                        update('techniques.sections', sections);
                                    }} className="btn bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 rounded text-xs border border-[var(--border)] hover:bg-[var(--bg-2)] flex items-center gap-2">
                                        <i className="fa-solid fa-plus"></i> Add Section
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {content.techniques.sections.map((section: any, idx: number) => (
                                        <div key={section.id} className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg-2)] relative">
                                            <button onClick={() => {
                                                const sections = [...content.techniques.sections];
                                                sections.splice(idx, 1);
                                                update('techniques.sections', sections);
                                            }} className="absolute top-4 right-4 text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors" title="Remove Section">
                                                <LogOut size={16} className="rotate-180" />
                                            </button>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="micro mb-2 block">Section Image</label>
                                                    <div className="flex items-center gap-4">
                                                        <img src={section.image || '/placeholder.jpg'} alt="Preview" className="h-24 w-40 object-cover border border-[var(--border)] rounded bg-[var(--bg-3)]" />
                                                        <label className="btn bg-[var(--surface)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 hover:bg-[var(--bg-2)] border border-[var(--border)]">
                                                            Upload Image
                                                            <input type="file" className="hidden" onChange={(e) => handleNestedUpload(e, `techniques.sections.${idx}.image`)} />
                                                        </label>
                                                    </div>
                                                </div>

                                                <I18nField label="Section Title" value={section.title} onChange={(v) => update(`techniques.sections.${idx}.title`, v)} />

                                                <div className="pt-4 border-t border-[var(--border)]/50">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <label className="micro">Paragraphs</label>
                                                        <button onClick={() => {
                                                            const newPara = { it: 'Nuovo paragrafo', en: 'New paragraph' };
                                                            const updatedSections = [...content.techniques.sections];
                                                            updatedSections[idx].paragraphs.push(newPara);
                                                            update('techniques.sections', updatedSections);
                                                        }} className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider hover:underline">+ Add Paragraph</button>
                                                    </div>
                                                    <div className="space-y-4 pl-4 border-l-2 border-[var(--border)]">
                                                        {section.paragraphs.map((para: any, pIdx: number) => (
                                                            <div key={pIdx} className="relative group">
                                                                <I18nField
                                                                    label={`Paragraph ${pIdx + 1}`}
                                                                    value={para}
                                                                    onChange={(v) => update(`techniques.sections.${idx}.paragraphs.${pIdx}`, v)}
                                                                    textarea
                                                                />
                                                                <button onClick={() => {
                                                                    const updatedSections = [...content.techniques.sections];
                                                                    updatedSections[idx].paragraphs.splice(pIdx, 1);
                                                                    update('techniques.sections', updatedSections);
                                                                }} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 font-bold" title="Remove Paragraph">✕</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                        <div className="h-8" />

                        {/* Favicon Section */}
                        <div className="mb-8 p-6 border border-[var(--border)] bg-[var(--bg-2)]/30 rounded-lg">
                            <h4 className="micro mb-4 text-[var(--accent)]">Site Favicon</h4>
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[var(--bg)] border border-[var(--border)] rounded flex items-center justify-center">
                                    <img src="/favicon.ico" alt="Favicon" className="w-8 h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--muted)] mb-3 max-w-[40ch]">
                                        Upload a high-res square image (PNG/JPG). We will generate all required favicon sizes automatically.
                                    </p>
                                    <label className="btn bg-[var(--surface)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-2 hover:bg-[var(--bg-2)] border border-[var(--border)] w-fit">
                                        Generate & Upload Favicon
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/svg+xml"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append('file', file);

                                                if (!confirm("This will overwrite existing favicons and trigger a redeploy. Continue?")) return;

                                                try {
                                                    const res = await fetch('/api/favicon', { method: 'POST', body: formData });
                                                    const data = await res.json();
                                                    if (res.ok) {
                                                        alert(data.message);
                                                    } else {
                                                        alert('Error: ' + data.error);
                                                    }
                                                } catch (err) {
                                                    alert('Upload failed');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </AdminSection>
                )}

                {activeTab === 'advanced' && (
                    <AdminSection title="Advanced Settings" icon={<div className="w-[18px] text-center"><i className="fa-solid fa-gear"></i></div>} defaultOpen>
                        <div className="bg-[var(--bg-2)]/30 p-6 rounded-lg border border-[var(--border)] mb-8">
                            <h4 className="micro mb-4 text-[var(--accent)]">Storage Configuration</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="micro block">Storage Provider</label>
                                    <select
                                        value={content.adminConfig?.storage || 'vercel-blob'}
                                        onChange={(e) => update('adminConfig.storage', e.target.value)}
                                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] focus:border-[var(--accent)] outline-none appearance-none"
                                    >
                                        <option value="vercel-blob">Vercel Blob (Recommended)</option>
                                        <option value="github">GitHub Repository</option>
                                    </select>
                                    <p className="text-xs text-[var(--muted)] mt-2">
                                        Vercel Blob is faster and supports larger files. GitHub storage commits files to the repo (repo size limits apply).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-2)]/30 p-6 rounded-lg border border-[var(--border)]">
                            <h4 className="micro mb-4 text-[var(--accent)]">Image Optimization Limits</h4>
                            <p className="text-sm text-[var(--muted)] mb-6">
                                Images larger than these limits will be automatically resized and compressed during upload.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field
                                    label="Max Dimension (px)"
                                    value={(content.adminConfig?.maxDimension || 1920).toString()}
                                    onChange={(v) => update('adminConfig.maxDimension', parseInt(v) || 1920)}
                                />
                                <Field
                                    label="Max File Size (KB)"
                                    value={(content.adminConfig?.maxSizeKB || 700).toString()}
                                    onChange={(v) => update('adminConfig.maxSizeKB', parseInt(v) || 700)}
                                />
                            </div>
                        </div>
                    </AdminSection>
                )}
            </main>
        </div>
    );
}
