import { DRAFT_KEY } from '../constants';
import type { Draft } from './Draft';
import { withDraftStore } from './withDraftStore';

export async function loadDraft(): Promise<Draft | undefined> {
    const draft = await withDraftStore<unknown>('readonly', (kv) =>
        kv.get(DRAFT_KEY),
    );
    return draft as Draft | undefined;
}
