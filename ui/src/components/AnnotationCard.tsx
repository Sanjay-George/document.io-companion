import { useContext, useEffect } from "react";
import { Annotation } from "@/models/annotations";
import Markdown from 'react-markdown';
import { Link } from "react-router";
import { highlight, highlightEditMode, removeHighlight } from "@/utils/annotations";
import Card from "./Card";
import DragHandleIcon from "./icons/DragHandleIcon";
import { PanelOrientationContext } from "@/App";


export default function AnnotationCard({ annotation, draggable = false }: { annotation: Annotation, draggable?: boolean }) {
    const { target, value } = annotation;
    const { editMode, setActivePopup } = useContext(PanelOrientationContext) as any;

    // Highlight annotated element and wire badge icon to open popup
    useEffect(() => {
        const element = document.querySelector(target) as HTMLElement;
        if (!element) {
            // TODO: wait for element to be rendered
            return;
        }

        const openPopup = () => {
            const elementRect = element.getBoundingClientRect();
            setActivePopup({
                type: editMode ? 'edit' : 'view',
                target,
                elementRect,
                initialAnnotationId: annotation.id,
            });
        };

        if (editMode) {
            highlightEditMode(element, openPopup);
        } else {
            highlight(element, true, openPopup);
        }

        return () => {
            removeHighlight(element);
        }
    }, [annotation, editMode]);

    return (
        <Card
            className={`text-slate-400 hover:text-slate-600 ${draggable ? '!pl-2' : 'hover:cursor-pointer'}`}
            body={
                <div className="flex flex-row h-full w-full" >
                    {draggable && (
                        <div className="pt-2 pr-1 hover:!cursor-grab"><DragHandleIcon /></div>
                    )}
                    {draggable ? (
                        // If draggable, render without the Link
                        <div className="!max-h-56 overflow-clip transition duration-150 md-renderer">
                            <Markdown>{value}</Markdown>
                        </div>
                    ) : (
                        // If not draggable, wrap content in a Link
                        <Link to={`/${annotation.id}`} >
                            <div className="!max-h-56 overflow-clip transition duration-150 md-renderer">
                                <Markdown>{value}</Markdown>
                            </div>
                        </Link>
                    )}
                </div>
            }
        />
    )

}