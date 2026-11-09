import type { EditorState } from '../EditorState';
import { query } from '../util/query';

/** Makes the layout and the preview button show whether the preview is on. */
export function renderShellState(state: EditorState): void {
    query('#layout').classList.toggle('preview-on', state.previewOn);
    const btn = query('#preview-btn');
    btn.textContent = state.previewOn ? 'Hide preview' : 'Show preview';
    btn.setAttribute('aria-pressed', String(state.previewOn));
}
