import { Spinner } from '@nextui-org/react'
import ButtonPrimary from '@/components/ButtonPrimary'
import '@/App.css';
import { useDocumentation } from '@/data_access/documentations';
import { ALL_ANNOTATIONS_KEY, updateAnnotations, useAnnotationsByTarget } from '@/data_access/annotations';
import AnnotationCard from '@/components/AnnotationCard';
import SidePanelHeader from '@/components/SidePanelHeader';
import { useContext, useMemo, useState, } from 'react';
import { DocumentationContext } from '@/App';
import AddIcon from '@/components/icons/AddIcon';
import { Annotation } from '@/models/annotations';
import { useNavigate, useSearchParams } from 'react-router';
import Tabs from '@/components/Tabs';
import AnnotationListReorderable from '@/components/AnnotationListReorderable';
import { sortAnnotations } from '@/utils';
import { mutate } from 'swr';

export type FilterType = 'all' | 'in-page';

export default function AnnotationListView() {
  const documentationId = useContext(DocumentationContext) as string;

  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');
  const isTargetSelected = useMemo(() => !!target && target.length > 0, [target]);

  const [filter, setFilter] = useState<FilterType>('in-page');
  const [enableReorder, setEnableReorder] = useState(false);

  const navigate = useNavigate();

  // Fetch documentation details
  const { data: documentation, isLoading, error } = useDocumentation(documentationId);

  // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations }
    = useAnnotationsByTarget(documentationId, target);

  const filteredAnnotations = useMemo(() => {
    sortAnnotations(annotations);
    if (filter === 'in-page') {
      return annotations?.filter(inPageFilter);
    }
    return annotations;
  }, [annotations, filter]);

  const pageAnnotationsCount = useMemo(() => annotations?.filter(inPageFilter).length, [annotations, filter]);
  const allAnnotationsCount = useMemo(() => annotations?.length, [annotations]);


  function inPageFilter(item: Annotation) {
    if (item.type === 'page') {
      return item.url === window.location.href &&
        document.querySelector(item.target) !== null;
    }
    else if (item.type === 'component') {
      return document.querySelector(item.target) !== null;
    }
    return false;
  }

  const handleSaveOrdering = async (values: Annotation[]) => {
    await updateAnnotations(values);
    mutate(ALL_ANNOTATIONS_KEY(documentationId));
    setEnableReorder(false);
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

  const tabItems = useMemo(() => {
    if (enableReorder) {
      return [{ label: 'All', count: allAnnotationsCount, key: 'all' as FilterType }];
    }
    return [
      { label: 'On this page', count: pageAnnotationsCount, key: 'in-page' as FilterType },
      { label: 'All', count: allAnnotationsCount, key: 'all' as FilterType },
    ]
  }, [pageAnnotationsCount, allAnnotationsCount, enableReorder]);

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
        <div className='w-full inline-flex justify-between gap-3 mb-3 items-center'>
          <Tabs filter={filter} setFilter={setFilter} items={tabItems} />

          {filter === 'all' && (!enableReorder ? (
            <div className='text-xs cursor-pointer text-slate-500 underline justify-end'
              onClick={() => setEnableReorder(true)}> Reorder </div>
          ) : (
            <div className='text-xs cursor-pointer text-slate-500 underline justify-end'
              onClick={() => setEnableReorder(false)}> Cancel </div>
          ))}

        </div>
      )}

      {isLoadingAnnotations && <Spinner label="Fetching annotations..." />}
      {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}

      {
        !enableReorder && (
          <>
            <div className='grid gap-5 grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @7xl:grid-cols-5'>
              {filteredAnnotations && filteredAnnotations.slice(0, 2).map((annotation: Annotation) => (
                <AnnotationCard key={annotation.id} annotation={annotation} />
              ))}

              {/* Adding an `Add` button in between for better UX */}
              {filteredAnnotations?.length >= 6 && <div className='@xl:hidden'><ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} /></div>}

              {filteredAnnotations && filteredAnnotations.slice(2).map((annotation: Annotation) => (
                <AnnotationCard key={annotation.id} annotation={annotation} />
              ))}
            </div>

            <div className='my-5'> <ButtonPrimary text="Add Annotation" icon={<AddIcon />} onClick={handleAddAnnotationClick} /></div>
          </>
        )
      }

      {
        enableReorder &&
        <AnnotationListReorderable
          annotations={filteredAnnotations}
          onSaveOrder={handleSaveOrdering} />
      }


    </div>

  )
}