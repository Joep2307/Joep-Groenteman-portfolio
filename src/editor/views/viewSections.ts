import { archiveSection } from '../archive/archiveSection';
import { pageSections } from '../document/pageSections';
import { removeSection } from '../document/removeSection';
import { swapSections } from '../document/swapSections';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { listEditor } from '../lists/listEditor';
import { go } from '../shell/go';
import { h } from '../util/h';
import { addSection } from './addSection';
import { sectionView } from './sectionView';
import type { ViewContent } from './ViewContent';

/** Every section of the page in order, to rearrange in one place. */
export function viewSections(state: EditorState): ViewContent {
    const { doc } = state;
    const list = listEditor(state, {
        key: 'sections',
        name: 'section',
        items: pageSections(doc),
        rowClass: 'project-row',
        swap: (items, a, b) => {
            swapSections(doc, items, a, b);
        },
        remove: (item) => {
            removeSection(doc, item);
        },
        confirmRemove: (item) =>
            `Remove “${item.title}”? It only disappears from the live ` +
            'site once you publish. To keep it for later, archive it ' +
            'instead.',
        archive: (item) => {
            archiveSection(state, item);
        },
        render: (item) =>
            h(
                'button',
                {
                    type: 'button',
                    class: 'project-open',
                    onclick: () => {
                        go(state, sectionView(item));
                    },
                },
                item.title,
            ),
    });
    const add = h(
        'button',
        {
            type: 'button',
            onclick: () => {
                addSection(state);
            },
        },
        '+ New section',
    );
    return {
        title: 'Arrange sections',
        content: [
            h(
                'p',
                { class: 'hint before-list' },
                'Drag a section by its handle, or move it with the arrows. ' +
                    'The navigation and the section numbers follow. Intro ' +
                    'always stays at the top. Projects, About and Contact ' +
                    'can move but not go.',
            ),
            group('Sections, top to bottom', list),
            h('div', { class: 'adds' }, add),
        ],
    };
}
