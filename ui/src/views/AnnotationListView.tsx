import { Spinner } from '@nextui-org/react'
import ButtonPrimary from '@/components/ButtonPrimary'
import '@/App.css';
import { useDocumentation } from '@/data_access/documentations';
import { useAnnotationsByTarget } from '@/data_access/annotations';
import AnnotationCard from '@/components/AnnotationCard';
import SidePanelHeader from '@/components/SidePanelHeader';
import { sortAnnotations } from '@/utils';
import { useContext, } from 'react';
import { DocumentationContext } from '@/App';
import AddIcon from '@/components/icons/AddIcon';
import { Annotation } from '@/models/annotations';
import { useSearchParams } from 'react-router';

export default function AnnotationListView() {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');
  const documentationId = useContext(DocumentationContext) as string;

  // Fetch documentation details
  const { data: documentation, isLoading, error } = useDocumentation(documentationId);

  // // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations } = useAnnotationsByTarget(documentationId, target);

  sortAnnotations(annotations);

  // const handleAddClick = () => {
  //   console.log("Add annotation clicked");

  //   /*
  //     1. Hide side panel
  //     2. Start highlighting elements
  //   */
  // }



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
      <SidePanelHeader title={documentation?.title} allowGoBack={target != null && target.length > 0} />

      {isLoadingAnnotations && <Spinner label="Fetching annotations..." />}
      {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}

      {annotations && annotations.map((annotation: Annotation) => (
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