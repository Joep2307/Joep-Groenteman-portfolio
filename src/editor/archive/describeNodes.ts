import { ARCHIVE_TITLE_LENGTH } from '../constants';
import { clean } from '../util/clean';
import { textOf } from './textOf';

/** A short line that says what a part of the page is: its text, or alt. */
export function describeNodes(nodes: readonly Element[]): string {
    const text = clean(nodes.map(textOf).join(' '));
    const alt = nodes
        .map((el) => (el.tagName === 'IMG' ? el : el.querySelector('img')))
        .map((img) => clean(img?.getAttribute('alt')))
        .find((value) => value !== '');
    const line = text || alt || 'Empty';
    return line.length > ARCHIVE_TITLE_LENGTH
        ? `${line.slice(0, ARCHIVE_TITLE_LENGTH - 1).trimEnd()}…`
        : line;
}
