import type { EditorState } from '../EditorState';
import { setPreviewTarget } from '../preview/setPreviewTarget';
import { query } from '../util/query';
import { resolveView } from '../views/resolveView';
import { renderView } from './renderView';

/** Opens a view, falling back to Intro if the page has no such view. */
export function go(state: EditorState, view: string): void {
    state.currentView = resolveView(state, view) ? view : 'intro';
    history.replaceState(null, '', `#${state.currentView}`);
    renderView(state);
    query('#editor').scrollTop = 0;
    query('#editor h1').focus();
    const target = resolveView(state, state.currentView)?.target;
    if (target) setPreviewTarget(state, target);
}
