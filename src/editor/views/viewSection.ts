import { PARAGRAPHS_HINT } from '../constants';
import { need } from '../document/need';
import { removeGroup } from '../document/removeGroup';
import { renumberSections } from '../document/renumberSections';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { paragraphList } from '../lists/paragraphList';
import { sectionFields } from '../lists/sectionFields';
import { changed } from '../shell/changed';
import { go } from '../shell/go';
import { clean } from '../util/clean';
import { h } from '../util/h';
import type { ViewContent } from './ViewContent';
import { viewIntro } from './viewIntro';

/** The view for a section added in the editor. */
export function viewSection(state: EditorState, id: string): ViewContent {
    const { doc } = state;
    const section = doc.getElementById(id);
    if (!section) return viewIntro(state);
    const title = clean(need(section, '.section-title').textContent);
    const removeSection = (): void => {
        const sure = confirm(
            'Remove this section? It only disappears from the live site ' +
                'once you publish.',
        );
        if (!sure) return;
        const rail = doc.querySelector(`.rail [data-target="${id}"]`);
        removeGroup({ nodes: rail ? [section, rail] : [section] });
        renumberSections(doc);
        changed(state);
        go(state, 'intro');
    };
    return {
        title: title || 'Untitled section',
        content: [
            group(
                'Section',
                [
                    ...sectionFields(state, id),
                    paragraphList(
                        state,
                        `${id}:paragraphs`,
                        need(section, '.about-bio'),
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
                        class: 'danger',
                        onclick: removeSection,
                    },
                    'Remove this section',
                ),
            ),
        ],
    };
}
