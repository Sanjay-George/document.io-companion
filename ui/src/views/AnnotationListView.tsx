import { Spinner } from '@nextui-org/react'
import ButtonPrimary from '@/components/ButtonPrimary'
import '@/App.css';
import { useDocumentation } from '@/data_access/documentations';
import { useAnnotationsByTarget } from '@/data_access/annotations';
import AnnotationCard from '@/components/AnnotationCard';
import SidePanelHeader from '@/components/SidePanelHeader';
import { useContext, useMemo, useState, } from 'react';
import { DocumentationContext } from '@/App';
import AddIcon from '@/components/icons/AddIcon';
import { Annotation } from '@/models/annotations';
import { useNavigate, useSearchParams } from 'react-router';

type FilterType = 'all' | 'in-page';

export default function AnnotationListView() {
  const documentationId = useContext(DocumentationContext) as string;

  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');
  const isTargetSelected = useMemo(() => !!target && target.length > 0, [target]);

  const [filter, setFilter] = useState<FilterType>('in-page');

  const navigate = useNavigate();

  // Fetch documentation details
  const { data: documentation, isLoading, error } = useDocumentation(documentationId);

  // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations }
    = useAnnotationsByTarget(documentationId, target);

  const filteredAnnotations = useMemo(() => {
    if (filter === 'in-page') {
      // TODO: Implement sorting
      // sortAnnotations(annotations);

      return annotations?.filter(inPageFilter);
    }
    return annotations;
  }, [annotations, filter]);

  const pageAnnotationsCount = useMemo(() => annotations?.filter(inPageFilter).length, [annotations, filter]);
  const allAnnotationsCount = useMemo(() => annotations?.length, [annotations]);

  function inPageFilter(item: Annotation) {
    if (item.type === 'page') {
      return item.url === window.location.href;
    }
    else if (item.type === 'component') {
      return document.querySelector(item.target) !== null;
    }
    return false;
  }

  const handleAddAnnotationClick = () => {
    // Add annotation for existing target
    if (isTargetSelected) {
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
    <div className='@container'>

      {/* TODO: Update title when target selected */}
      <SidePanelHeader title={documentation?.title} shouldGoBack={isTargetSelected} />



      {!isTargetSelected && (
        <ul className="flex flex-wrap text-xs font-medium text-center 
        text-gray-500 mb-3 bg-slate-100 w-fit px-1 py-1 rounded-xl cursor-pointer">
          <li className="me-2">
            <a
              className={
                `inline-block px-3 py-1 rounded-lg 
                ${filter === 'in-page' ? 'bg-white' : 'hover:text-gray-900 hover:bg-gray-100'}`
              }
              onClick={() => setFilter('in-page')}
              aria-current="page"
            >
              On this page ({pageAnnotationsCount})
            </a>
          </li>

          <li className="me-2">
            <a
              className={
                `inline-block px-3 py-1 rounded-lg 
                ${filter === 'all' ? 'bg-white' : 'hover:text-gray-900 hover:bg-gray-100'}`
              }
              onClick={() => setFilter('all')}
            >
              All ({allAnnotationsCount})
            </a>
          </li>
        </ul>
      )}


      {isLoadingAnnotations && <Spinner label="Fetching annotations..." />}
      {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}

      <div className='grid gap-5 grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5'>
        {filteredAnnotations && filteredAnnotations.slice(0, 2).map((annotation: Annotation) => (
          <AnnotationCard key={annotation._id} annotation={annotation} />
        ))}

        {/* Adding an `Add` button in between for better UX */}
        {filteredAnnotations?.length >= 6 && <div className='@xl:hidden'><ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} /></div>}

        {filteredAnnotations && filteredAnnotations.slice(2).map((annotation: Annotation) => (
          <AnnotationCard key={annotation._id} annotation={annotation} />
        ))}

      </div>

      <div className='my-5'> <ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} /></div>

    </div>

  )
}