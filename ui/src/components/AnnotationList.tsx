import { Annotation } from "@/models/annotations";
import AnnotationCard from "./AnnotationCard";
import ButtonPrimary from "./ButtonPrimary";
import AddIcon from "./icons/AddIcon";

export default function AnnotationList({ annotations, handleAddAnnotationClick }: { annotations: Annotation[], handleAddAnnotationClick: () => void }) {
    return (
        <>
            <div className='grid gap-5 grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @8xl:grid-cols-5'>
                {annotations && annotations.slice(0, 2).map((annotation: Annotation) => (
                    <AnnotationCard key={annotation.id} annotation={annotation} />
                ))}

                {/* Adding an `Add` button in between for better UX */}
                {annotations?.length >= 6 && <div className='@xl:hidden'><ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} /></div>}

                {annotations && annotations.slice(2).map((annotation: Annotation) => (
                    <AnnotationCard key={annotation.id} annotation={annotation} />
                ))}
            </div>

            <div className='my-5'> <ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} /></div>
        </>
    )
}