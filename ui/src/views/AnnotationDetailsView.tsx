import { ALL_ANNOTATIONS_KEY, deleteAnnotation, useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { renderAnnotationId } from '@/utils';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useParams } from 'react-router';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useContext, useEffect } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import ButtonDanger from '@/components/ButtonDanger';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { DocumentationContext } from '@/App';
import { mutate } from 'swr';
import CodeBlock from '@/components/CodeBlock';
import Spinner from '@/components/Spinner';


export default function AnnotationDetailsView() {
    const { id: annotationId } = useParams();
    const documentationId = useContext(DocumentationContext) as string;

    const navigate = useNavigate();

    const { data: annotation, isLoading, error } = annotationId
        ? useAnnotation(annotationId as string)
        : { data: null, isLoading: false, error: null };

    const handleDelete = async () => {
        // show confirmation dialog
        if (!window.confirm('Are you sure you want to delete this annotation?')) {
            return;
        }

        await deleteAnnotation(annotationId as string);
        await mutate(ALL_ANNOTATIONS_KEY(documentationId));
        navigate(-1);
    }

    useEffect(() => {
        if (!annotation) {
            return;
        }

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

            <div className='mb-3 space-y-2'>
                <CodeBlock title='Target' value={annotation.target} />
                <CodeBlock title='URL' value={annotation.url} />
            </div>


            <AnnotationEditor
                content={annotation?.value}
                preview="preview" />


            <div className='space-x-2'>
                <ButtonPrimary text="Edit" icon={<EditIcon />}
                    onClick={() => { navigate(`/${annotation.id}/edit`) }} />
                <ButtonDanger text="Delete" icon={<DeleteIcon />}
                    onClick={handleDelete} />
            </div>

        </>
    )
}