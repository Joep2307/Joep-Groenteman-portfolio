import type { EditorState } from '../EditorState';
import { query } from '../util/query';

/** Closes the edit panel and puts focus back where it was opened from. */
export function closeDrawer(state: EditorState): void {
    query('#drawer').hidden = true;
    query(
        state.drawerFrom === 'page' ? '#preview-frame' : '#sections-btn',
    ).focus();
}
