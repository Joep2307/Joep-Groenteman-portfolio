import logoUrl from '../../../exe/img/logo.svg';
import type { EditorState } from '../EditorState';
import { refreshKnownImages } from '../fields/refreshKnownImages';
import { previewTargetOf } from '../preview/previewTargetOf';
import { refreshPreview } from '../preview/refreshPreview';
import { setPreviewTarget } from '../preview/setPreviewTarget';
import { discardDraft } from '../publish/discardDraft';
import { openPublishDialog } from '../publish/openPublishDialog';
import { logOut } from '../shell/logOut';
import { renderView } from '../shell/renderView';
import { updateStatus } from '../shell/updateStatus';
import { closeDrawer } from '../stage/closeDrawer';
import { openDrawer } from '../stage/openDrawer';
import { toggleSections } from '../stage/toggleSections';
import { h } from '../util/h';
import { query } from '../util/query';
import { resolveView } from '../views/resolveView';

/**
 * Draws the editor: the page itself, full screen inside the striped
 * border, the edit panel that opens beside it, and the bar on the border.
 */
export function renderEditor(state: EditorState): void {
    const type = 'button';
    query('#app').replaceChildren(
        h(
            'div',
            { class: 'edit-mode', id: 'layout' },
            h(
                'main',
                { class: 'workspace' },
                h('div', { class: 'stage', id: 'preview' }),
                h(
                    'section',
                    {
                        class: 'drawer',
                        id: 'drawer',
                        'aria-label': 'Edit',
                        hidden: true,
                        onkeydown: (event) => {
                            if (
                                !(event instanceof KeyboardEvent) ||
                                event.key !== 'Escape'
                            ) {
                                return;
                            }
                            event.preventDefault();
                            closeDrawer(state);
                        },
                    },
                    h(
                        'div',
                        { class: 'drawer-head' },
                        h(
                            'button',
                            {
                                type,
                                id: 'sections-toggle',
                                'aria-controls': 'sidebar',
                                'aria-expanded': 'false',
                                onclick: toggleSections,
                            },
                            'All sections',
                        ),
                        h(
                            'button',
                            {
                                type,
                                class: 'icon',
                                'aria-label': 'Close the edit panel',
                                onclick: () => {
                                    closeDrawer(state);
                                },
                            },
                            '×',
                        ),
                    ),
                    h('nav', {
                        class: 'sidebar',
                        id: 'sidebar',
                        'aria-label': 'Every part of the page',
                        hidden: true,
                    }),
                    h('div', { class: 'editor', id: 'editor' }),
                ),
            ),
            h(
                'header',
                { class: 'bar' },
                h('img', { src: logoUrl, alt: '' }),
                h('strong', {}, 'Edit mode'),
                h('span', { class: 'status', id: 'status', role: 'status' }),
                h(
                    'button',
                    {
                        type,
                        id: 'sections-btn',
                        'aria-controls': 'drawer',
                        'aria-expanded': 'false',
                        onclick: () => {
                            openDrawer(state, 'bar', true);
                            query(
                                '#sidebar [aria-current], #sidebar button',
                            ).focus();
                        },
                    },
                    'Sections',
                ),
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
                h(
                    'button',
                    {
                        type,
                        class: 'log-out',
                        onclick: () => {
                            void logOut(state);
                        },
                    },
                    'Log out',
                ),
            ),
        ),
    );

    // The page follows the group of fields that has focus.
    query('#editor').addEventListener('focusin', (event) => {
        const scoped =
            event.target instanceof Element
                ? previewTargetOf(event.target)
                : null;
        const target = scoped ?? resolveView(state, state.currentView)?.target;
        setPreviewTarget(state, target ?? { scroll: '#intro' });
    });

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
