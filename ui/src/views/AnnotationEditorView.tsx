import { Spinner } from '@nextui-org/react'
import '@/App.css';
import '@mdxeditor/editor/style.css';
import { useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { renderAnnotationId } from '@/utils';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useParams } from 'react-router';

export default function AnnotationEditorView() {
    const { id: annotationId } = useParams();

    const { data: annotation, isLoading, error } = annotationId
        ? useAnnotation(annotationId as string)
        : { data: null, isLoading: false, error: null };


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
        </>
    )
}