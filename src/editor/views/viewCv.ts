import { CV_ENTRY_HTML } from '../constants';
import { addNode } from '../document/addNode';
import { cvPanel } from '../document/cvPanel';
import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { tagsField } from '../fields/tagsField';
import { textField } from '../fields/textField';
import { blocksEditor } from './blocksEditor';
import type { ViewContent } from './ViewContent';
import { viewIntro } from './viewIntro';

export function viewCv(state: EditorState): ViewContent {
    const panel = cvPanel(state.doc);
    if (!panel) return viewIntro(state);
    const download = need(panel, '.cv-btn');
    const target = { open: panel.id };
    const header = group(
        'Header',
        [
            textField(state, 'Small label', need(panel, '.panel-index')),
            textField(state, 'Title', need(panel, '.panel-title')),
            tagsField(state, 'Tags', need(panel, '.panel-tags')),
            textField(state, 'Download button text', download),
        ],
        target,
    );
    const sections = group(
        'Sections',
        blocksEditor(
            state,
            'cv',
            panel,
            download.closest('.panel-block'),
            (block) => [
                {
                    label: 'Add entry',
                    run: () => {
                        addNode(block, CV_ENTRY_HTML);
                    },
                },
                {
                    label: 'Add paragraph',
                    run: () => {
                        addNode(block, '<p></p>');
                    },
                },
            ],
        ),
        target,
    );
    return { title: 'CV', content: [header, sections] };
}
