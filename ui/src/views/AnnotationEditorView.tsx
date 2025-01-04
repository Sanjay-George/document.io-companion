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
import QuerySelectorTag from '@/components/QuerySelectorTag';
import InfoIcon from '@/components/icons/InfoIcon';
import { Tooltip } from 'react-tooltip';
import Spinner from '@/components/Spinner';

type AnnotationType = 'component' | 'page';

export default function AnnotationEditorView() {
    const { id: annotationId } = useParams();
    const documentationId = useContext(DocumentationContext) as string;

    const [previewMode, setPreviewMode]: [PreviewType, Dispatch<SetStateAction<PreviewType>>] = useState<PreviewType>("preview");
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

    useEffect(() => {
        if (!annotation) {
            return;
        }
        setAnnotationType(annotation.type || 'component');

        // Highlight annotated element
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

            {
                (annotation.type === "page" && annotation.url !== window.location.href) && (
                    <div className='text-xs'>
                        <div className="py-2 px-2 mb-3 text-xs rounded-lg !bg-yellow-50 
                        !border-1 !border-yellow-200 cursor-pointer" role="alert">
                            <a className='!text-yellow-800' href={annotation.url} rel="noreferrer">
                                This annotation exists on a different url. <span className="font-medium underline">Click here</span> to navigate.
                            </a>
                        </div>
                    </div>
                )
            }

            <div className='mb-3'>
                <QuerySelectorTag target={annotation.target} />
            </div>

            {
                previewMode !== 'preview' && (
                    <>
                        <Tooltip
                            id="info-tooltip"
                            className="!z-10 !rounded-md !m-0 max-w-lg"
                            offset={2}
                            style={{ padding: '4px 8px', fontSize: '12px', lineHeight: '1.5' }}
                        />
                        <div className='flex items-center mb-2 px-2 text-xs space-x-4'>



                            <div className="flex flex-wrap">
                                <div
                                    className='inline-flex items-center space-x-1 text-slate-500 me-3'
                                    data-tooltip-id="info-tooltip"
                                    data-tooltip-content={`
                                    Page-level annotations are visible only on the specific page (URL).    
                                    Component-level annotations are visible on all pages where the component exists.
                                    `}
                                    data-tooltip-place="bottom"
                                >
                                    <span>Annotation Type </span>
                                    <InfoIcon />
                                    <span>: </span>
                                </div>

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

                    </>
                )
            }



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