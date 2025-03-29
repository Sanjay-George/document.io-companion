import { useEffect } from "react";
import { Annotation } from "@/models/annotations";
import Markdown from 'react-markdown';
import { Link, useNavigate } from "react-router";
import { highlight, removeHighlight } from "@/utils/annotations";
import Card from "./Card";


export default function AnnotationCard({ annotation, draggable = false }: { annotation: Annotation, draggable?: boolean }) {
    const { target, value } = annotation;

    const navigate = useNavigate();
    const openInEditor = (target: string) => {
        if (!target || !target.length) {
            console.warn('No target provided');
            return;
        }
        const t = encodeURIComponent(target);
        navigate(`/?target=${t}`);
    };

    // Highlight annotated element
    useEffect(() => {
        const element = document.querySelector(target) as HTMLElement;
        if (!element) {
            // TODO: wait for element to be rendered
            return;
        }

        highlight(element, true, () => openInEditor(target));
        return () => {
            removeHighlight(element);
        }
    }, [annotation]);

    return (
        <Card
            className="text-slate-400 hover:text-slate-600 hover:cursor-pointer"
            body={
                <div className="flex flex-row">
                    {draggable && (
                        <div className="pr-2 hover:!cursor-grab">:::</div>
                    )}
                    <div className="!max-h-56 overflow-clip transition duration-150 md-renderer">
                        <Link to={`/${annotation.id}`} >
                            <Markdown>{value}</Markdown>
                        </ Link>
                    </div>
                </div>
            }
        />
    )

}