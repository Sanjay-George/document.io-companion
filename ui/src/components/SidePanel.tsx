import { Divider, Tabs, Tab, Spinner } from '@nextui-org/react'
import ButtonPrimary from '@/components/ButtonPrimary'
import RightArrowIcon from '@/components/icons/RightArrowIcon'
import H2 from '@/components/H2';
import '@/App.css';
import '@mdxeditor/editor/style.css'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon'
import { useContext, useEffect, useState } from 'react';
import { DocumentationContext } from '@/App';
import { useDocumentation } from '@/data_access/documentations';
import { useAnnotations } from '@/data_access/annotations';
import AnnotationCard from './AnnotationCard';
import AnnotationEditor from './AnnotationEditor';
import { Annotation } from '@/models/annotations';
import SidePanelHeader from './SidePanelHeader';
import { renderAnnotationId, sortAnnotations } from '@/utils';

export default function Sidebar() {
    // const documentationId = useContext(DocumentationContext) as string;

    // TODO: Remove hardcoded documentationId
    const documentationId = "66e8060840dff95980791abd";

    const [selectedAnnotation, setSelectedAnnotation] = useState(null as Annotation | null);

    // Fetch documentation details
    const { data: documentation, isLoading, error } = documentationId
        ? useDocumentation(documentationId)
        : { data: null, isLoading: false, error: null };

    // Fetch annotations
    const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations } = documentationId ?
        useAnnotations(documentationId)
        : { data: [], isLoading: false, error: null };

    sortAnnotations(annotations);

    const handleAnnotationClick = (annotation: Annotation) => {
        setSelectedAnnotation(annotation);
    }


    let tabs = [
        {
            id: "all",
            label: `All (${annotations?.length})`,
            content: "View all annotations on the page."
        },
        {
            id: "selected",
            label: "Selected (2)",
            content: "View all annotations of the selected element"
        },
    ];


    if (!documentationId) {
        return <Spinner label="Loading editor..." />;
    }

    if (isLoading) {
        return <Spinner label="Fetching details..." />;
    }

    if (error) {
        return <div className='text-red-700'>Failed to load the editor. Error: {error?.message}</div>;
    }

    // Render annotation editor view
    if (selectedAnnotation && selectedAnnotation?._id) {
        return (
            <>
                <SidePanelHeader title={renderAnnotationId(selectedAnnotation._id)} />
                <AnnotationEditor annotation={selectedAnnotation} />
            </>
        )
    }

    // Render Annotation list view
    return (
        <>
            <SidePanelHeader title={documentation?.title} />

            <div className="flex flex-col">
                <Tabs aria-label="Dynamic tabs" items={tabs} size='sm' defaultSelectedKey={'all'}>
                    {(item) => (
                        <Tab key={item.id} title={item.label}>
                            <p className="text-sm font-light shadow-none bg-transparent text-slate-400">
                                {item.content}
                            </p>
                        </Tab>
                    )}
                </Tabs>
            </div>

            {isLoadingAnnotations && <Spinner label="Fetching annotations..." />}
            {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}
            {annotations && annotations.map((annotation) => (
                <AnnotationCard key={annotation._id} annotation={annotation} handleClick={handleAnnotationClick} />
            ))}

            <ButtonPrimary text="Add" icon={<RightArrowIcon />} />

            <p className='text-sm font-light text-slate-400 mt-10 text-center border-1 border-slate-200 px-5 py-5 rounded-xl shadow-sm'>
                Select an element to annotate it.
                <br />
                Or select an annotated element to view the annotation.
            </p>


        </>

    )
}

