import { DRAFT_KEY } from '../constants';
import { serialize } from '../document/serialize';
import type { EditorState } from '../EditorState';
import type { Draft } from './Draft';
import { withDraftStore } from './withDraftStore';

/** Keeps the unpublished edits on this device until they are published. */
export async function saveDraft(state: EditorState): Promise<void> {
    const draft: Draft = {
        html: serialize(state.doc),
        baseBlobSha: state.baseBlobSha,
        pending: state.pending,
    };
    await withDraftStore('readwrite', (kv) => kv.put(draft, DRAFT_KEY));
}
