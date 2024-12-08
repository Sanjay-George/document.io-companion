import { Code, Spinner } from '@nextui-org/react'
import '@/App.css';
import { addAnnotation } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useSearchParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { highlight, removeHighlight } from '@/utils/annotations';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import { ANNOTATED_ELEMENT_CLASS, ANNOTATED_ELEMENT_ICON_CLASS, HOVERED_ELEMENT_CLASS, MODAL_ROOT_ID } from '@/utils/constants';
import ContextMenu from '@/components/ContextMenu';

export default function AnnotationAddView() {
    const documentationId = useContext(DocumentationContext) as string;
    const [searchParams] = useSearchParams();
    const target = searchParams.get('target');

    const navigate = useNavigate();
    const [shouldHighlight, setShouldHighlight] = useState(false);

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
            // TODO: Adding annotation without target. Show target picker menu
            setShouldHighlight(true);

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

    useEffect(() => {
        if (shouldHighlight) {
            document.addEventListener('mouseover', handleMouseOver);
            document.addEventListener('mouseout', handleMouseOut);
        }
        else {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        }

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        }

    }, [shouldHighlight]);


    if (!documentationId) {
        return <Spinner label="Could not load editor..." />;
    }

    // No target, show target picker menu
    if (!target) {
        return (
            <>
                <SidePanelHeader title="Add Annotation" shouldGoBack={true} />
                <p className='text-sm font-light text-slate-400 mt-10 text-center border-1 border-slate-200 px-5 py-5 rounded-xl shadow-sm'>
                    Right-click a highlighted element to annotate it.
                </p>

                <ContextMenu
                    onContextMenuOpen={() => setShouldHighlight(false)}
                    onContextMenuClose={() => setShouldHighlight(true)}
                />
            </>
        )

    }

    // Target exists. Directly open the editor
    return (
        <>
            <SidePanelHeader title="Add Annotation" shouldGoBack={true} />
            <Code color="default" className='text-xs'>{target}</Code>
            <AnnotationEditor content='' preview={'live'} handleSave={handleSave} />
        </>
    )
}

/**
 * Handle Mouse Over event
 * Highlights the element on mouse over, if not already annotated
 * @param {*} event 
 * @returns 
 */
const handleMouseOver = (event: MouseEvent) => {
    if ((event.target as HTMLElement)?.closest(`#${MODAL_ROOT_ID}`)) {
        return;
    }

    const target = event.target as HTMLElement;
    if (target.classList.contains(ANNOTATED_ELEMENT_CLASS)
        || target.classList.contains(ANNOTATED_ELEMENT_ICON_CLASS)) {
        return;
    }
    target.classList.add(HOVERED_ELEMENT_CLASS);
};

/**
 * Handle Mouse Out event
 * Removes the highlight from the element on mouse out
 * @param event 
 * @returns 
 */
const handleMouseOut = (event: MouseEvent) => {
    (event.target as HTMLElement).classList.remove(HOVERED_ELEMENT_CLASS);
}