import { archiveRow } from '../archive/archiveRow';
import { removeGroup } from '../document/removeGroup';
import { swapGroups } from '../document/swapGroups';
import type { EditorState } from '../EditorState';
import { capitalize } from '../util/capitalize';
import { h } from '../util/h';
import { act } from './act';
import type { ListEditorOptions } from './ListEditorOptions';
import type { ListItem } from './ListItem';
import { moveItem } from './moveItem';
import { startDrag } from './startDrag';

/**
 * Rows that can be reordered, by dragging their handle or with the arrow
 * buttons, archived, removed and added to.
 */
export function listEditor<T extends ListItem>(
    state: EditorState,
    options: ListEditorOptions<T>,
): HTMLElement {
    const { key, name, items, render, adds = [], rowClass = '' } = options;
    const { swap = swapGroups, remove = removeGroup, confirmRemove } = options;
    const archive =
        options.archive ??
        ((item: T): void => {
            archiveRow(state, item.nodes, capitalize(name));
        });

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
    const move = (from: number, to: number): void => {
        act(
            state,
            () => {
                moveItem(items, from, to, swap);
            },
            moveFocus(to, to < from ? 'up' : 'down'),
        );
    };

    // The arrows do what the handle does, for the keyboard.
    const grip = (): HTMLElement =>
        h('span', {
            class: 'row-grip',
            'aria-hidden': 'true',
            title: 'Drag to move',
            onpointerdown: (event) => {
                if (event instanceof PointerEvent) startDrag(event, move);
            },
        });
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
                    move(i, to);
                },
            },
            dir === 'up' ? '↑' : '↓',
        );
    };
    const archiveButton = (item: T, i: number): HTMLElement | null =>
        archive === false
            ? null
            : h(
                  'button',
                  {
                      type: 'button',
                      class: 'icon',
                      'aria-label': `Archive ${name} ${String(i + 1)}`,
                      title: 'Archive',
                      onclick: () => {
                          act(state, () => {
                              archive(item);
                          }, [`[data-add="${key}"]`]);
                      },
                  },
                  h('span', { class: 'icon-archive', 'aria-hidden': 'true' }),
              );
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
        h(
            'div',
            { class: 'rows' },
            items.map((item, i) =>
                h(
                    'div',
                    {
                        class: `row ${rowClass}`,
                        'data-row': `${key}:${String(i)}`,
                    },
                    items.length > 1
                        ? grip()
                        : h('span', {
                              class: 'row-grip is-idle',
                              'aria-hidden': 'true',
                          }),
                    h('div', { class: 'row-body' }, render(item, i)),
                    h(
                        'div',
                        { class: 'row-actions' },
                        moveButton(i, 'up'),
                        moveButton(i, 'down'),
                        item.fixed ? null : archiveButton(item, i),
                        item.fixed ? null : removeButton(item, i),
                    ),
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
