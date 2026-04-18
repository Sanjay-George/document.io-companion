import { useEffect } from "react";
import { Annotation } from "@/models/annotations";
import Markdown from 'react-markdown';
import { Link, useNavigate } from "react-router";
import { highlight, removeHighlight } from "@/utils/annotations";
import Card from "./Card";
import DragHandleIcon from "./icons/DragHandleIcon";

const TypeBadge = ({ type }: { type: string }) => (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0
        ${type === 'page' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
        {type === 'page' ? 'Page' : 'Component'}
    </span>
);

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
            return;
        }

        highlight(element, true, () => openInEditor(target));
        return () => {
            removeHighlight(element);
        }
    }, [annotation]);

    const content = (
        <div className="flex flex-row h-full w-full">
            {draggable && (
                <div className="pt-2 pr-1 hover:!cursor-grab shrink-0"><DragHandleIcon /></div>
            )}
            <div className="flex flex-col w-full min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <TypeBadge type={annotation.type} />
                </div>
                <div className="!max-h-48 overflow-clip transition duration-150 md-renderer">
                    <Markdown>{value}</Markdown>
                </div>
            </div>
        </div>
    );

    return (
        <Card
            className={`text-slate-400 hover:text-slate-600 ${draggable ? '!pl-2' : 'hover:cursor-pointer'}`}
            body={
                draggable ? content : (
                    <Link to={`/${annotation.id}`} className="block w-full">
                        {content}
                    </Link>
                )
            }
        />
    )
}