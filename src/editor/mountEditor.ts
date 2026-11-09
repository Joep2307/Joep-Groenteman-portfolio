import { createEditorState } from './createEditorState';
import { start } from './screens/start';

/** Starts the editor in the current page. */
export function mountEditor(): void {
    void start(createEditorState());
}
