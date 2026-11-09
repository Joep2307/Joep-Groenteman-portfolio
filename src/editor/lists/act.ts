import type { EditorState } from '../EditorState';
import { changed } from '../shell/changed';
import { renderView } from '../shell/renderView';
import { query } from '../util/query';

/**
 * Runs a change that reshapes the form, redraws it, and puts focus on the
 * first of `focusTargets` that exists, so the keyboard keeps its place.
 */
export function act(
    state: EditorState,
    run: () => void,
    focusTargets: readonly string[] = [],
): void {
    run();
    changed(state);
    renderView(state);
    const target =
        focusTargets
            .map((selector) => document.querySelector<HTMLElement>(selector))
            .find((el) => el !== null) ?? query('#editor h1');
    target.focus();
}
