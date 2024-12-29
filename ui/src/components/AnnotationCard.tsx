import { useEffect } from "react";
import { Annotation } from "@/models/annotations";
import { Chip } from "@nextui-org/react"
import Markdown from 'react-markdown';
import RightArrowIcon from "./icons/RightArrowIcon";
import { renderAnnotationId } from "@/utils";
import { Link, useNavigate } from "react-router";
import { highlight, removeHighlight } from "@/utils/annotations";
import Card from "./Card";


export default function AnnotationCard({ annotation }: { annotation: Annotation }) {
    const { _id: id, target, value, type, url } = annotation;

    const navigate = useNavigate();
    const openInEditor = (target: string) => {
        if (!target || !target.length) {
            console.error('No target provided');
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
            // console.log('Element not found:', target);
            return;
        }

        highlight(element, true, () => openInEditor(target));
        return () => {
            removeHighlight(element);
        }
    }, [annotation]);

    return (
        <Card
            className="bg-white shadow-md rounded-xl text-slate-400 hover:text-slate-600"
            body={
                <div className="max-h-52 overflow-clip transition duration-150 md-renderer">
                    <Markdown>{value}</Markdown>
                </div>
            }
            header={
                <Link to={`/edit/${annotation._id}`} >
                    <div className="flex gap-3 items-center">
                        <div className="flex justify-center items-center bg-slate-700 text-white px-3 w-7 h-7 rounded-lg text-xs font-extralight mx-auto">
                            {renderAnnotationId(id as string)?.slice(-3)}
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <div className="flex space-x-3 items-center">
                                <p className="!text-slate-600 !text-sm !font-bold">{renderAnnotationId(id as string)}</p>
                                {type && (
                                    type === 'page' &&
                                    <Chip size="sm" radius="sm" variant="light" className="border-1 border-sky-500 text-sky-500">{type?.toLocaleUpperCase()}-LEVEL</Chip>
                                )}
                            </div>
                            <div className="bg-transparent text-accent cursor-pointer hover:text-primary transition duration-150"> <RightArrowIcon /> </div>
                        </div>
                    </div>
                    </Link>
            }
            footer={
                <a
                    // TODO: Implement the link later
                    className='text-primary text-xs'
                    aria-disabled={true}
                    // href={url}
                >
                    {url}
                </a>
            }
            
        >

        </Card>
    )

}