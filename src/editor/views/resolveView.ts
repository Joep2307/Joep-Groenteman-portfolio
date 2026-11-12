import { cvPanel } from '../document/cvPanel';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import type { ResolvedView } from './ResolvedView';
import { viewAbout } from './viewAbout';
import { viewContact } from './viewContact';
import { viewCv } from './viewCv';
import { viewIntro } from './viewIntro';
import { viewProject } from './viewProject';
import { viewSection } from './viewSection';
import { viewSettings } from './viewSettings';
import { viewWork } from './viewWork';

/**
 * The view a name such as `work`, `project:panel-01` or `section:section-05`
 * stands for, or `undefined` if the page has nothing by that name.
 */
export function resolveView(
    state: EditorState,
    view: string,
): ResolvedView | undefined {
    const { doc } = state;
    const [kind = '', id = ''] = view.split(':');
    const exists = doc.getElementById(id) !== null;
    if (kind === 'project' && exists) {
        const project = projects(doc).find((p) => p.id === id);
        return {
            render: () => viewProject(state, id),
            target: { scroll: `#${project?.card.id ?? 'work'}` },
        };
    }
    if (kind === 'section' && exists) {
        return {
            render: () => viewSection(state, id),
            target: { scroll: `#${id}` },
        };
    }
    const cv = cvPanel(doc);
    switch (kind) {
        case 'cv':
            return cv
                ? { render: () => viewCv(state), target: { open: cv.id } }
                : undefined;
        case 'intro':
            return {
                render: () => viewIntro(state),
                target: { scroll: '#intro' },
            };
        case 'work':
            return {
                render: () => viewWork(state),
                target: { scroll: '#work' },
            };
        case 'about':
            return {
                render: () => viewAbout(state),
                target: { scroll: '#about' },
            };
        case 'contact':
            return {
                render: () => viewContact(state),
                target: { scroll: '#contact' },
            };
        case 'settings':
            return {
                render: () => viewSettings(state),
                target: { scroll: '#intro' },
            };
        default:
            return undefined;
    }
}
