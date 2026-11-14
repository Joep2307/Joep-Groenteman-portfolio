import type { EditorState } from '../EditorState';

/**
 * The input on screen that edits `node`, or the nearest element around
 * it that has one.
 */
export function fieldFor(
    state: EditorState,
    node: Element | null,
): HTMLElement | null {
    for (let el = node; el; el = el.parentElement) {
        const input = state.fieldNodes.get(el);
        if (input?.isConnected) return input;
    }
    return null;
}
