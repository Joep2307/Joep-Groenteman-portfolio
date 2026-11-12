import type { EditorState } from '../EditorState';
import { autosize } from '../fields/autosize';
import { h } from '../util/h';
import { query } from '../util/query';
import { resolveView } from '../views/resolveView';
import { viewIntro } from '../views/viewIntro';
import { conflictBanner } from './conflictBanner';
import { renderSidebar } from './renderSidebar';

/** Draws the current view's form, keeping its scroll position. */
export function renderView(state: EditorState): void {
    const main = query('#editor');
    const top = main.scrollTop;
    const view = resolveView(state, state.currentView);
    const { title, content } = view ? view.render() : viewIntro(state);
    main.replaceChildren(
        ...[conflictBanner(state), h('h1', { tabindex: '-1' }, title)].filter(
            (el) => el !== null,
        ),
        ...content,
    );
    main.querySelectorAll('textarea').forEach(autosize);
    main.scrollTop = top;
    renderSidebar(state);
}
