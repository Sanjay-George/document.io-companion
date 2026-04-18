import Spinner from '@/components/Spinner';
import { useDocumentation } from '@/data_access/documentations';
import { ALL_ANNOTATIONS_KEY, updateAnnotations, useAnnotationsByTarget } from '@/data_access/annotations';
import SidePanelHeader from '@/components/SidePanelHeader';
import { useContext, useEffect, useMemo, useState, } from 'react';
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
  const filterQS = searchParams.get('filter') || 'in-page';

  const isTargetSelected = useMemo(() => !!target && target.length > 0, [target]);
  const [filter, setFilter] = useState<FilterType>(filterQS as FilterType);

  // Incremented to force re-evaluation of in-page filter (on SPA nav or DOM changes)
  const [updateKey, setUpdateKey] = useState(0);
  const forceUpdate = () => setUpdateKey(k => k + 1);

  // Update filter state when query string changes
  useEffect(() => {
    if (filter !== filterQS) {
      setFilter(filterQS as FilterType);
    }
  }, [filterQS]);

  // Listen for SPA navigation events from content script
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'DOCIO_NAVIGATION_UPDATED') return;
      if (!isTargetSelected) forceUpdate();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isTargetSelected]);

  // MutationObserver: re-evaluate in-page filter when DOM changes
  useEffect(() => {
    if (!documentationId) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(forceUpdate, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [documentationId]);

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
  }, [annotations, filter, updateKey]);

  const pageAnnotationsCount = useMemo(() => annotations?.filter(inPageFilter).length, [annotations, updateKey]);
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
    return [
      { label: 'On this page', count: pageAnnotationsCount, key: 'in-page' as FilterType, link: '/?filter=in-page' },
      { label: 'All', count: allAnnotationsCount, key: 'all' as FilterType, link: '/?filter=all' },
    ];
  }, [pageAnnotationsCount, allAnnotationsCount]);

  // Handlers
  const handleSaveOrdering = async (values: Annotation[]) => {
    await updateAnnotations(values);
    await mutate(ALL_ANNOTATIONS_KEY(documentationId));
  }

  const handleAddAnnotationClick = () => {
    if (isTargetSelected) {
      navigate(`/add?target=${encodeURIComponent(target as any)}`);
      return;
    }
    navigate(`/add`);
  }

  if (!documentationId) {
    return <Spinner text="Loading editor..." />;
  }

  if (isLoading) {
    return <Spinner text="Fetching details..." />;
  }

  if (error) {
    return <div className='text-red-700'>Failed to load the editor. Error: {error?.message}</div>;
  }

  // Auth error
  if (errorAnnotations?.message?.includes('401')) {
    return (
      <div className='text-sm text-slate-600 py-4'>
        You&rsquo;re not signed in.{' '}
        <a className='underline text-indigo-600 hover:text-indigo-800'
          href={`${window.location.origin}/login`} target='_blank' rel='noreferrer'>
          Open document.io to sign in
        </a>
      </div>
    );
  }

  // Reorderable list is always shown when viewing "All" with no target selected
  const showReorderable = filter === 'all' && !isTargetSelected;

  return (
    <div className='@container'>

      <SidePanelHeader title={documentation?.title} canGoBack={isTargetSelected} />

      {!isTargetSelected && (
        <div className='w-full inline-flex justify-between gap-3 mb-3 items-center'>
          <Tabs filter={filter} items={tabItems} />
        </div>
      )}

      {isLoadingAnnotations && <Spinner text="Fetching annotations..." />}
      {errorAnnotations && !errorAnnotations?.message?.includes('401') && (
        <div className='text-red-700'>Failed to load annotations. Error: {errorAnnotations?.message}</div>
      )}

      {
        !showReorderable && (
          <AnnotationList
            annotations={filteredAnnotations}
            handleAddAnnotationClick={handleAddAnnotationClick}
          />
        )
      }

      {
        showReorderable &&
        <AnnotationListReorderable
          annotations={filteredAnnotations}
          onSaveOrder={handleSaveOrdering} />
      }

    </div>

  )
}