import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { query } from '../util/query';

/** Updates the suggestions that image path fields offer. */
export function refreshKnownImages(state: EditorState): void {
    query('#known-images').replaceChildren(
        ...state.knownImages.map((path) => h('option', { value: path })),
    );
}
