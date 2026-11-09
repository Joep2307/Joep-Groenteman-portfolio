import { addNode } from '../document/addNode';
import { cvPanel } from '../document/cvPanel';
import { need } from '../document/need';
import { nextNumber } from '../document/nextNumber';
import { projects } from '../document/projects';
import type { EditorState } from '../EditorState';
import { changed } from '../shell/changed';
import { go } from '../shell/go';
import { projectCardHtml } from '../templates/projectCardHtml';
import { projectPanelHtml } from '../templates/projectPanelHtml';
import { clean } from '../util/clean';
import { pad } from '../util/pad';

/** Adds an empty project after the others and opens it for editing. */
export function addProject(state: EditorState): void {
    const { doc } = state;
    const n = nextNumber(doc, 'panel-');
    const navLabel = (nav: string, fallback: string): string =>
        clean(
            doc.querySelector(`.panel-nav [data-nav="${nav}"]`)?.textContent ||
                fallback,
        );
    const caseNum = `CASE ${pad(projects(doc).length + 1)}`;
    addNode(need(doc, '.cases'), projectCardHtml(n, caseNum));
    addNode(
        need(doc, '#overlay'),
        projectPanelHtml(
            n,
            caseNum,
            navLabel('prev', '← Previous'),
            navLabel('next', 'Next →'),
        ),
        cvPanel(doc),
    );
    changed(state);
    go(state, `project:panel-${n}`);
    document.querySelector<HTMLInputElement>('#editor input')?.select();
}
