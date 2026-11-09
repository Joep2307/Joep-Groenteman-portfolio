import { clearDraft } from '../draft/clearDraft';
import type { EditorState } from '../EditorState';
import { start } from '../screens/start';

/** Drops every unpublished change, after asking, and loads the page anew. */
export async function discardDraft(state: EditorState): Promise<void> {
    if (!confirm("Drop every unpublished change? This can't be undone.")) {
        return;
    }
    window.clearTimeout(state.flushTimer);
    await clearDraft();
    state.pending = {};
    state.previewImages = {};
    state.conflict = null;
    await start(state);
}
