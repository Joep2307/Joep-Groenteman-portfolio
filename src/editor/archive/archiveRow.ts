import type { EditorState } from '../EditorState';
import { notify } from '../shell/notify';
import { archiveNodes } from './archiveNodes';
import { describeNodes } from './describeNodes';

/**
 * Archives a row of a list in the open view, such as a paragraph, and
 * says where to find it.
 */
export function archiveRow(
    state: EditorState,
    nodes: readonly Element[],
    kind: string,
    title = describeNodes(nodes),
    from = state.viewTitle,
): void {
    archiveNodes(state.doc, nodes, { kind, title, from });
    notify(state, `Archived “${title}”. Restore it from Archive.`);
}
