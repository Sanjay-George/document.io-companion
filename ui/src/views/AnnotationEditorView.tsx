import { Code, Spinner } from '@nextui-org/react'
import '@/App.css';
import { ALL_ANNOTATIONS_KEY, deleteAnnotation, SINGLE_ANNOTATION_KEY, updateAnnotation, useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { renderAnnotationId } from '@/utils';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useParams } from 'react-router';
import ButtonPrimary from '@/components/ButtonPrimary';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import ButtonDanger from '@/components/ButtonDanger';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import { PreviewType } from '@uiw/react-md-editor';
import { mutate } from 'swr';
import { Tooltip } from 'react-tooltip';

export default function AnnotationEditorView() {
    const { id: annotationId } = useParams();
    const documentationId = useContext(DocumentationContext) as string;

    const [previewMode, setPreviewMode]: [PreviewType, Dispatch<SetStateAction<PreviewType>>] = useState<PreviewType>("preview");

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
        mutate(ALL_ANNOTATIONS_KEY(documentationId));
        mutate(SINGLE_ANNOTATION_KEY(annotationId as string));
        setPreviewMode("preview");
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

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

            {
                (annotation.url !== window.location.href) && (
                    <div className='text-xs'>
                        <div className="py-2 px-2 mb-4 text-xs !text-yellow-800 rounded-lg !bg-yellow-50 !border-1 !border-yellow-200 cursor-pointer" role="alert">
                            <a href={annotation.url} rel="noreferrer">

                                This annotation exists on a different url. <span className="font-medium underline">Click here</span> to navigate.
                            </a>
                        </div>
                    </div>
                )
            }

            <div>
                <Tooltip
                    id="code-tooltip"
                    className="!z-10 !rounded-md !m-0 max-w-lg"
                    offset={2}
                    style={{ padding: '4px 8px', fontSize: '12px', lineHeight: '1.5' }}
                />

                <Code
                    color="default"
                    className='text-xs max-w-full overflow-x-clip overflow-ellipsis' data-tooltip-id="code-tooltip"
                    data-tooltip-content={annotation.target}
                    data-tooltip-place="bottom">
                    <span className='font-semibold font-sans'>Target: </span> {annotation.target}
                </Code>
            </div>


            <AnnotationEditor
                content={annotation?.value}
                handleSave={handleSave}
                preview={previewMode as PreviewType} />

            {
                previewMode === 'preview' &&
                (
                    <div className='space-x-2'>
                        <ButtonPrimary text="Edit" icon={<EditIcon />} onClick={() => { setPreviewMode("live") }} />
                        <ButtonDanger text="Delete" icon={<DeleteIcon />} onClick={handleDelete} />
                    </div>
                )
            }

        </>
    )
}