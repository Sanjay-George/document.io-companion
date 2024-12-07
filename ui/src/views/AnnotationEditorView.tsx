import { Spinner } from '@nextui-org/react'
import '@/App.css';
import { useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { renderAnnotationId } from '@/utils';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useParams } from 'react-router';
import ButtonPrimary from '@/components/ButtonPrimary';
import RightArrowIcon from '@/components/icons/RightArrowIcon';
import { useEffect } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';

export default function AnnotationEditorView() {
    const { id: annotationId } = useParams();

    const { data: annotation, isLoading, error } = annotationId
        ? useAnnotation(annotationId as string)
        : { data: null, isLoading: false, error: null };

    // Highlight annotated element
    useEffect(() => {
        if (!annotation) {
            return;
        }
        const element = document.querySelector(annotation.target) as HTMLElement;
        if (!element) {
            console.error('Element not found:', annotation.target);
            return;
        }
        highlight(element, false, null, true);

        return () => {
            removeHighlight(element);
        }
    }, [annotation]);


    if (!annotationId) {
        return <Spinner label="Loading editor..." />;
    }
    if (isLoading) {
        return <Spinner label="Fetching details..." />;
    }
    if (error) {
        return <div className='text-red-700'>Failed to load the editor. Error: {error?.message}</div>;
    }
    return (
        <>
            <SidePanelHeader title={renderAnnotationId(annotation._id)} allowGoBack={true} />
            <AnnotationEditor annotation={annotation} />
            <ButtonPrimary text="Save" icon={<RightArrowIcon />} />
        </>
    )
}