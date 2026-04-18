import { useEffect, useRef, useState } from 'react';
import ExpandIcon from './icons/ExpandIcon';

interface Props {
    onRestore: () => void;
}

export default function MinimizedPill({ onRestore }: Props) {
    const [pos, setPos] = useState<{ x: number; y: number }>(() => {
        const saved = localStorage.getItem('pillPosition');
        if (saved) {
            try { return JSON.parse(saved); } catch { /* ignore */ }
        }
        return { x: 20, y: window.innerHeight / 2 - 20 };
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
        </div>
    );
}
