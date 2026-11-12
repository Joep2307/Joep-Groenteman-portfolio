/**
 * A node's content as the plain text a field shows: `**bold**`, `*accent*`
 * and a new line for each line break. Elements matching `skip` are left out.
 */
export function toMarkup(node: Node, skip?: string): string {
    let out = '';
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            out += (child.textContent ?? '').replace(/\s+/g, ' ');
        }
        if (!(child instanceof Element)) continue;
        if (skip !== undefined && child.matches(skip)) continue;
        if (child.tagName === 'BR') out += '\n';
        else if (/^(STRONG|B)$/.test(child.tagName)) {
            out += `**${toMarkup(child).trim()}**`;
        } else if (/^(EM|I)$/.test(child.tagName)) {
            out += `*${toMarkup(child).trim()}*`;
        } else out += toMarkup(child);
    }
    return out
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
}
