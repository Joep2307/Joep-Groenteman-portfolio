import { PAGE_PATH } from '../constants';
import type { EditorState } from '../EditorState';
import { discardDraft } from '../publish/discardDraft';
import { h } from '../util/h';
import { changed } from './changed';
import { renderView } from './renderView';

/**
 * The warning shown while the page on GitHub is newer than the one these
 * edits started from, with the two ways out.
 */
export function conflictBanner(state: EditorState): HTMLElement | null {
    const { conflict } = state;
    if (!conflict) return null;
    return h(
        'div',
        { class: 'banner', role: 'alert' },
        h(
            'p',
            {},
            `${PAGE_PATH} changed on GitHub after you started these edits. ` +
                'Publishing your version would overwrite that newer change.',
        ),
        h(
            'div',
            { class: 'adds' },
            h(
                'button',
                {
                    type: 'button',
                    onclick: () => {
                        void discardDraft(state);
                    },
                },
                'Load the latest and drop my edits',
            ),
            h(
                'button',
                {
                    type: 'button',
                    class: 'danger',
                    onclick: () => {
                        state.baseBlobSha = conflict.blobSha;
                        state.conflict = null;
                        changed(state);
                        renderView(state);
                    },
                },
                'Keep my version',
            ),
        ),
    );
}
