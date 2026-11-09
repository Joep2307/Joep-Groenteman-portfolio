import { FLUSH_DELAY_MS } from '../constants';
import type { EditorState } from '../EditorState';
import { flush } from './flush';

/** Notes an edit to the page; the editor catches up once typing pauses. */
export function changed(state: EditorState): void {
    window.clearTimeout(state.flushTimer);
    state.flushTimer = window.setTimeout(() => {
        flush(state);
    }, FLUSH_DELAY_MS);
}
