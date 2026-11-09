import { PARAGRAPHS_HINT } from '../constants';
import { addNode } from '../document/addNode';
import { need } from '../document/need';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { nextFieldId } from '../fields/nextFieldId';
import { stageFile } from '../fields/stageFile';
import { textField } from '../fields/textField';
import { listEditor } from '../lists/listEditor';
import { paragraphList } from '../lists/paragraphList';
import { sectionFields } from '../lists/sectionFields';
import { toItems } from '../lists/toItems';
import { changed } from '../shell/changed';
import { notify } from '../shell/notify';
import { h } from '../util/h';
import type { ViewContent } from './ViewContent';

export function viewAbout(state: EditorState): ViewContent {
    const { doc } = state;
    const bio = need(doc, '.about-bio');
    const viewLink = need(bio, '[data-open]');
    const skills = need(doc, '.skills-list');
    const cvLink = need(bio, '.cv-btn');
    const cvCount = doc.querySelectorAll('.cv-btn').length;
    const cvPath = cvLink.getAttribute('href') ?? '';

    const fileId = nextFieldId(state);
    const fileInput = h('input', {
        type: 'file',
        id: fileId,
        accept: 'application/pdf',
    });
    const addCv = async (): Promise<void> => {
        const file = fileInput.files?.[0];
        if (!file) return;
        await stageFile(state, file, cvPath);
        changed(state);
        notify(state, `New CV ready. It replaces ${cvPath} when you publish.`);
    };
    fileInput.addEventListener('change', () => {
        void addCv();
    });

    const cvButtons = group('CV buttons', [
        h(
            'div',
            { class: 'two-up' },
            textField(state, 'Download button text', cvLink),
            textField(state, 'View button text', viewLink),
        ),
        h('p', { class: 'field-label' }, 'CV file'),
        h(
            'p',
            { class: 'hint before-upload' },
            `Replaces ${cvPath}, used by ${String(cvCount)} download buttons.`,
        ),
        h(
            'div',
            { class: 'upload' },
            fileInput,
            h('label', { for: fileId, class: 'btn' }, 'Upload new CV (PDF)'),
        ),
    ]);
    const skillRows = listEditor(state, {
        key: 'skills',
        name: 'skills row',
        items: toItems(skills.children),
        render: ({ nodes: [row] }) => {
            const [name, detail] = row.children;
            if (!name) return null;
            if (row.classList.contains('skills-heading')) {
                return textField(state, 'Group heading', name);
            }
            if (!detail) return textField(state, 'Skill', name);
            return h(
                'div',
                { class: 'two-up' },
                textField(state, 'Skill', name),
                textField(state, 'Details', detail),
            );
        },
        adds: [
            {
                label: 'Add skill',
                run: () => {
                    addNode(skills, '<li><span></span><span></span></li>');
                },
            },
            {
                label: 'Add group heading',
                run: () => {
                    addNode(
                        skills,
                        '<li class="skills-heading">' +
                            '<span></span><span></span></li>',
                    );
                },
            },
        ],
    });
    return {
        title: 'About',
        content: [
            group('Section', sectionFields(state, 'about')),
            group(
                'Bio',
                paragraphList(
                    state,
                    'bio',
                    bio,
                    viewLink.parentElement,
                    PARAGRAPHS_HINT,
                ),
            ),
            cvButtons,
            group('Skills', skillRows),
        ],
    };
}
