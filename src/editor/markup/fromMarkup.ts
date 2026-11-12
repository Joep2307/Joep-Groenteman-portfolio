import { escapeHtml } from '../util/escapeHtml';

/** The HTML for a field's plain text; the reverse of `toMarkup`. */
export function fromMarkup(text: string): string {
    return escapeHtml(text.trim())
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}
