import { DRAFT_KEY } from '../constants';
import { withDraftStore } from './withDraftStore';

export async function clearDraft(): Promise<void> {
    await withDraftStore('readwrite', (kv) => kv.delete(DRAFT_KEY));
}
