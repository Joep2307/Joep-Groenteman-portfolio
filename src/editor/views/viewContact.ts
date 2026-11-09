import { SOCIAL_LINK_HTML } from '../constants';
import { addNode } from '../document/addNode';
import { leadText } from '../document/leadText';
import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { attrField } from '../fields/attrField';
import { field } from '../fields/field';
import { group } from '../fields/group';
import { textField } from '../fields/textField';
import { listEditor } from '../lists/listEditor';
import { sectionFields } from '../lists/sectionFields';
import { toItems } from '../lists/toItems';
import { clean } from '../util/clean';
import { h } from '../util/h';
import type { ViewContent } from './ViewContent';

export function viewContact(state: EditorState): ViewContent {
    const { doc } = state;
    const email = need(doc, '.contact-email');
    const socials = need(doc, '.socials');
    const details = group('Details', [
        textField(state, 'Big line', need(doc, '.contact-title')),
        field(
            state,
            'Email address',
            clean(email.textContent),
            (value) => {
                email.textContent = value;
                email.setAttribute('href', `mailto:${value.trim()}`);
            },
            { type: 'email' },
        ),
    ]);
    const links = group(
        'Links',
        listEditor(state, {
            key: 'socials',
            name: 'link',
            items: toItems(socials.children),
            // The name is the link's own text, ahead of its hidden note.
            render: ({ nodes: [link] }) =>
                h(
                    'div',
                    { class: 'two-up' },
                    field(
                        state,
                        'Name',
                        clean(leadText(link).data),
                        (value) => {
                            leadText(link).data = value;
                        },
                    ),
                    attrField(state, 'URL', link, 'href', {
                        type: 'url',
                        placeholder: 'https://',
                    }),
                ),
            adds: [
                {
                    label: 'Add link',
                    run: () => {
                        addNode(socials, SOCIAL_LINK_HTML);
                    },
                },
            ],
        }),
    );
    return {
        title: 'Contact',
        content: [
            group('Section', sectionFields(state, 'contact')),
            details,
            links,
        ],
    };
}
