import { Mode, Note, Tab } from '@/companion/types';
import { PanelOrientation } from '@/models/panelOrientation';
import CompanionPanelHeader from '@/companion/CompanionPanelHeader';
import AnnotationBanner from '@/companion/AnnotationBanner';
import AnnotationCard from '@/companion/AnnotationCard';
import EmptyState from '@/companion/EmptyState';

type Props = {
    title: string;
    mode: Mode;
    onModeChange: (mode: Mode) => void;
    tab: Tab;
    onTabChange: (tab: Tab) => void;
    onMinimize: () => void;
    countAll: number;
    /** Notes to render, already filtered for the active scope tab. */
    notes: Note[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onReanchor: (id: string) => void;
    /** Re-anchor pick flow is active. */
    reanchoring?: boolean;
    reanchorTitle?: string;
    onCancelReanchor?: () => void;
    /** Dock right (vertical) or bottom (horizontal). Defaults to vertical. */
    orientation?: PanelOrientation;
    onOrientationChange?: (orientation: PanelOrientation) => void;
    /**
     * Fill the parent instead of using the fixed 376px/340px dock size. Used when
     * the panel lives inside a resizable container (react-resizable-panels) that
     * owns the actual dimensions. Storybook leaves this unset for the fixed size.
     */
    fill?: boolean;
};

/**
 * The docked companion panel (README §1) — fixed header over a scrolling body
 * of annotation cards, with the Annotate/re-anchor banner and empty state.
 */
export default function CompanionPanel({
    title,
    mode,
    onModeChange,
    tab,
    onTabChange,
    onMinimize,
    countAll,
    notes,
    selectedId,
    onSelect,
    onEdit,
    onDelete,
    onReanchor,
    reanchoring = false,
    reanchorTitle,
    onCancelReanchor,
    orientation = PanelOrientation.VERTICAL,
    onOrientationChange,
    fill = false,
}: Props) {
    const horizontal = orientation === PanelOrientation.HORIZONTAL;
    const container = horizontal
        ? `${fill ? 'h-full w-full' : 'h-[340px] w-full'} border-t shadow-dio-panel-h`
        : `${fill ? 'h-full w-full' : 'h-full w-[376px]'} border-l shadow-dio-panel`;

    return (
        <aside
            className={`z-40 flex flex-none flex-col border-dio-border-panel bg-white font-dio-ui ${container}`}
        >
            <CompanionPanelHeader
                title={title}
                mode={mode}
                onModeChange={onModeChange}
                onMinimize={onMinimize}
                tab={tab}
                onTabChange={onTabChange}
                countAll={countAll}
                orientation={onOrientationChange ? orientation : undefined}
                onOrientationChange={onOrientationChange}
            />

            {/* @container drives the responsive grid below: a single column when
                docked right (narrow) and multiple columns when docked bottom (wide). */}
            <div className="@container flex-1 overflow-y-auto px-[14px] pb-[18px] pt-1">
                {mode === 'edit' && (
                    <AnnotationBanner
                        variant={reanchoring ? 'reanchor' : 'annotate'}
                        reanchorTitle={reanchorTitle}
                        onCancel={onCancelReanchor}
                    />
                )}

                {notes.length === 0 ? (
                    <EmptyState onAddNote={() => onModeChange('edit')} />
                ) : (
                    <div className="grid grid-cols-1 gap-1 @2xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
                        {notes.map((note) => (
                            <AnnotationCard
                                key={note.id}
                                note={note}
                                selected={selectedId === note.id}
                                onSelect={() => onSelect(note.id)}
                                onEdit={() => onEdit(note.id)}
                                onDelete={() => onDelete(note.id)}
                                onReanchor={() => onReanchor(note.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
