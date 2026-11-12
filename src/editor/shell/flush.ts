import { clearDraft } from '../draft/clearDraft';
import { isDirty } from '../draft/isDirty';
import { saveDraft } from '../draft/saveDraft';
import type { EditorState } from '../EditorState';
import { refreshPreview } from '../preview/refreshPreview';
import { renderSidebar } from './renderSidebar';
import { updateStatus } from './updateStatus';

/** Brings the status, sidebar, preview and saved draft up to date. */
export function flush(state: EditorState): void {
    window.clearTimeout(state.flushTimer);
    updateStatus(state);
    renderSidebar(state);
    refreshPreview(state);
    void (isDirty(state) ? saveDraft(state) : clearDraft());
}
