import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Upload } from 'lucide-react';

interface SortableItemProps {
    id: string;
    item: { src: string; alt: string };
    onRemove: () => void;
    onUpdate: (field: string, value: string) => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SortableItem({ id, item, onRemove, onUpdate, onUpload }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative bg-[var(--bg-2)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col"
        >
            <div className="relative aspect-[3/4] bg-[var(--bg-3)]">
                <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 bg-white/10 rounded-full hover:bg-white/20 text-white"
                        title="Drag to reorder"
                    >
                        <GripVertical size={20} />
                    </div>

                    <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100">
                        <Upload size={14} /> Change
                        <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
                    </label>

                    <button
                        onClick={onRemove}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-600"
                    >
                        <Trash2 size={14} /> Remove
                    </button>
                </div>
            </div>

            <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-2)]">
                <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => onUpdate('alt', e.target.value)}
                    placeholder="Alt text"
                    className="w-full bg-transparent text-xs border-b border-transparent focus:border-[var(--accent)] focus:outline-none px-1 py-1 text-[var(--text)] placeholder-[var(--muted)]"
                />
            </div>
        </div>
    );
}
