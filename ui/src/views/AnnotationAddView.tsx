import Spinner from '@/components/Spinner';
import { addAnnotation, useAnnotations } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useSearchParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import CodeBlock from '@/components/CodeBlock';
import AnnotationTypeSelector, { AnnotationType } from '@/components/AnnotationTypeSelector';

export default function AnnotationAddView() {
    const documentationId = useContext(DocumentationContext) as string;

    const [annotationType, setAnnotationType] = useState<AnnotationType>('component');

    const [searchParams] = useSearchParams();
    const target = searchParams.get('target');
    const redirectTo = searchParams.get('redirectTo') || null;

    const navigate = useNavigate();

    const maxIndex = useAnnotations(documentationId).data?.reduce((max, annotation) => {
        return annotation.index > max ? annotation.index : max;
    }, -Infinity);

    const handleSave = async (value: string) => {
        const annotation: Annotation = {
            documentationId,
            value,
            target: target || '',
            url: window.location.href,
            created: new Date(),
            updated: new Date(),
            type: annotationType,
            index: parseInt(maxIndex + 1),
        };

        await addAnnotation(annotation);

        if (!redirectTo) {
            navigate(-1);
            return;
        }
        navigate(redirectTo);
    }

    // Highlight annotated element when a target is pre-selected
    useEffect(() => {
        if (!target) return;
        const element = document.querySelector(target) as HTMLElement;
        if (!element) {
            console.warn('Element not found:', target);
            return;
        }
        highlight(element, false, null, true);

        return () => {
            removeHighlight(element);
        }
    }, [target]);

    if (!documentationId) {
        return <Spinner text="Could not load editor..." />;
    }

    if (!target) {
        return (
            <>
                <SidePanelHeader title="Add Annotation" canGoBack={true}
                    showOrientationButtons={true}
                />

                <div className="text-xs overflow-hidden py-2 px-3 mb-3 !text-sky-800 rounded-lg !bg-sky-50 !border-1 !border-sky-200" role="alert">
                    Right-click any element on the page to annotate it.
                </div>
            </>
        )
    }

    return (
        <>
            <SidePanelHeader title="Add Annotation" canGoBack={true}
                showOrientationButtons={true} />

            <div className='mb-3 space-y-2'>
                <CodeBlock title='Target' value={target} />
                <CodeBlock title='URL' value={window.location.href} />
            </div>

            <AnnotationTypeSelector
                onChange={setAnnotationType}
                type={annotationType}
            />

            <AnnotationEditor content='' preview={'live'} handleSave={handleSave} />
        </>
    )
}
