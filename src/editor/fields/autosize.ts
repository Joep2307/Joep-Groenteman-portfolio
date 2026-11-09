/** Makes a textarea as tall as its text. */
export function autosize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${String(textarea.scrollHeight + 2)}px`;
}
