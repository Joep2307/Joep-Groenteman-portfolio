import { LOGOUT_URL } from '../constants';
import type { EditorState } from '../EditorState';
import { renderLogin } from '../screens/renderLogin';
import { flush } from './flush';
import { notify } from './notify';

/** Logs out, after asking. Unpublished changes stay saved here. */
export async function logOut(state: EditorState): Promise<void> {
    const sure = confirm(
        'Log out? Unpublished changes stay saved on this device.',
    );
    if (!sure) return;
    flush(state);
    const res = await fetch(LOGOUT_URL, { method: 'POST' }).catch(() => null);
    if (!res?.ok) {
        notify(state, "Couldn't log out. Check your connection.");
        return;
    }
    renderLogin();
}
