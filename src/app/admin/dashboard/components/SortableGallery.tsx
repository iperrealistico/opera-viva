import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, Image as LucideImage } from 'lucide-react';

interface GalleryProps {
    items: Array<{ src: string; alt: string }>;
    onUpdate: (items: Array<{ src: string; alt: string }>) => void;
    onUpload: (file: File, index: number) => Promise<string | null>;
}

export function SortableGallery({ items, onUpdate, onUpload }: GalleryProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((_, idx) => `item-${idx}` === active.id);
            const newIndex = items.findIndex((_, idx) => `item-${idx}` === over.id);
            onUpdate(arrayMove(items, oldIndex, newIndex));
        }
    };

    const handleItemUpdate = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate(newItems);
    };

    const handleItemUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await onUpload(file, index);
        if (url) {
            handleItemUpdate(index, 'src', url);
        }
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onUpdate(newItems);
    };

    const handleAdd = () => {
        onUpdate([...items, { src: '/img/placeholder.jpg', alt: 'New Image' }]);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <SortableContext
                    items={items.map((_, idx) => `item-${idx}`)}
                    strategy={rectSortingStrategy}
                >
                    {items.map((item, idx) => (
                        <SortableItem
                            key={`item-${idx}`}
                            id={`item-${idx}`}
                            item={item}
                            onRemove={() => handleRemove(idx)}
                            onUpdate={(field, value) => handleItemUpdate(idx, field, value)}
                            onUpload={(e) => handleItemUpload(e, idx)}
                        />
                    ))}
                </SortableContext>

                <button
                    onClick={handleAdd}
                    className="aspect-[3/4] border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-[var(--surface)] text-[var(--muted)] transition-colors group"
                >
                    <div className="p-3 rounded-full bg-[var(--surface)] group-hover:bg-[var(--bg-2)] transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add Image</span>
                </button>
            </div>
        </DndContext>
    );
}
