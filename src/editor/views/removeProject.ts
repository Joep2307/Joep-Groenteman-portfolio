import type { Project } from '../document/Project';
import { removeGroup } from '../document/removeGroup';
import { renumberCases } from '../document/renumberCases';

/** Removes a project's card and its case study. */
export function removeProject(doc: Document, project: Project): void {
    removeGroup({ nodes: [project.card, project.panel] });
    renumberCases(doc);
}
