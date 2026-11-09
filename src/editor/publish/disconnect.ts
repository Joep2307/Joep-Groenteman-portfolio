import { TOKEN_KEY } from '../constants';
import type { EditorState } from '../EditorState';
import { renderLogin } from '../screens/renderLogin';
import { flush } from '../shell/flush';

/** Forgets the GitHub token, after asking. The draft stays. */
export function disconnect(state: EditorState): void {
    const sure = confirm(
        'Remove your GitHub token from this browser? Unpublished changes ' +
            'stay saved here.',
    );
    if (!sure) return;
    flush(state);
    localStorage.removeItem(TOKEN_KEY);
    renderLogin(state);
}
