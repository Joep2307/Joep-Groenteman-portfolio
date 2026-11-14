import type { EditorState } from '../EditorState';
import { previewTargetOf } from '../preview/previewTargetOf';
import { renderView } from '../shell/renderView';
import { query } from '../util/query';
import { resolveView } from '../views/resolveView';
import { fieldFor } from './fieldFor';
import { markTarget } from './markTarget';
import { openDrawer } from './openDrawer';

/**
 * Opens a view for a click on the page and focuses the field for what was
 * clicked. The page stays where it is: it is already showing that part.
 */
export function openFromPage(
    state: EditorState,
    view: string,
    node: Element | null,
): void {
    const resolved = resolveView(state, view);
    if (!resolved) return;
    state.currentView = view;
    history.replaceState(null, '', `#${view}`);
    openDrawer(state, 'page', false);
    renderView(state);

    const input = fieldFor(state, node);
    const usable = input && !input.matches(':disabled');
    // Set before focus moves, so the focus handler finds the preview
    // already where it should be and does not redraw it.
    state.previewTarget = (input && previewTargetOf(input)) ?? resolved.target;
    markTarget(input);
    if (usable) {
        input.focus();
        input.scrollIntoView({ block: 'center' });
    } else {
        input?.scrollIntoView({ block: 'center' });
        query('#editor h1').focus();
    }
}
