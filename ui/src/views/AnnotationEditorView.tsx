import { Spinner } from '@nextui-org/react'
import '@/App.css';
import { ALL_ANNOTATIONS_KEY, deleteAnnotation, SINGLE_ANNOTATION_KEY, updateAnnotation, useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { renderAnnotationId } from '@/utils';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useParams } from 'react-router';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useContext, useEffect, useState } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import ButtonDanger from '@/components/ButtonDanger';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import { PreviewType } from '@uiw/react-md-editor';
import { mutate } from 'swr';

export default function AnnotationEditorView() {
    const { id: annotationId } = useParams();
    const documentationId = useContext(DocumentationContext) as string;

    const [previewMode, setPreviewMode] = useState('preview');
    const navigate = useNavigate();

    const { data: annotation, isLoading, error } = annotationId
        ? useAnnotation(annotationId as string)
        : { data: null, isLoading: false, error: null };

    const handleSave = async (value: string) => {
        const updatedAnnotation: Annotation = {
            ...annotation,
            value,
            updated: new Date(),
        };

        await updateAnnotation(annotationId as string, updatedAnnotation);
        // TODO: mutate if data is not updated
        mutate(ALL_ANNOTATIONS_KEY(documentationId));
        mutate(SINGLE_ANNOTATION_KEY(annotationId as string));
        setPreviewMode('preview');
    }

    const handleDelete = async () => {
        // show confirmation dialog
        if (!window.confirm('Are you sure you want to delete this annotation?')) {
            return;
        }

        await deleteAnnotation(annotationId as string);
        mutate(ALL_ANNOTATIONS_KEY(documentationId));
        navigate(-1);
    }

    // Highlight annotated element
    useEffect(() => {
        if (!annotation || annotation.type === 'page') {
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
            <SidePanelHeader title={renderAnnotationId(annotation._id)} shouldGoBack={true} />
            <AnnotationEditor
                content={annotation?.value}
                handleSave={handleSave}
                preview={previewMode as PreviewType} />

            {
                previewMode === 'preview' &&
                (
                    <div className='space-x-2'>
                        <ButtonPrimary text="Edit" icon={<EditIcon />} onClick={() => { setPreviewMode('live') }} />
                        <ButtonDanger text="Delete" icon={<DeleteIcon />} onClick={handleDelete} />
                    </div>
                )
            }




        </>
    )
}