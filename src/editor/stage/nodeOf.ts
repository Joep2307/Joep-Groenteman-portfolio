import type { EditorState } from '../EditorState';

/** The element of the edited page that a preview element was drawn from. */
export function nodeOf(state: EditorState, el: Element): Element | null {
    const index = el.closest('[data-node]')?.getAttribute('data-node');
    return index ? (state.previewNodes[Number(index)] ?? null) : null;
}
