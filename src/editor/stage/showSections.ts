import { query } from '../util/query';

/** Shows or hides the list of every part of the page in the panel. */
export function showSections(show: boolean): void {
    query('#sidebar').hidden = !show;
    query('#sections-toggle').setAttribute('aria-expanded', String(show));
    query('#sections-btn').setAttribute('aria-expanded', String(show));
}
