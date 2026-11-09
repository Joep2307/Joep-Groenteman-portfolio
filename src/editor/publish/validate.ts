import { IMAGE_PREFIX } from '../constants';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { clean } from '../util/clean';
import { placeName } from './placeName';
import type { Problem } from './Problem';
import { viewForNode } from './viewForNode';

/** What has to be fixed so nothing broken or inaccessible goes live. */
export function validate(state: EditorState): Problem[] {
    const { doc, knownImages } = state;
    const problems: Problem[] = [];
    const problem = (el: Element, text: string): void => {
        problems.push({
            view: viewForNode(doc, el),
            text: `${placeName(doc, el)}: ${text}`,
        });
    };
    doc.querySelectorAll('main img, #overlay img').forEach((img) => {
        const src = img.getAttribute('src');
        if (!src) problem(img, 'an image still needs a file.');
        else if (src.startsWith(IMAGE_PREFIX) && !knownImages.includes(src)) {
            problem(img, `${src} doesn't exist.`);
        }
        if (!clean(img.getAttribute('alt'))) {
            problem(img, 'an image still needs alt text.');
        }
    });
    for (const project of projects(doc)) {
        if (!project.title || project.title === 'New project') {
            problem(project.card, 'give the project a title.');
        }
        const desc = project.card.querySelector('.case-desc');
        if (!clean(desc?.textContent)) {
            problem(project.card, 'add a short description.');
        }
    }
    doc.querySelectorAll('.panel-block p, .about-bio p').forEach((p) => {
        if (!clean(p.textContent)) {
            problem(p, 'there is an empty paragraph to fill in or remove.');
        }
    });
    doc.querySelectorAll('.panel-block h4').forEach((heading) => {
        if (!clean(heading.textContent)) {
            problem(heading, 'a section still needs a heading.');
        }
    });
    return problems;
}
