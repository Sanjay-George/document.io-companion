import { Reorder } from "framer-motion";
import { Annotation } from "@/models/annotations";
import AnnotationCard from "./AnnotationCard";
import ButtonPrimary from "./ButtonPrimary";
import { useEffect, useState } from "react";
import RightArrowIcon from "./icons/RightArrowIcon";

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

    const handleSaveOrdering = async () => {
        if (!displayedAnnotations || !displayedAnnotations.length) return;
        for (let i = 0; i < displayedAnnotations.length; i++) {
            displayedAnnotations[i].index = i;
        }
        await onSaveOrder(displayedAnnotations);
    };


    return (
        displayedAnnotations &&
        <>
            <div className='text-xs'>
                <div className="py-2 px-3 mb-3 text-xs !text-sky-800 rounded-lg !bg-sky-50 !border-1 !border-sky-200" role="alert">
                    Drag the cards vertically to reorder the annotations. Click the <b>Save</b> button to save the new order.
                </div>
            </div>
            <div className=''>
                <Reorder.Group
                    className='grid gap-5 grid-cols-1 list-none m-0'
                    axis='y'
                    values={displayedAnnotations}
                    onReorder={handleReorder}
                >
                    {displayedAnnotations?.map(item => (
                        <Reorder.Item className='!cursor-grab' key={item.id} value={item}>
                            <AnnotationCard key={item.id} annotation={item} draggable />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
            <div className='my-5'>
                <ButtonPrimary text="Save" icon={<RightArrowIcon />} onClick={handleSaveOrdering} />
            </div>
        </>
    )
}
