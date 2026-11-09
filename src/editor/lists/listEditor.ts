import { removeGroup } from '../document/removeGroup';
import { swapGroups } from '../document/swapGroups';
import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { act } from './act';
import type { ListEditorOptions } from './ListEditorOptions';
import type { ListItem } from './ListItem';

/** Rows that can be reordered, removed and added to. */
export function listEditor<T extends ListItem>(
    state: EditorState,
    options: ListEditorOptions<T>,
): HTMLElement {
    const { key, name, items, render, adds = [], rowClass = '' } = options;
    const { swap = swapGroups, remove = removeGroup, confirmRemove } = options;

    // After a move, focus follows the row; at either end, where that
    // button is disabled, it lands on the opposite one.
    const moveFocus = (i: number, dir: 'up' | 'down'): string[] => {
        const other = dir === 'up' ? 'down' : 'up';
        const row = `${key}:${String(i)}`;
        return [
            `[data-fk="${row}:${dir}"]:not(:disabled)`,
            `[data-fk="${row}:${other}"]:not(:disabled)`,
        ];
    };
    const firstInput = (i: number): string => {
        const row = `[data-row="${key}:${String(i)}"]`;
        return `${row} input:not([type="file"]), ${row} textarea`;
    };

    const moveButton = (i: number, dir: 'up' | 'down'): HTMLElement => {
        const to = dir === 'up' ? i - 1 : i + 1;
        return h(
            'button',
            {
                type: 'button',
                class: 'icon',
                'aria-label': `Move ${name} ${String(i + 1)} ${dir}`,
                title: `Move ${dir}`,
                'data-fk': `${key}:${String(i)}:${dir}`,
                disabled: to < 0 || to >= items.length,
                onclick: () => {
                    act(
                        state,
                        () => {
                            swap(items, i, to);
                        },
                        moveFocus(to, dir),
                    );
                },
            },
            dir === 'up' ? '↑' : '↓',
        );
    };
    const removeButton = (item: T, i: number): HTMLElement =>
        h(
            'button',
            {
                type: 'button',
                class: 'icon danger',
                'aria-label': `Remove ${name} ${String(i + 1)}`,
                title: 'Remove',
                onclick: () => {
                    if (confirmRemove && !confirm(confirmRemove(item))) return;
                    act(state, () => {
                        remove(item);
                    }, [`[data-add="${key}"]`]);
                },
            },
            '✕',
        );

    return h(
        'div',
        {},
        items.map((item, i) =>
            h(
                'div',
                {
                    class: `row ${rowClass}`,
                    'data-row': `${key}:${String(i)}`,
                },
                h('div', { class: 'row-body' }, render(item, i)),
                h(
                    'div',
                    { class: 'row-actions' },
                    moveButton(i, 'up'),
                    moveButton(i, 'down'),
                    item.fixed ? null : removeButton(item, i),
                ),
            ),
        ),
        adds.length > 0
            ? h(
                  'div',
                  { class: 'adds' },
                  adds.map((add, i) =>
                      h(
                          'button',
                          {
                              type: 'button',
                              'data-add': i === 0 ? key : null,
                              onclick: () => {
                                  act(state, add.run, [
                                      firstInput(items.length),
                                  ]);
                              },
                          },
                          `+ ${add.label}`,
                      ),
                  ),
              )
            : null,
    );
}
