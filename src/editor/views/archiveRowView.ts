import { dropEntry } from '../archive/dropEntry';
import { formatDay } from '../archive/formatDay';
import { missingHome } from '../archive/missingHome';
import { restoreEntry } from '../archive/restoreEntry';
import { assetUrl } from '../document/assetUrl';
import type { EditorState } from '../EditorState';
import { nextFieldId } from '../fields/nextFieldId';
import { act } from '../lists/act';
import { notify } from '../shell/notify';
import { h } from '../util/h';

/**
 * One archived entry: what it is, where it came from and when, with a
 * picture if it has one, and the buttons to restore or delete it.
 */
export function archiveRowView(
    state: EditorState,
    entry: HTMLElement,
    i: number,
): HTMLElement {
    const { doc } = state;
    const { kind = '', title = '', from = '', date } = entry.dataset;
    const id = nextFieldId(state);
    const blocked = missingHome(doc, entry);
    const img = entry.querySelector('img[src]');
    // Focus goes to the next entry, or the one before, or the heading.
    const focus = [
        `[data-fk="archive:${String(i)}:restore"]`,
        `[data-fk="archive:${String(i - 1)}:restore"]`,
    ];
    const meta = [kind, from && `from ${from}`, formatDay(date)]
        .filter(Boolean)
        .join(' · ');
    return h(
        'div',
        { class: 'row archive-row', 'data-row': `archive:${String(i)}` },
        img
            ? h('img', {
                  class: 'archive-thumb',
                  src: assetUrl(state, img.getAttribute('src')),
                  alt: '',
              })
            : h('span', { class: 'archive-thumb', 'aria-hidden': 'true' }),
        h(
            'div',
            { class: 'row-body' },
            h('p', { class: 'archive-meta' }, meta),
            h('p', { class: 'archive-title', id }, title),
            blocked ? h('p', { class: 'hint' }, blocked) : null,
        ),
        h(
            'div',
            { class: 'row-actions' },
            h(
                'button',
                {
                    type: 'button',
                    'aria-describedby': id,
                    'data-fk': `archive:${String(i)}:restore`,
                    disabled: blocked !== null,
                    onclick: () => {
                        act(
                            state,
                            () => {
                                restoreEntry(doc, entry);
                            },
                            focus,
                        );
                        notify(state, `Restored “${title}” to ${from}.`);
                    },
                },
                'Restore',
            ),
            h(
                'button',
                {
                    type: 'button',
                    class: 'danger',
                    'aria-describedby': id,
                    onclick: () => {
                        const sure = confirm(
                            `Delete “${title}” for good? It leaves the ` +
                                'page file when you publish.',
                        );
                        if (!sure) return;
                        act(
                            state,
                            () => {
                                dropEntry(doc, entry);
                            },
                            focus,
                        );
                    },
                },
                'Delete',
            ),
        ),
    );
}
