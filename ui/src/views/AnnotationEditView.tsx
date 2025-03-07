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
import InfoIcon from '@/components/icons/InfoIcon';
import Spinner from '@/components/Spinner';
import Tooltipped from '@/components/Tooltipped';

type AnnotationType = 'component' | 'page';

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
            <SidePanelHeader title={renderAnnotationId(annotation._id)} shouldGoBack={true} />

            <div className='mb-3 space-y-2'>
                <CodeBlock title='Target' value={annotation.target} />
                <CodeBlock title='URL' value={annotation.url} />
            </div>

            <div className='flex items-center mb-2 px-2 text-xs space-x-4'>
                <div className="flex flex-wrap">
                    {Tooltipped(
                        () => (
                            <div
                                className='inline-flex items-center space-x-1 text-slate-500 me-3'
                            >
                                <span>Annotation Type </span>
                                <InfoIcon />
                                <span>: </span>
                            </div>
                        ),
                        "Page annotations are visible only on the specific page (URL). Component annotations (default) are visible on all pages where the component exists.",
                        {},
                        'bottom-start'
                    )}

                    <div className="flex items-center me-2">
                        <input
                            id="page-type"
                            name='annotation-type'
                            type="radio"
                            value="page"
                            checked={annotationType === 'page'}
                            onChange={() => setAnnotationType('page')}
                            className="w-3 h-3 text-black bg-gray-100 border-gray-300"
                        />
                        <label
                            htmlFor="page-type"
                            className="ms-1"
                        >
                            Page
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="component-type"
                            name='annotation-type'
                            type="radio"
                            value="component"
                            onChange={() => setAnnotationType('component')}
                            checked={annotationType === 'component'}
                            className="w-3 h-3 bg-gray-100 border-gray-300 "
                        />
                        <label
                            htmlFor="component-type"
                            className="ms-1"
                        >
                            Component
                        </label>
                    </div>

                </div>
            </div>

            <AnnotationEditor
                content={annotation?.value}
                handleSave={handleSave}
                preview="live" />

        </>
    )
}