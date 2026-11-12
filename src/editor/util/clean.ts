/** Text with its whitespace collapsed, as it reads on the page. */
export function clean(text: string | null | undefined): string {
    return (text ?? '').replace(/\s+/g, ' ').trim();
}
