import { MouseEvent } from 'react';
import { Note } from '@/companion/types';
import { snippet } from '@/companion/markdown';
import NumberCircle from '@/companion/NumberCircle';
import NoteBody from '@/companion/NoteBody';
import TextButton from '@/companion/TextButton';
import { AlertTriangleIcon, ChevronRightIcon, EditIcon, LinkIcon } from '@/companion/icons';

type Props = {
    note: Note;
    selected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onReanchor: () => void;
};

/**
 * A note in the docked list (README §5), rendering one of three states:
 * collapsed, expanded (selected), or broken/stale.
 */
export default function AnnotationCard({ note, selected, onSelect, onEdit, onDelete, onReanchor }: Props) {
    const broken = !!note.broken;
    const otherPage = note.onPage === false;
    const expanded = selected && !broken;
    const collapsed = !selected && !broken;

    const numVariant = broken ? 'broken' : selected ? 'selected' : otherPage ? 'other' : 'idle';

    const container = broken
        ? 'border border-dashed border-dio-broken-border bg-dio-broken-bg'
        : selected
            ? 'border border-dio-border-field bg-white shadow-dio-card'
            : 'border border-transparent bg-transparent';

    const stop = (fn: () => void) => (e: MouseEvent) => {
        e.stopPropagation();
        fn();
    };

    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer rounded-dio-card p-3 transition-[background-color,border-color] duration-150 ${container}`}
        >
            <div className="flex items-center gap-3">
                <NumberCircle number={note.n} variant={numVariant} />
                <span className="flex-1 text-[14px] font-semibold leading-[1.3] text-dio-primary">{note.title}</span>
                {otherPage && <LinkIcon size={11} className="flex-none text-dio-faint" />}
                {collapsed && <ChevronRightIcon size={16} className="flex-none text-dio-chevron" />}
            </div>

            {collapsed && (
                <div className="ml-9 mt-1.5 line-clamp-1 text-[12.5px] leading-[1.45] text-dio-muted">
                    {snippet(note.body)}
                </div>
            )}

            {expanded && (
                <div className="ml-9 mt-[11px]">
                    <NoteBody note={note} />
                    <div className="mt-[14px] flex gap-[14px]">
                        <TextButton
                            label="Edit"
                            onClick={stop(onEdit)}
                            icon={<EditIcon size={13} />}
                            className="text-dio-tertiary hover:text-dio-primary"
                        />
                        <TextButton label="Delete" onClick={stop(onDelete)} className="text-[#B79A93] hover:text-dio-danger" />
                    </div>
                </div>
            )}

            {broken && (
                <div className="ml-9 mt-[9px] flex items-start gap-2">
                    <AlertTriangleIcon size={14} className="mt-px flex-none text-dio-danger-2" />
                    <div className="flex-1">
                        <div className="text-[12.5px] leading-[1.4] text-dio-danger">
                            This element isn&apos;t on the page anymore.
                        </div>
                        <div className="mt-2 flex gap-[14px]">
                            <TextButton label="Re-anchor" onClick={stop(onReanchor)} className="!text-[12px] text-dio-danger-2" />
                            <TextButton label="Dismiss" onClick={stop(onDelete)} className="!text-[12px] text-[#B79A93]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
