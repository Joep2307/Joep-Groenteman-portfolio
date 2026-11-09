import { isDirty } from '../draft/isDirty';
import type { EditorState } from '../EditorState';
import { query } from '../util/query';

/** Shows whether there is anything to publish or discard. */
export function updateStatus(state: EditorState): void {
    const dirty = isDirty(state);
    const status = query('#status');
    status.textContent = dirty
        ? 'Unpublished changes, saved on this device'
        : 'Everything is published';
    status.classList.toggle('dirty', dirty);
    query('#publish-btn').toggleAttribute('disabled', !dirty);
    query('#discard-btn').toggleAttribute('disabled', !dirty);
}
