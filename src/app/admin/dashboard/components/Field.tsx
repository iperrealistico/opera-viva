import React from 'react';

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    textarea?: boolean;
    type?: string;
}

export function Field({ label, value, onChange, textarea, type = "text" }: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="micro">{label}</label>
            {textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[100px] text-sm leading-relaxed"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-sm"
                />
            )}
        </div>
    );
}
