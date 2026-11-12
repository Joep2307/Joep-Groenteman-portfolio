import { CV_ENTRY_HTML } from '../constants';
import { addNode } from '../document/addNode';
import { need } from '../document/need';
import { removeGroup } from '../document/removeGroup';
import type { EditorState } from '../EditorState';
import { field } from '../fields/field';
import { optionalField } from '../fields/optionalField';
import { textField } from '../fields/textField';
import { listEditor } from '../lists/listEditor';
import { toItems } from '../lists/toItems';
import { clean } from '../util/clean';
import { h } from '../util/h';

/**
 * The fields for one CV entry. A top-level entry can hold sub-roles, which
 * are entries themselves; `key` is unique to the entry.
 */
export function cvEntry(
    state: EditorState,
    entry: Element,
    key: string,
    withSubs: boolean,
): HTMLElement {
    const head = need(entry, ':scope > .cv-item-head');
    const role = need(head, '.cv-role');
    // The role reads "Name — <span>Organisation</span>".
    const roleText = (): { name: string; org: string } => {
        const copy = role.cloneNode(true) as Element;
        copy.querySelector('span')?.remove();
        return {
            name: clean(copy.textContent).replace(/\s*—$/, ''),
            org: clean(role.querySelector('span')?.textContent),
        };
    };
    const writeRole = ({ name, org }: { name: string; org: string }): void => {
        role.textContent = org.trim() ? `${name} — ` : name;
        if (!org.trim()) return;
        const span = role.ownerDocument.createElement('span');
        span.textContent = org;
        role.append(span);
    };
    const sub = (): Element | null => entry.querySelector(':scope > .cv-sub');

    const fields = [
        h(
            'div',
            { class: 'two-up' },
            field(state, 'Role or title', roleText().name, (name) => {
                writeRole({ ...roleText(), name });
            }),
            field(state, 'Organisation', roleText().org, (org) => {
                writeRole({ ...roleText(), org });
            }),
        ),
        h(
            'div',
            { class: 'two-up' },
            textField(state, 'Dates', need(head, '.cv-date')),
            optionalField(
                state,
                'Grade',
                entry,
                ':scope > .cv-grade',
                '<span class="cv-grade"></span>',
                () => head.nextElementSibling,
                { placeholder: 'Grade: 8.5' },
            ),
        ),
        optionalField(
            state,
            'Description',
            entry,
            ':scope > p',
            '<p></p>',
            sub,
            {
                multiline: true,
            },
        ),
    ];
    if (!withSubs) return h('div', {}, fields);

    const subRoles = listEditor(state, {
        key: `${key}:subs`,
        name: 'sub-role',
        items: toItems(sub()?.querySelectorAll(':scope > .cv-item') ?? []),
        // The wrapper goes with its last sub-role.
        remove: (item) => {
            const wrapper = item.nodes[0].parentElement;
            removeGroup(item);
            if (wrapper && !wrapper.children.length) {
                removeGroup({ nodes: [wrapper] });
            }
        },
        render: (item, i) =>
            cvEntry(state, item.nodes[0], `${key}:subs:${String(i)}`, false),
        adds: [
            {
                label: 'Add sub-role',
                run: () => {
                    addNode(
                        sub() ?? addNode(entry, '<div class="cv-sub"></div>'),
                        CV_ENTRY_HTML,
                    );
                },
            },
        ],
    });
    return h(
        'div',
        {},
        fields,
        h('div', {}, h('p', { class: 'sub-heading' }, 'Sub-roles'), subRoles),
    );
}
