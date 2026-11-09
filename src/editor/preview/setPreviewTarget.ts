import type { EditorState } from '../EditorState';
import type { PreviewTarget } from './PreviewTarget';
import { refreshPreview } from './refreshPreview';

/** Points the preview at another part of the page, if it is not there. */
export function setPreviewTarget(
    state: EditorState,
    target: PreviewTarget,
): void {
    if (JSON.stringify(target) === JSON.stringify(state.previewTarget)) {
        return;
    }
    state.previewTarget = target;
    state.previewScroll = null;
    refreshPreview(state);
}
