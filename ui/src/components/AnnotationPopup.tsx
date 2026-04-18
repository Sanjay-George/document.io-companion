import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import { DocumentationContext, PanelOrientationContext } from '@/App';
import {
    ALL_ANNOTATIONS_KEY,
    SINGLE_ANNOTATION_KEY,
    addAnnotation,
    updateAnnotation,
    useAnnotationsByTarget,
} from '@/data_access/annotations';
import { Annotation } from '@/models/annotations';
import AnnotationEditor from '@/components/AnnotationEditor';
import AnnotationTypeSelector, { AnnotationType } from '@/components/AnnotationTypeSelector';
import CodeBlock from '@/components/CodeBlock';
import Spinner from '@/components/Spinner';
import CloseIcon from '@/components/icons/CloseIcon';
import DragHandleIcon from '@/components/icons/DragHandleIcon';
import LeftArrowIcon from '@/components/icons/LeftArrowIcon';
import RightArrowIcon from '@/components/icons/RightArrowIcon';
import ExpandIcon from '@/components/icons/ExpandIcon';
import { renderTitleFromValue } from '@/utils';

type PopupMode = 'add' | 'edit' | 'view';

type Props = {
    mode: PopupMode;
    target: string;
    elementRect: DOMRect;
    initialAnnotationId?: string;
    onClose: () => void;
};

export default function AnnotationPopup({ mode: initialMode, target, elementRect, initialAnnotationId, onClose }: Props) {
    const documentationId = useContext(DocumentationContext) as string;
    const { setIsMinimized } = useContext(PanelOrientationContext) as any;
    const navigate = useNavigate();

    const popupRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: 0, y: 0 });
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [pos, setPos] = useState(() => computeInitialPosition(elementRect));

    const [mode] = useState<PopupMode>(initialMode);
    const [annotationType, setAnnotationType] = useState<AnnotationType>('component');
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: annotations, isLoading } = useAnnotationsByTarget(documentationId, target);
    const currentAnnotation: Annotation | undefined = annotations?.[currentIndex];

    useEffect(() => { posRef.current = pos; }, [pos]);

    useEffect(() => {
        if (!annotations?.length || !initialAnnotationId) return;
        const idx = annotations.findIndex((a: Annotation) => a.id === initialAnnotationId);
        if (idx !== -1) setCurrentIndex(idx);
    }, [annotations, initialAnnotationId]);

    useEffect(() => {
        if (currentAnnotation?.type) setAnnotationType(currentAnnotation.type as AnnotationType);
    }, [currentAnnotation?.id]);

    const handleHeaderMouseDown = (e: React.MouseEvent) => {
        dragging.current = true;
        dragOffset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
        e.preventDefault();
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            const w = popupRef.current?.offsetWidth ?? 380;
            const h = popupRef.current?.offsetHeight ?? 500;
            const newPos = {
                x: Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - w)),
                y: Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - h)),
            };
            posRef.current = newPos;
            setPos(newPos);
        };
        const onUp = () => { dragging.current = false; };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, []);

    const handleAdd = async (value: string) => {
        const maxIndex = annotations?.reduce(
            (max: number, a: Annotation) => a.index > max ? a.index : max,
            -Infinity,
        ) ?? -1;
        const annotation: Annotation = {
            documentationId, value, target,
            url: window.location.href,
            created: new Date(), updated: new Date(),
            type: annotationType,
            index: maxIndex + 1,
        };
        await addAnnotation(annotation);
        await mutate(ALL_ANNOTATIONS_KEY(documentationId));
        onClose();
    };

    const handleEdit = async (value: string) => {
        if (!currentAnnotation) return;
        await updateAnnotation(currentAnnotation.id as string, {
            ...currentAnnotation, value, type: annotationType, updated: new Date(),
        });
        await mutate(ALL_ANNOTATIONS_KEY(documentationId));
        await mutate(SINGLE_ANNOTATION_KEY(currentAnnotation.id as string));
        onClose();
    };

    const handleOpenInPanel = () => {
        setIsMinimized(false);
        if (mode === 'add') {
            navigate(`/add?target=${encodeURIComponent(target)}`);
        } else if (currentAnnotation?.id) {
            navigate(mode === 'edit' ? `/${currentAnnotation.id}/edit` : `/${currentAnnotation.id}`);
        }
        onClose();
    };

    const title = mode === 'add'
        ? 'Add Annotation'
        : mode === 'edit'
            ? 'Edit Annotation'
            : currentAnnotation ? renderTitleFromValue(currentAnnotation.value, 25) : 'Annotation';

    const hasMultiple = (annotations?.length ?? 0) > 1;

    return (
        <div
            ref={popupRef}
            data-color-mode="light"
            data-light-theme="light"
            style={{ position: 'fixed', left: pos.x, top: pos.y, width: 380, maxHeight: '70vh', zIndex: 2147483647 }}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden pointer-events-auto"
        >
            {/* Header — drag handle */}
            <div
                className="flex items-center justify-between px-3 py-2 bg-slate-800 text-white rounded-t-xl cursor-grab active:cursor-grabbing select-none flex-shrink-0"
                onMouseDown={handleHeaderMouseDown}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-400 flex-shrink-0"><DragHandleIcon /></span>
                    <span className="text-xs font-semibold truncate">{title}</span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {hasMultiple && (
                        <>
                            <button
                                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                                disabled={currentIndex === 0}
                                className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition-colors"
                            >
                                <LeftArrowIcon />
                            </button>
                            <span className="text-xs text-slate-300 whitespace-nowrap tabular-nums">
                                {currentIndex + 1} / {annotations!.length}
                            </span>
                            <button
                                onClick={() => setCurrentIndex(i => Math.min(annotations!.length - 1, i + 1))}
                                disabled={currentIndex === annotations!.length - 1}
                                className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition-colors"
                            >
                                <RightArrowIcon />
                            </button>
                        </>
                    )}

                    <button onClick={handleOpenInPanel} title="Open in side panel"
                        className="p-1 hover:bg-slate-700 rounded transition-colors">
                        <ExpandIcon />
                    </button>

                    <button onClick={onClose} title="Close"
                        className="p-1 hover:bg-slate-700 rounded transition-colors">
                        <CloseIcon />
                    </button>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-3 pt-3 pb-1 space-y-2 min-h-0">
                {isLoading && mode !== 'add' && <Spinner text="Loading..." />}

                {mode === 'add' && (
                    <>
                        <CodeBlock title="Target" value={target} />
                        <CodeBlock title="URL" value={window.location.href} />
                        <AnnotationTypeSelector type={annotationType} onChange={setAnnotationType} />
                        <AnnotationEditor key="add-editor" content="" preview="live" height="250px" handleSave={handleAdd} />
                    </>
                )}

                {(mode === 'view' || mode === 'edit') && currentAnnotation && (
                    <>
                        <CodeBlock title="Target" value={target} />
                        {mode === 'edit' && (
                            <AnnotationTypeSelector type={annotationType} onChange={setAnnotationType} />
                        )}
                        <AnnotationEditor
                            key={`${currentAnnotation.id}-${mode}`}
                            content={currentAnnotation.value}
                            preview={mode === 'view' ? 'preview' : 'live'}
                            height="250px"
                            handleSave={mode === 'edit' ? handleEdit : undefined}
                        />
                    </>
                )}

                {(mode === 'view' || mode === 'edit') && !isLoading && !currentAnnotation && (
                    <p className="text-sm text-slate-500 py-2">No annotation found for this element.</p>
                )}
            </div>

        </div>
    );
}

function computeInitialPosition(rect: DOMRect): { x: number; y: number } {
    const popupWidth = 380;
    const popupHeight = 500;
    const margin = 12;

    let x: number;
    if (rect.right + margin + popupWidth <= window.innerWidth) {
        x = rect.right + margin;
    } else if (rect.left - margin - popupWidth >= 0) {
        x = rect.left - margin - popupWidth;
    } else {
        x = Math.max(margin, window.innerWidth - popupWidth - margin);
    }

    const y = Math.max(margin, Math.min(rect.top, window.innerHeight - popupHeight - margin));
    return { x, y };
}

