import { cvPanel } from '../document/cvPanel';
import { customSections } from '../document/customSections';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { clean } from '../util/clean';
import type { EditTarget } from './EditTarget';

/**
 * Every part of the page that can be clicked to edit it. A case card and
 * its case study sit inside the work section and win over it, because
 * the innermost target is the one that counts.
 */
export function editTargets(state: EditorState): EditTarget[] {
    const { doc } = state;
    const cv = cvPanel(doc);
    return [
        { selector: '.topnav', view: 'settings', label: 'Edit navigation' },
        { selector: '#intro', view: 'intro', label: 'Edit intro' },
        { selector: '#work', view: 'work', label: 'Edit projects' },
        ...projects(doc).flatMap(({ id, card, title }) => {
            const view = `project:${id}`;
            const label = `Edit ${title || 'project'}`;
            return [
                { selector: `#${card.id}`, view, label },
                { selector: `#${id}`, view, label },
            ];
        }),
        { selector: '#about', view: 'about', label: 'Edit about' },
        ...(cv
            ? [{ selector: `#${cv.id}`, view: 'cv', label: 'Edit CV' }]
            : []),
        ...customSections(doc).map((section) => ({
            selector: `#${section.id}`,
            view: `section:${section.id}`,
            label: `Edit ${
                clean(section.querySelector('.section-title')?.textContent) ||
                'section'
            }`,
        })),
        { selector: '#contact', view: 'contact', label: 'Edit contact' },
        { selector: 'footer', view: 'settings', label: 'Edit footer' },
    ];
}
