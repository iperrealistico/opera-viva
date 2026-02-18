import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdminSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function AdminSection({ title, icon, children, defaultOpen = false }: AdminSectionProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <section className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] rounded-[var(--r-ui)] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-[var(--surface)] transition-colors text-left"
            >
                <h3 className="h2 text-lg m-0 flex items-center gap-3">
                    {icon && <span className="text-[var(--accent)] opacity-80">{icon}</span>}
                    {title}
                </h3>
                {isOpen ? <ChevronUp size={20} className="opacity-50" /> : <ChevronDown size={20} className="opacity-50" />}
            </button>

            {isOpen && (
                <div className="p-6 pt-0 border-t border-[var(--border)]/50 mt-4">
                    {children}
                </div>
            )}
        </section>
    );
}
