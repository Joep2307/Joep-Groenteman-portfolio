import type { EditorState } from '../EditorState';
import { renderLogin } from '../screens/renderLogin';
import { flush } from '../shell/flush';

/** Asks for the editor password. Unpublished changes stay saved meanwhile. */
export function connect(state: EditorState): void {
    flush(state);
    renderLogin(state);
}
