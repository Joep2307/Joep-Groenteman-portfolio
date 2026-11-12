import type { EditorState } from '../EditorState';
import { query } from '../util/query';
import { refreshPreview } from './refreshPreview';
import { renderShellState } from './renderShellState';

export function togglePreview(state: EditorState): void {
    state.previewOn = !state.previewOn;
    renderShellState(state);
    if (state.previewOn) refreshPreview(state);
    else query('#preview').replaceChildren();
}
