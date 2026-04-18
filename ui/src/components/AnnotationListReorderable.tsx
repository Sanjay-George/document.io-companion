import { Reorder } from "framer-motion";
import { Annotation } from "@/models/annotations";
import AnnotationCard from "./AnnotationCard";
import { useEffect, useState } from "react";

interface AnnotationListReorderableProps {
    annotations: Annotation[];
    onSaveOrder: (values: Annotation[]) => Promise<void>;
}

export default function AnnotationListReorderable({ annotations, onSaveOrder }: AnnotationListReorderableProps) {

    const [displayedAnnotations, setDisplayedAnnotations] = useState<Annotation[] | null>(null);

    useEffect(() => {
        setDisplayedAnnotations(annotations);
    }, [annotations]);

    const handleReorder = (values: Annotation[]) => {
        setDisplayedAnnotations(values);
    };

    const handleDragEnd = async () => {
        if (!displayedAnnotations || !displayedAnnotations.length) return;
        const reindexed = displayedAnnotations.map((a, i) => ({ ...a, index: i }));
        setDisplayedAnnotations(reindexed);
        await onSaveOrder(reindexed);
    };

    return (
        displayedAnnotations && (
            <>
                <div className='text-xs mb-3'>
                    <div className="py-2 px-3 text-xs !text-sky-800 rounded-lg !bg-sky-50 !border-1 !border-sky-200" role="alert">
                        Drag cards to reorder. Order saves automatically on drop.
                    </div>
                </div>
                <Reorder.Group
                    className='grid gap-5 grid-cols-1 list-none m-0'
                    axis='y'
                    values={displayedAnnotations}
                    onReorder={handleReorder}
                >
                    {displayedAnnotations.map(item => (
                        <Reorder.Item
                            className='!cursor-grab'
                            key={item.id}
                            value={item}
                            onDragEnd={handleDragEnd}
                        >
                            <AnnotationCard key={item.id} annotation={item} draggable />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </>
        )
    );
}
