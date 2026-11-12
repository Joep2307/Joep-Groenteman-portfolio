import type { EditorState } from '../EditorState';

/** An id no other form field has. */
export function nextFieldId(state: EditorState): string {
    state.fieldSeq += 1;
    return `field-${String(state.fieldSeq)}`;
}
