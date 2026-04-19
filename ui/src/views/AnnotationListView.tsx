import Spinner from '@/components/Spinner';
import { useDocumentation } from '@/data_access/documentations';
import { ALL_ANNOTATIONS_KEY, updateAnnotations, useAnnotationsByTarget } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { useContext, useEffect, useMemo, useState, } from 'react';
import { DocumentationContext, PanelOrientationContext } from '@/App';
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
  const { editMode } = useContext(PanelOrientationContext) as any;

  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');
  const filterQS = searchParams.get('filter') || 'in-page';

  const isTargetSelected = useMemo(() => !!target && target.length > 0, [target]);
  const [filter, setFilter] = useState<FilterType>(filterQS as FilterType);
  const [enableReorder, setEnableReorder] = useState(false);

  // Update filter state when query string changes
  useEffect(() => {
    if (filter !== filterQS) {
      setFilter(filterQS as FilterType);
    }
  }, [filterQS]);

  // A hack to force update the list when the page changes in an SPA
  const [shouldUpdateList, setShouldUpdateList] = useState(false);

  // Fetch documentation details
  const { data: documentation, isLoading, error } = useDocumentation(documentationId);

  // Fetch annotations
  const { data: annotations, isLoading: isLoadingAnnotations, error: errorAnnotations }
    = useAnnotationsByTarget(documentationId, target);

  // Memoized
  const filteredAnnotations = useMemo(() => {
    if (!annotations) {
      console.warn('No annotations found for documentation ID:', documentationId);
      return [];
    }
    let sortedAnnotations = sortAnnotations(annotations);
    if (filter === 'in-page') {
      console.warn('Applying in-page filter');
      return sortedAnnotations?.filter(inPageFilter);
    }
    console.warn('No filter applied, showing all annotations');
    return sortedAnnotations;
  }, [annotations, filter, shouldUpdateList]);

  const pageAnnotationsCount = useMemo(() => annotations?.filter(inPageFilter).length, [annotations, filter, shouldUpdateList]);
  const allAnnotationsCount = useMemo(() => annotations?.length, [annotations]);

  function inPageFilter(item: Annotation) {
    try {
      if (item.type === 'page') {
        return item.url === window.location.href &&
          document.querySelector(item.target) !== null;
      }
      if (item.type === 'component') {
        return document.querySelector(item.target) !== null;
      }
    } catch {
      return false;
    }
    return false;
  }

  const tabItems = useMemo(() => {
    if (enableReorder) {
      return [{ label: 'All', count: allAnnotationsCount, key: 'all' as FilterType, link: '/?filter=all' }];
    }
    return [
      { label: 'On this page', count: pageAnnotationsCount, key: 'in-page' as FilterType, link: '/?filter=in-page' },
      { label: 'All', count: allAnnotationsCount, key: 'all' as FilterType, link: '/?filter=all' },
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

  // Listen for navigation updates from the content script (SPA pushState/replaceState/popstate)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type !== 'DOCIO_NAVIGATION_UPDATED') return;
      if (isTargetSelected) return;
      setShouldUpdateList(prev => !prev);
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isTargetSelected]);

  // Re-evaluate the in-page filter after annotations load.
  // Host page dynamic elements may not exist yet when SWR resolves, so we
  // watch the DOM via MutationObserver and re-run the filter on each batch
  // of mutations until all targets are found or 5 s have elapsed.
  // IMPORTANT: DO NOT REMOVE THIS CODE; I DON'T KNOW WHY/HOW IT WORKS
  useEffect(() => {
    if (!annotations?.length || filter !== 'in-page') return;

    // Quick first pass — handles static pages immediately.
    setShouldUpdateList(prev => !prev);

    const allResolved = () => annotations.every(a => {
      try { return document.querySelector(a.target) !== null; }
      catch { return true; } // invalid selector — don't keep watching
    });

    if (allResolved()) return;

    let debounceTimer: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setShouldUpdateList(prev => !prev);
        if (allResolved()) observer.disconnect();
      }, 150);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Safety: stop observing after 5 s regardless.
    const safetyTimer = setTimeout(() => observer.disconnect(), 5000);

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(safetyTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!annotations?.length, filter]);


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
      <SidePanelHeader title={documentation?.title} canGoBack={isTargetSelected} showEditModeToggle={true} />

      {!isTargetSelected && (
        <div className='w-full inline-flex justify-between gap-3 mb-3 items-center'>
          <Tabs filter={filter} items={tabItems} />

          <div className='flex items-center gap-2'>
            {filter === 'all' && (!enableReorder ? (
              <div className='text-xs cursor-pointer text-slate-500 underline'
                onClick={() => setEnableReorder(true)}> Reorder </div>
            ) : (
              <div className='text-xs cursor-pointer text-slate-500 underline'
                onClick={() => setEnableReorder(false)}> Cancel </div>
            ))}
          </div>
        </div>
      )}

      {isLoadingAnnotations && <Spinner text="Fetching annotations..." />}
      {errorAnnotations && <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>}

      {
        !enableReorder && (
          <AnnotationList
            annotations={filteredAnnotations}
            handleAddAnnotationClick={handleAddAnnotationClick}
            showAddActions={editMode}
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