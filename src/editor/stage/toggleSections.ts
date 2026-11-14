import { query } from '../util/query';
import { showSections } from './showSections';

/** Shows the list of every part of the page if it is hidden, or hides it. */
export function toggleSections(): void {
    showSections(query('#sidebar').hidden !== false);
}
