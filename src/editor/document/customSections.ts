import { FIXED_SECTION_IDS } from '../constants';

/** The sections added in the editor, beside the ones every page has. */
export function customSections(doc: Document): Element[] {
    return [...doc.querySelectorAll('main > section')].filter(
        (section) => !FIXED_SECTION_IDS.includes(section.id),
    );
}
