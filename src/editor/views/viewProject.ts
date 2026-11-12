import { addNode } from '../document/addNode';
import { need } from '../document/need';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { caseLabelField } from '../fields/caseLabelField';
import { field } from '../fields/field';
import { group } from '../fields/group';
import { imageField } from '../fields/imageField';
import { richField } from '../fields/richField';
import { tagsField } from '../fields/tagsField';
import { textField } from '../fields/textField';
import { go } from '../shell/go';
import { h } from '../util/h';
import { blocksEditor } from './blocksEditor';
import type { ViewContent } from './ViewContent';
import { viewWork } from './viewWork';

export function viewProject(state: EditorState, id: string): ViewContent {
    const project = projects(state.doc).find((p) => p.id === id);
    if (!project) return viewWork(state);
    const { card, panel } = project;

    const back = h(
        'button',
        {
            type: 'button',
            onclick: () => {
                go(state, 'work');
            },
        },
        '← All projects',
    );
    const titleField = field(
        state,
        'Project title',
        project.title,
        (value) => {
            need(card, '.case-title').textContent = value;
            need(panel, '.panel-title').textContent = value;
        },
    );
    const cardGroup = group(
        'Homepage card',
        [
            caseLabelField(state, 'Label', need(card, '.case-index')),
            richField(state, 'Short description', need(card, '.case-desc')),
            tagsField(state, 'Tags', need(card, '.case-tags')),
            imageField(state, 'Card image', need(card, '.case-media img')),
            textField(state, 'Link text', need(card, '.case-link')),
        ],
        { scroll: `#${card.id}` },
    );
    const study = group(
        'Case study',
        [
            caseLabelField(state, 'Label', need(panel, '.panel-index')),
            tagsField(state, 'Tags', need(panel, '.panel-tags')),
            imageField(state, 'Main image', need(panel, '.panel-media img')),
            h(
                'p',
                { class: 'hint before-sections' },
                'In paragraphs, **double asterisks** make text bold.',
            ),
            blocksEditor(
                state,
                `${id}:blocks`,
                panel,
                panel.querySelector('.panel-nav'),
                (block) => [
                    {
                        label: 'Add paragraph',
                        run: () => {
                            addNode(block, '<p></p>');
                        },
                    },
                    {
                        label: 'Add image',
                        run: () => {
                            addNode(
                                block,
                                '<img src="" alt="" loading="lazy">',
                            );
                        },
                    },
                ],
            ),
        ],
        { open: id },
    );
    return {
        title: project.title || 'Untitled project',
        content: [
            h('div', { class: 'adds' }, back),
            group('Project', titleField),
            cardGroup,
            study,
        ],
    };
}
