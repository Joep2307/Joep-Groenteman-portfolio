/** The page as the file that gets published. */
export function serialize(doc: Document): string {
    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
}
