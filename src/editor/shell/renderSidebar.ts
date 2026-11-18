import { archiveEntries } from '../archive/archiveEntries';
import { pageSections } from '../document/pageSections';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { query } from '../util/query';
import { addProject } from '../views/addProject';
import { addSection } from '../views/addSection';
import { sectionView } from '../views/sectionView';
import { go } from './go';

/** Draws the list of views, in the order of the page's sections. */
export function renderSidebar(state: EditorState): void {
    const { doc } = state;
    const item = (view: string, label: string, cls = ''): HTMLElement =>
        h(
            'button',
            {
                type: 'button',
                class: cls,
                'aria-current': state.currentView === view ? 'page' : null,
                onclick: () => {
                    go(state, view);
                },
            },
            h('span', {}, label),
        );
    const action = (
        label: string,
        cls: string,
        run: (state: EditorState) => void,
    ): HTMLElement =>
        h(
            'button',
            {
                type: 'button',
                class: cls,
                onclick: () => {
                    run(state);
                },
            },
            h('span', {}, label),
        );
    const sections = pageSections(doc).flatMap((section) => {
        switch (section.id) {
            case 'work':
                return [
                    item('work', 'Projects'),
                    ...projects(doc).map((project) =>
                        item(
                            `project:${project.id}`,
                            project.title || 'Untitled project',
                            'sub',
                        ),
                    ),
                    action('+ New project', 'add sub', addProject),
                ];
            case 'about':
                return [item('about', 'About'), item('cv', 'CV')];
            case 'contact':
                return [item('contact', 'Contact')];
            default:
                return [item(sectionView(section), section.title)];
        }
    });
    const archived = archiveEntries(doc).length;
    query('#sidebar').replaceChildren(
        item('intro', 'Intro'),
        ...sections,
        action('+ New section', 'add', addSection),
        h('hr', {}),
        item('sections', 'Arrange sections'),
        item(
            'archive',
            archived ? `Archive (${String(archived)})` : 'Archive',
        ),
        item('settings', 'Site settings'),
    );
}
