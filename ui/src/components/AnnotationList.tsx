import { Annotation } from "@/models/annotations";
import AnnotationCard from "./AnnotationCard";
import ButtonPrimary from "./ButtonPrimary";
import AddIcon from "./icons/AddIcon";

export default function AnnotationList({ annotations, handleAddAnnotationClick }: { annotations: Annotation[], handleAddAnnotationClick: () => void }) {
    return (
        <>
            {annotations && annotations.length === 0 && (
                <div className='text-sm text-slate-400 py-6 text-center'>
                    <p className='mb-1'>No annotations yet.</p>
                    <p className='text-xs'>Right-click any element on the page to add the first annotation.</p>
                </div>
            )}

            <div className='grid gap-5 grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5'>
                {annotations && annotations.map((annotation: Annotation) => (
                    <AnnotationCard key={annotation.id} annotation={annotation} />
                ))}
            </div>

            <div className='my-5'>
                <ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} />
            </div>
        </>
    )
}