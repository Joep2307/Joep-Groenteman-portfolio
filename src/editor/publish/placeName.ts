import { projects } from '../document/projects';
import { clean } from '../util/clean';
import { viewForNode } from './viewForNode';

/** What to call the part of the page an element is in. */
export function placeName(doc: Document, el: Element): string {
    const view = viewForNode(doc, el);
    const [kind, id = ''] = view.split(':');
    if (kind === 'project') {
        const project = projects(doc).find((p) => p.id === id);
        return project?.title || 'Untitled project';
    }
    if (kind === 'cv') return 'CV';
    if (kind === 'section') {
        const title = doc.getElementById(id)?.querySelector('.section-title');
        return clean(title?.textContent);
    }
    return view.charAt(0).toUpperCase() + view.slice(1);
}
