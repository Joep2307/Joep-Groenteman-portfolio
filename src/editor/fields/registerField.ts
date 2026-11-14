import type { EditorState } from '../EditorState';

/**
 * Remembers that the input in `wrapper` edits `nodes`, so clicking them
 * in the page can focus it.
 */
export function registerField(
    state: EditorState,
    nodes: Element | readonly Element[],
    wrapper: HTMLElement,
): HTMLElement {
    const input = wrapper.querySelector<HTMLElement>('input, textarea');
    if (input) {
        for (const node of [nodes].flat()) state.fieldNodes.set(node, input);
    }
    return wrapper;
}
