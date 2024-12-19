import { Spinner } from '@nextui-org/react'
import ButtonPrimary from '@/components/ButtonPrimary'
import '@/App.css';
import { useDocumentation } from '@/data_access/documentations';
import { useAnnotationsByTarget } from '@/data_access/annotations';
import AnnotationCard from '@/components/AnnotationCard';
import SidePanelHeader from '@/components/SidePanelHeader';
import { sortAnnotations } from '@/utils';
import { useContext, useMemo, } from 'react';
import { DocumentationContext } from '@/App';
import AddIcon from '@/components/icons/AddIcon';
import { Annotation } from '@/models/annotations';
import { useNavigate, useSearchParams } from 'react-router';

export default function AnnotationListView() {
  const documentationId = useContext(DocumentationContext) as string;

  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');
  const isFiltered = useMemo(() => !!target && target.length > 0, [target]);

  const navigate = useNavigate();

  // Fetch documentation details
  const { data: documentation, isLoading, error } = useDocumentation(documentationId);

  // // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations } = useAnnotationsByTarget(documentationId, target);

  sortAnnotations(annotations);

  const handleAddAnnotationClick = () => {
    // Add annotation for existing target
    if (isFiltered) {
      navigate(`/add?target=${encodeURIComponent(target as any)}`);
      return;
    }

    // Add annotation for a new target
    navigate(`/add`);
  }

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
      <SidePanelHeader title={documentation?.title} shouldGoBack={isFiltered} />

      {isLoadingAnnotations && <Spinner label="Fetching annotations..." />}
      {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}

      {annotations && annotations.slice(0, 2).map((annotation: Annotation) => (
        <AnnotationCard key={annotation._id} annotation={annotation} />
      ))}

      {/* Adding an `Add` button in between for better UX */}
      {annotations?.length >= 4 && <ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} />}

      {annotations && annotations.slice(2).map((annotation: Annotation) => (
        <AnnotationCard key={annotation._id} annotation={annotation} />
      ))}

      <ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} />
    </>

  )
}