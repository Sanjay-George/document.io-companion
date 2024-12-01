import { useEffect } from "react";
import { Annotation } from "@/models/annotations";
import { Card, CardHeader, CardBody, CardFooter, Link, Image, Divider, Chip } from "@nextui-org/react"
import Markdown from 'react-markdown';
import RightArrowIcon from "./icons/RightArrowIcon";
import { renderAnnotationId } from "@/utils";


export default function AnnotationCard({ annotation, handleClick }: { annotation: Annotation, handleClick: (annotation: Annotation) => void }) {
    const { _id: id, target, value, type, url } = annotation;

    useEffect(() => {
        const element = document.querySelector(target);
        if (!element) {
            return;
        }
        // TODO: Highlight the element
    }, [annotation]);

    return (
        <Card className="my-5 shadow-md rounded-xl text-slate-400 hover:text-slate-600 " shadow='md'>
            <CardHeader className="flex gap-3">
                <Image
                    alt="nextui logo"
                    radius="sm"
                    src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                    width={40}
                />
                <div className="w-full flex items-center justify-between">
                    <div className="flex space-x-3 items-center">
                        <p className="text-slate-600 text-sm font-bold">{renderAnnotationId(id)}</p>
                        {type && (
                            type === 'page' &&
                            <Chip size="sm" radius="sm" variant="light" className="border-1 border-sky-500 text-sky-500">{type?.toLocaleUpperCase()}</Chip>
                        )}

                    </div>

                    <p onClick={() => handleClick(annotation)} className="bg-transparent text-accent cursor-pointer hover:text-primary transition duration-150"> <RightArrowIcon /> </p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="max-h-52 overflow-clip transition duration-150">
                <Markdown>{value}</Markdown>
            </CardBody>
            <Divider />
            <CardFooter>
                <Link
                    isDisabled={true}
                    // TODO: Implement the link later
                    className='text-primary text-sm'
                    href={url}
                >
                    {url}
                </Link>
            </CardFooter>
        </Card>
    )
}