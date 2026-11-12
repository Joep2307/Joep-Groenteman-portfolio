import logoUrl from '../../../exe/img/logo.svg';
import type { EditorState } from '../EditorState';
import { refreshKnownImages } from '../fields/refreshKnownImages';
import { previewTargetOf } from '../preview/previewTargetOf';
import { refreshPreview } from '../preview/refreshPreview';
import { renderShellState } from '../preview/renderShellState';
import { setPreviewTarget } from '../preview/setPreviewTarget';
import { togglePreview } from '../preview/togglePreview';
import { discardDraft } from '../publish/discardDraft';
import { openPublishDialog } from '../publish/openPublishDialog';
import { renderView } from '../shell/renderView';
import { updateStatus } from '../shell/updateStatus';
import { h } from '../util/h';
import { query } from '../util/query';
import { resolveView } from '../views/resolveView';

/** Draws the editor around the loaded page and opens the view in the URL. */
export function renderEditor(state: EditorState): void {
    const type = 'button';
    query('#app').replaceChildren(
        h(
            'header',
            { class: 'topbar' },
            h('img', { src: logoUrl, alt: '' }),
            h('strong', {}, 'Portfolio editor'),
            h('span', { class: 'status', id: 'status', role: 'status' }),
            h(
                'button',
                {
                    type,
                    id: 'discard-btn',
                    class: 'discard',
                    onclick: () => {
                        void discardDraft(state);
                    },
                },
                'Discard',
            ),
            h('button', {
                type,
                id: 'preview-btn',
                onclick: () => {
                    togglePreview(state);
                },
            }),
            h(
                'button',
                {
                    type,
                    id: 'publish-btn',
                    class: 'primary',
                    onclick: () => {
                        openPublishDialog(state);
                    },
                },
                'Publish',
            ),
        ),
        h(
            'div',
            { class: 'layout', id: 'layout' },
            h('nav', {
                class: 'sidebar',
                id: 'sidebar',
                'aria-label': 'Editor sections',
            }),
            h('main', { class: 'editor', id: 'editor' }),
            h('div', { class: 'preview', id: 'preview' }),
        ),
    );

    // The preview follows the group of fields that has focus.
    query('#editor').addEventListener('focusin', (event) => {
        const scoped =
            event.target instanceof Element
                ? previewTargetOf(event.target)
                : null;
        const target = scoped ?? resolveView(state, state.currentView)?.target;
        setPreviewTarget(state, target ?? { scroll: '#intro' });
    });

    renderShellState(state);
    refreshKnownImages(state);
    const view = location.hash.slice(1) || 'intro';
    state.currentView = resolveView(state, view) ? view : 'intro';
    state.previewTarget = resolveView(state, state.currentView)?.target ?? {
        scroll: '#intro',
    };
    state.previewScroll = null;
    renderView(state);
    updateStatus(state);
    refreshPreview(state);
}
