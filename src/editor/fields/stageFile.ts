import type { EditorState } from '../EditorState';

/** Queues a file for upload on publish, under its path beside the page. */
export async function stageFile(
    state: EditorState,
    file: File,
    path: string,
): Promise<void> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(typeof reader.result === 'string' ? reader.result : '');
        };
        reader.onerror = () => {
            reject(reader.error ?? new Error('The file could not be read.'));
        };
        reader.readAsDataURL(file);
    });
    state.pending[path] = { base64: dataUrl.split(',')[1] ?? '', dataUrl };
    state.previewImages[path] = dataUrl;
}
