import { useEffect } from "react";
import { Annotation } from "@/models/annotations";
import Markdown from 'react-markdown';
import RightArrowIcon from "./icons/RightArrowIcon";
import { renderTitleFromValue } from "@/utils";
import { Link, useNavigate } from "react-router";
import { highlight, removeHighlight } from "@/utils/annotations";
import Card from "./Card";


export default function AnnotationCard({ annotation, condensed }: { annotation: Annotation, condensed?: boolean }) {
    const { id, target, value, type, url, index } = annotation;

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
                <Link to={`/${annotation.id}`} >
                    <div className="!max-h-56 overflow-clip transition duration-150 md-renderer">
                        <Markdown>{value}</Markdown>
                    </div>
                </ Link>
            }
        />
    )

}