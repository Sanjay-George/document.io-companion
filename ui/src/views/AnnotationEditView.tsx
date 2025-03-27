import { ALL_ANNOTATIONS_KEY, SINGLE_ANNOTATION_KEY, updateAnnotation, useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { renderAnnotationId } from '@/utils';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import { mutate } from 'swr';
import CodeBlock from '@/components/CodeBlock';
import Spinner from '@/components/Spinner';
import AnnotationTypeSelector, { AnnotationType } from '@/components/AnnotationTypeSelector';


export default function AnnotationEditView() {
    const { id: annotationId } = useParams();
    const documentationId = useContext(DocumentationContext) as string;

    const [annotationType, setAnnotationType] = useState<AnnotationType>('component');

    const navigate = useNavigate();

    const { data: annotation, isLoading, error } = annotationId
        ? useAnnotation(annotationId as string)
        : { data: null, isLoading: false, error: null };

    const handleSave = async (value: string) => {
        const updatedAnnotation: Annotation = {
            ...annotation,
            value,
            type: annotationType,
            updated: new Date(),
        };

        await updateAnnotation(annotationId as string, updatedAnnotation);
        await mutate(ALL_ANNOTATIONS_KEY(documentationId));
        await mutate(SINGLE_ANNOTATION_KEY(annotationId as string));
        navigate(-1);
    }

    useEffect(() => {
        if (!annotation) {
            return;
        }
        setAnnotationType(annotation.type || 'component');

        // Highlight annotated element
        const element = document.querySelector(annotation.target) as HTMLElement;
        if (!element) {
            console.warn('Element not found:', annotation.target);
            return;
        }

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlight(element, false, null, true);

        return () => {
            removeHighlight(element);
        }
    }, [annotation]);


    if (!annotationId) {
        return <Spinner text="Loading editor..." />;
    }
    if (isLoading) {
        return <Spinner text="Fetching details..." />;
    }
    if (error) {
        return <div className='text-red-700'>Failed to load the editor. Error: {error?.message}</div>;
    }
    return (
        <>
            <SidePanelHeader title={renderAnnotationId(annotation._id)} canGoBack={true} showNavigationButtons={false} showOrientationButtons={false} />

            <div className='mb-3 space-y-2'>
                <CodeBlock title='Target' value={annotation.target} />
                <CodeBlock title='URL' value={annotation.url} />
            </div>

            <AnnotationTypeSelector
                onChange={setAnnotationType}
                type={annotationType}
            />

            <AnnotationEditor
                content={annotation?.value}
                handleSave={handleSave}
                preview="live" />

        </>
    )
}