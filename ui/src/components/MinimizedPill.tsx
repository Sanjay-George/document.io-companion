import { useEffect, useRef, useState } from 'react';
import ExpandIcon from './icons/ExpandIcon';

type Props = {
    onRestore: () => void;
    editMode: boolean;
    onToggleEditMode: () => void;
};

export default function MinimizedPill({ onRestore, editMode, onToggleEditMode }: Props) {
    const [pos, setPos] = useState<{ x: number; y: number }>(() => {
        const saved = localStorage.getItem('pillPosition');
        if (saved) {
            try { return JSON.parse(saved); } catch { /* ignore */ }
        }
        return { x: window.innerWidth - 170, y: 20 };
    });

    const pillRef = useRef<HTMLDivElement>(null);
    const posRef = useRef(pos);
    const dragging = useRef(false);
    const didDrag = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const clampToViewport = (x: number, y: number) => {
        const w = pillRef.current?.offsetWidth ?? 150;
        const h = pillRef.current?.offsetHeight ?? 44;
        return {
            x: Math.max(0, Math.min(x, window.innerWidth - w)),
            y: Math.max(0, Math.min(y, window.innerHeight - h)),
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        dragging.current = true;
        didDrag.current = false;
        dragOffset.current = {
            x: e.clientX - posRef.current.x,
            y: e.clientY - posRef.current.y,
        };
        e.preventDefault();
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            didDrag.current = true;
            const newPos = clampToViewport(
                e.clientX - dragOffset.current.x,
                e.clientY - dragOffset.current.y,
            );
            posRef.current = newPos;
            setPos(newPos);
        };

        const onMouseUp = () => {
            if (!dragging.current) return;
            dragging.current = false;
            localStorage.setItem('pillPosition', JSON.stringify(posRef.current));
        };

        const onResize = () => {
            const clamped = clampToViewport(posRef.current.x, posRef.current.y);
            if (clamped.x !== posRef.current.x || clamped.y !== posRef.current.y) {
                posRef.current = clamped;
                setPos(clamped);
                localStorage.setItem('pillPosition', JSON.stringify(clamped));
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', onResize);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const handleClick = () => {
        if (!didDrag.current) {
            onRestore();
        }
    };

    return (
        <div
            ref={pillRef}
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                zIndex: 2147483647,
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-full shadow-lg select-none pointer-events-auto cursor-grab active:cursor-grabbing hover:bg-slate-700 transition-colors duration-150"
        >
            <ExpandIcon />
            <span className="text-xs font-medium whitespace-nowrap">document.io</span>
            <div
                className="w-px h-3.5 bg-slate-600"
                onMouseDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
            />
            <button
                title={editMode ? 'Exit edit mode' : 'Enter edit mode'}
                onClick={e => { e.stopPropagation(); onToggleEditMode(); }}
                onMouseDown={e => e.stopPropagation()}
                className={`p-0.5 rounded transition-colors ${editMode ? 'text-accent' : 'text-slate-400 hover:text-white'}`}
            >
                {editMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
