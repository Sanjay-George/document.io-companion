import { Tabs, Tab, Spinner } from '@nextui-org/react'
import ButtonPrimary from '@/components/ButtonPrimary'
import RightArrowIcon from '@/components/icons/RightArrowIcon'
import '@/App.css';
import { useDocumentation } from '@/data_access/documentations';
import { useAnnotations } from '@/data_access/annotations';
import AnnotationCard from '@/components/AnnotationCard';
import SidePanelHeader from '@/components/SidePanelHeader';
import { sortAnnotations } from '@/utils';
import { useContext } from 'react';
import { DocumentationContext } from '@/App';
import AddIcon from '@/components/icons/AddIcon';

export default function AnnotationListView() {
  const documentationId = useContext(DocumentationContext) as string;

  // TODO: Remove hardcoded documentationId
  // const documentationId = "66e8060840dff95980791abd";

  // Fetch documentation details
  const { data: documentation, isLoading, error } = documentationId
    ? useDocumentation(documentationId)
    : { data: null, isLoading: false, error: null };

  // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations } = documentationId ?
    useAnnotations(documentationId)
    : { data: [], isLoading: false, error: null };

  sortAnnotations(annotations);

  const handleAddClick = () => {
    console.log("Add annotation clicked");

    /*
      1. Hide side panel
      2. Start highlighting elements
    */
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
        <AnnotationCard key={annotation._id} annotation={annotation} />
      ))}

      <ButtonPrimary text="Add" icon={<AddIcon />} />

      <p className='text-sm font-light text-slate-400 mt-10 text-center border-1 border-slate-200 px-5 py-5 rounded-xl shadow-sm'>
        Select an element to annotate it.
        <br />
        Or select an annotated element to view the annotation.
      </p>
    </>

  )
}