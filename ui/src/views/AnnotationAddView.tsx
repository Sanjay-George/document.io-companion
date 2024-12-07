import { Code, Spinner } from '@nextui-org/react'
import '@/App.css';
import { addAnnotation, useAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';

export default function AnnotationAddView() {
    const documentationId = useContext(DocumentationContext) as string;
    const [searchParams] = useSearchParams();
    const target = searchParams.get('target');

    const navigate = useNavigate();

    // // Fetch documentation details
    // const { data: documentation, isLoading, error } = useDocumentation(documentationId);

    const handleSave = async (value: string) => {
        const annotation: Annotation = {
            documentationId,
            value,
            target: target || '',
            url: window.location.href,
            created: new Date(),
            updated: new Date(),
            type: 'component'
        };

        await addAnnotation(annotation);
        navigate(-1);
    }

    // Highlight annotated element
    useEffect(() => {
        if (!target) {
            return;
        }
        const element = document.querySelector(target) as HTMLElement;
        if (!element) {
            console.error('Element not found:', target);
            return;
        }
        highlight(element, false, null, true);

        return () => {
            removeHighlight(element);
        }
    }, [target]);


    if (!documentationId) {
        return <Spinner label="Could not load editor..." />;
    }
    return (
        <>
            <SidePanelHeader title="Add Annotation" shouldGoBack={true} />
            <Code color="default" className='text-xs'>{target}</Code>
            <AnnotationEditor content='' preview={'live'} handleSave={handleSave} />
        </>
    )
}