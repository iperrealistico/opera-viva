import React from 'react';

interface I18nFieldProps {
    label: string;
    value: { it: string; en: string; align?: string };
    onChange: (v: { it: string; en: string; align?: string }) => void;
    textarea?: boolean;
}

export function I18nField({ label, value, onChange, textarea }: I18nFieldProps) {
    return (
        <div className="flex flex-col gap-3 p-4 border border-[var(--border)]/50 rounded-lg bg-[var(--bg-2)]/30">
            <div className="flex items-center justify-between">
                <label className="micro text-[var(--accent)] font-black">{label}</label>
                <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black uppercase text-[var(--muted)]">Align:</label>
                    <select
                        value={value.align || 'left'}
                        onChange={(e) => onChange({ ...value, align: e.target.value })}
                        className="bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none"
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black uppercase text-[var(--muted)] w-6 pt-3">IT</span>
                    {textarea ? (
                        <textarea
                            value={value.it}
                            onChange={(e) => onChange({ ...value, it: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)] min-h-[80px]"
                        />
                    ) : (
                        <input
                            type="text"
                            value={value.it}
                            onChange={(e) => onChange({ ...value, it: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
                        />
                    )}
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black uppercase text-[var(--muted)] w-6 pt-3">EN</span>
                    {textarea ? (
                        <textarea
                            value={value.en}
                            onChange={(e) => onChange({ ...value, en: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)] min-h-[80px]"
                        />
                    ) : (
                        <input
                            type="text"
                            value={value.en}
                            onChange={(e) => onChange({ ...value, en: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)]"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
