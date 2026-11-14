import type { EditorState } from '../EditorState';
import { query } from '../util/query';
import { showSections } from './showSections';

/** Opens the edit panel beside (or under) the page. */
export function openDrawer(
    state: EditorState,
    from: 'page' | 'bar',
    withSections?: boolean,
): void {
    const drawer = query('#drawer');
    if (drawer.hidden) state.drawerFrom = from;
    drawer.hidden = false;
    if (withSections !== undefined) showSections(withSections);
}
