import { TOKEN_KEY } from '../constants';
import type { EditorState } from '../EditorState';
import { flush } from '../shell/flush';

/**
 * Forgets the GitHub token, after asking. The draft stays and the editor
 * stays open; publishing asks for a token again.
 */
export function disconnect(state: EditorState): void {
    const sure = confirm(
        'Remove your GitHub token from this browser? Unpublished changes ' +
            'stay saved here.',
    );
    if (!sure) return;
    localStorage.removeItem(TOKEN_KEY);
    flush(state);
}
