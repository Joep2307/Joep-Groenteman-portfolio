import { ARCHIVE_ID } from '../constants';
import { addNode } from '../document/addNode';

/**
 * The template archived parts are kept in, added at the end of the page
 * when `create` is set and there is none yet.
 */
export function archiveTemplate(
    doc: Document,
    create = false,
): HTMLTemplateElement | null {
    const found = doc.getElementById(ARCHIVE_ID);
    if (found?.tagName === 'TEMPLATE') return found as HTMLTemplateElement;
    if (!create) return null;
    return addNode(
        doc.body,
        `<template id="${ARCHIVE_ID}"></template>`,
        doc.querySelector('body > script'),
    ) as HTMLTemplateElement;
}
