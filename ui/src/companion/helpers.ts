import { Note } from '@/companion/types';

/**
 * Context line shown on expanded cards and popovers: the element's CSS selector,
 * or the page URL for whole-page notes.
 */
export function contextLabel(note: Pick<Note, 'type' | 'selector' | 'url'>): string {
    if (note.type === 'page') return note.url || 'this page';
    return note.selector || 'element';
}
