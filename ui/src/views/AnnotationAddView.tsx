import Spinner from '@/components/Spinner';
import '@/App.css';
import { addAnnotation, useAnnotations } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import AnnotationEditor from '@/components/AnnotationEditor';
import { useNavigate, useSearchParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { highlight, isHighlightable, removeHighlight } from '@/utils/annotations';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import { ANNOTATED_ELEMENT_CLASS, ANNOTATED_ELEMENT_ICON_CLASS, HOVERED_ELEMENT_CLASS, MODAL_ROOT_ID } from '@/utils/constants';
import ContextMenu from '@/components/ContextMenu';
import QuerySelectorTag from '@/components/QuerySelectorTag';
import { getQuerySelector } from '@/utils';

export default function AnnotationAddView() {
    const documentationId = useContext(DocumentationContext) as string;

    const [searchParams] = useSearchParams();
    const target = searchParams.get('target');
    const redirectTo = searchParams.get('redirectTo') || null;

    const navigate = useNavigate();
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const maxIndex = useAnnotations(documentationId).data?.reduce((max, annotation) => {
        return annotation.index > max ? annotation.index : max;
    }, -Infinity);

    const handleSave = async (value: string) => {
        console.log('maxIndex:', maxIndex);

        const annotation: Annotation = {
            documentationId,
            value,
            target: target || '',
            url: window.location.href,
            created: new Date(),
            updated: new Date(),
            type: 'component',
            index: parseInt(maxIndex + 1),
        };

        await addAnnotation(annotation);

        // Redirect
        if (!redirectTo) {
            navigate(-1);
            return;
        }
        navigate(redirectTo);
    }

    // Highlight annotated element
    useEffect(() => {
        if (!target) {
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

    // Add event listeners for mouse over and mouse out events
    useEffect(() => {
        if (shouldHighlight) {
            document.addEventListener('mouseover', handleMouseOver, { passive: true });
            document.addEventListener('mouseout', handleMouseOut, { passive: true });
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

    const handleContextItemClick = ({ id, triggerEvent }: { id: string, triggerEvent: Event }) => {
        if (id === "annotate") {
            const target = getQuerySelector(triggerEvent?.target as HTMLElement);
            navigate(`/add?target=${encodeURIComponent(target)}&redirectTo=/`);
        }
    }

    if (!documentationId) {
        return <Spinner text="Could not load editor..." />;
    }

    // Adding annotation on a new target (element)
    if (!target) {
        return (
            <>
                <SidePanelHeader title="Add Annotation" shouldGoBack={true} />

                <div className="text-xs overflow-hidden py-2 px-3 mb-3 !text-sky-800 rounded-lg !bg-sky-50 !border-1 !border-sky-200 cursor-pointer" role="alert">
                    Right-click a highlighted element to annotate it.
                </div>

                <ContextMenu
                    onContextMenuOpen={() => setShouldHighlight(false)}
                    onContextMenuClose={() => setShouldHighlight(true)}
                    onContextItemClick={handleContextItemClick}
                />
            </>
        )

    }

    // Adding annotation on an already annotated target (element)
    return (
        <>
            <SidePanelHeader title="Add Annotation" shouldGoBack={true} />

            <QuerySelectorTag target={target} />

            <AnnotationEditor content='' preview={'live'} handleSave={handleSave} />
        </>
    )
}


// Helper functions

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

    if (!isHighlightable(event.target as HTMLElement)) {
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