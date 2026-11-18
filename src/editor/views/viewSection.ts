import { archiveSection } from '../archive/archiveSection';
import { PARAGRAPHS_HINT } from '../constants';
import { need } from '../document/need';
import { pageSections } from '../document/pageSections';
import { removeSection } from '../document/removeSection';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { paragraphList } from '../lists/paragraphList';
import { sectionFields } from '../lists/sectionFields';
import { changed } from '../shell/changed';
import { go } from '../shell/go';
import { h } from '../util/h';
import type { ViewContent } from './ViewContent';
import { viewIntro } from './viewIntro';

/** The view for a section added in the editor. */
export function viewSection(state: EditorState, id: string): ViewContent {
    const { doc } = state;
    const item = pageSections(doc).find((s) => s.id === id);
    if (!item) return viewIntro(state);
    const leave = (): void => {
        changed(state);
        go(state, 'sections');
    };
    const remove = (): void => {
        const sure = confirm(
            'Remove this section? It only disappears from the live site ' +
                'once you publish. To keep it for later, archive it instead.',
        );
        if (!sure) return;
        removeSection(doc, item);
        leave();
    };
    return {
        title: item.title,
        content: [
            group(
                'Section',
                [
                    ...sectionFields(state, id),
                    paragraphList(
                        state,
                        `${id}:paragraphs`,
                        need(item.section, '.about-bio'),
                        null,
                        PARAGRAPHS_HINT,
                    ),
                ],
                { scroll: `#${id}` },
            ),
            h(
                'div',
                { class: 'adds' },
                h(
                    'button',
                    {
                        type: 'button',
                        onclick: () => {
                            archiveSection(state, item);
                            leave();
                        },
                    },
                    'Archive this section',
                ),
                h(
                    'button',
                    { type: 'button', class: 'danger', onclick: remove },
                    'Remove this section',
                ),
            ),
        ],
    };
}
