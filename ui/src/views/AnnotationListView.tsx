import Spinner from '@/components/Spinner';
import { useDocumentation } from '@/data_access/documentations';
import { ALL_ANNOTATIONS_KEY, updateAnnotations, useAnnotationsByTarget } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { useContext, useMemo, useState, } from 'react';
import { DocumentationContext } from '@/App';
import { Annotation } from '@/models/annotations';
import { useNavigate, useSearchParams } from 'react-router';
import Tabs from '@/components/Tabs';
import AnnotationListReorderable from '@/components/AnnotationListReorderable';
import { sortAnnotations } from '@/utils';
import { mutate } from 'swr';
import AnnotationList from '@/components/AnnotationList';

export type FilterType = 'all' | 'in-page';

export default function AnnotationListView() {
  const navigate = useNavigate();
  const documentationId = useContext(DocumentationContext) as string;

  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');

  const isTargetSelected = useMemo(() => !!target && target.length > 0, [target]);
  const [filter, setFilter] = useState<FilterType>('in-page');
  const [enableReorder, setEnableReorder] = useState(false);
  // A hack to force update the list when the page changes in an SPA
  const [shouldUpdateList, setShouldUpdateList] = useState(false);

  // Fetch documentation details
  const { data: documentation, isLoading, error } = useDocumentation(documentationId);

  // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations }
    = useAnnotationsByTarget(documentationId, target);

  // Memoized
  const filteredAnnotations = useMemo(() => {
    sortAnnotations(annotations);
    if (filter === 'in-page') {
      return annotations?.filter(inPageFilter);
    }
    return annotations;
  }, [annotations, filter, shouldUpdateList]);

  const pageAnnotationsCount = useMemo(() => annotations?.filter(inPageFilter).length, [annotations, filter, shouldUpdateList]);
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

  const tabItems = useMemo(() => {
    if (enableReorder) {
      return [{ label: 'All', count: allAnnotationsCount, key: 'all' as FilterType }];
    }
    return [
      { label: 'On this page', count: pageAnnotationsCount, key: 'in-page' as FilterType },
      { label: 'All', count: allAnnotationsCount, key: 'all' as FilterType },
    ]
  }, [pageAnnotationsCount, allAnnotationsCount, enableReorder]);


  // Handlers
  const handleSaveOrdering = async (values: Annotation[]) => {
    await updateAnnotations(values);
    await mutate(ALL_ANNOTATIONS_KEY(documentationId));
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

  window.electronAPI?.onNavigationUpdate(() => {
    console.log('onNavigationUpdate');
    if (isTargetSelected) {
      return;
    }
    setShouldUpdateList(!shouldUpdateList);
  });


  if (!documentationId) {
    return <Spinner text="Loading editor..." />;
  }

  if (isLoading) {
    return <Spinner text="Fetching details..." />;
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

      {isLoadingAnnotations && <Spinner text="Fetching annotations..." />}
      {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}

      {
        !enableReorder && (
          <AnnotationList
            annotations={filteredAnnotations}
            handleAddAnnotationClick={handleAddAnnotationClick}
          />
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