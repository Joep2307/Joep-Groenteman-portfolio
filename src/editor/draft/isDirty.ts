import { serialize } from '../document/serialize';
import type { EditorState } from '../EditorState';

/** Whether anything differs from what is published. */
export function isDirty(state: EditorState): boolean {
    return (
        serialize(state.doc) !== state.cleanHtml ||
        Object.keys(state.pending).length > 0
    );
}
