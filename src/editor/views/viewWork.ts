import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { group } from '../fields/group';
import { listEditor } from '../lists/listEditor';
import { sectionFields } from '../lists/sectionFields';
import { go } from '../shell/go';
import { h } from '../util/h';
import { addProject } from './addProject';
import { removeProject } from './removeProject';
import { swapProjects } from './swapProjects';
import type { ViewContent } from './ViewContent';

export function viewWork(state: EditorState): ViewContent {
    const { doc } = state;
    const list = listEditor(state, {
        key: 'projects',
        name: 'project',
        items: projects(doc),
        rowClass: 'project-row',
        swap: (items, a, b) => {
            swapProjects(doc, items, a, b);
        },
        remove: (project) => {
            removeProject(doc, project);
        },
        confirmRemove: (project) =>
            `Remove “${project.title}” and its case study? It only ` +
            'disappears from the live site once you publish.',
        render: (project) =>
            h(
                'button',
                {
                    type: 'button',
                    class: 'project-open',
                    onclick: () => {
                        go(state, `project:${project.id}`);
                    },
                },
                project.title || 'Untitled project',
            ),
    });
    const add = h(
        'button',
        {
            type: 'button',
            onclick: () => {
                addProject(state);
            },
        },
        '+ Add project',
    );
    return {
        title: 'Projects',
        content: [
            group('Section', sectionFields(state, 'work')),
            group('Your projects', list),
            h('div', { class: 'adds' }, add),
        ],
    };
}
