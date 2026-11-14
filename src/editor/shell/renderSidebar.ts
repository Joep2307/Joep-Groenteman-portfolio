import { customSections } from '../document/customSections';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { getPassword } from '../github/getPassword';
import { connect } from '../publish/connect';
import { disconnect } from '../publish/disconnect';
import { clean } from '../util/clean';
import { h } from '../util/h';
import { query } from '../util/query';
import { addProject } from '../views/addProject';
import { addSection } from '../views/addSection';
import { go } from './go';

/** Draws the list of views, following the page's projects and sections. */
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
    query('#sidebar').replaceChildren(
        item('intro', 'Intro'),
        item('work', 'Projects'),
        ...projects(doc).map((project) =>
            item(
                `project:${project.id}`,
                project.title || 'Untitled project',
                'sub',
            ),
        ),
        action('+ New project', 'add sub', addProject),
        item('about', 'About'),
        item('cv', 'CV'),
        ...customSections(doc).map((section) =>
            item(
                `section:${section.id}`,
                clean(section.querySelector('.section-title')?.textContent) ||
                    'Untitled section',
            ),
        ),
        item('contact', 'Contact'),
        action('+ New section', 'add', addSection),
        item('settings', 'Site settings'),
        h('div', { class: 'spacer' }),
        getPassword()
            ? action('Disconnect', 'disconnect', disconnect)
            : action('Connect', 'disconnect', connect),
    );
}
