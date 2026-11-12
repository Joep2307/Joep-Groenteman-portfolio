import { getFocusable } from './getFocusable';
import type { PanelState } from './PanelState';

/** Keeps a Tab press inside the overlay, wrapping at either end. */
export function trapFocus(state: PanelState, event: KeyboardEvent): void {
    const focusable = getFocusable(state.overlay);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
        event.preventDefault();
        state.activePanel?.focus();
    } else if (event.shiftKey && state.doc.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && state.doc.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}
