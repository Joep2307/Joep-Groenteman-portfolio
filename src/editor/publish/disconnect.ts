import { PASSWORD_KEY } from '../constants';
import type { EditorState } from '../EditorState';
import { flush } from '../shell/flush';

/**
 * Forgets the password, after asking. The draft stays and the editor
 * stays open; publishing asks for the password again.
 */
export function disconnect(state: EditorState): void {
    const sure = confirm(
        'Remove the password from this browser? Unpublished changes ' +
            'stay saved here.',
    );
    if (!sure) return;
    localStorage.removeItem(PASSWORD_KEY);
    flush(state);
}
