import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { attrField } from '../fields/attrField';
import { field } from '../fields/field';
import { group } from '../fields/group';
import { richField } from '../fields/richField';
import { textField } from '../fields/textField';
import { clean } from '../util/clean';
import type { ViewContent } from './ViewContent';

export function viewSettings(state: EditorState): ViewContent {
    const { doc } = state;
    // Every case study has its own copy of these buttons.
    const sharedField = (label: string, selector: string): HTMLElement =>
        field(
            state,
            label,
            clean(doc.querySelector(selector)?.textContent),
            (value) => {
                doc.querySelectorAll(selector).forEach((el) => {
                    el.textContent = value;
                });
            },
        );
    const meta = (selector: string): HTMLElement => need(doc, selector);
    const skipLink = doc.querySelector('.skip-link');
    return {
        title: 'Site settings',
        content: [
            group('Search and sharing', [
                textField(state, 'Page title', need(doc, 'title')),
                attrField(
                    state,
                    'Description',
                    meta('meta[name="description"]'),
                    'content',
                    { multiline: true },
                ),
                attrField(
                    state,
                    'Sharing title',
                    meta('meta[property="og:title"]'),
                    'content',
                ),
                attrField(
                    state,
                    'Sharing description',
                    meta('meta[property="og:description"]'),
                    'content',
                    { multiline: true },
                ),
            ]),
            group('Navigation', [
                richField(
                    state,
                    'Your name, top left',
                    need(doc, '.topnav .mark a'),
                    { skip: 'img', hint: 'Enter starts a new line.' },
                ),
                textField(
                    state,
                    'Contact link, top right',
                    need(doc, '.contact-link'),
                ),
                skipLink ? textField(state, 'Skip link', skipLink) : null,
            ]),
            group('Case study buttons', [
                sharedField('Previous', '[data-nav="prev"]'),
                sharedField('Next', '[data-nav="next"]'),
                textField(state, 'Close', need(doc, '.panel-close')),
            ]),
            group(
                'Footer',
                textField(state, 'Footer text', need(doc, 'footer span')),
            ),
        ],
    };
}
