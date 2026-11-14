import type { EditorState } from '../EditorState';
import { setPreviewTarget } from '../preview/setPreviewTarget';
import { openDrawer } from '../stage/openDrawer';
import { query } from '../util/query';
import { resolveView } from '../views/resolveView';
import { renderView } from './renderView';

/**
 * Opens a view in the edit panel and moves the page to it, falling back
 * to Intro if the page has no such view.
 */
export function go(state: EditorState, view: string): void {
    openDrawer(state, 'bar');
    state.currentView = resolveView(state, view) ? view : 'intro';
    history.replaceState(null, '', `#${state.currentView}`);
    renderView(state);
    query('#editor').scrollTop = 0;
    query('#editor h1').focus();
    const target = resolveView(state, state.currentView)?.target;
    if (target) setPreviewTarget(state, target);
}
