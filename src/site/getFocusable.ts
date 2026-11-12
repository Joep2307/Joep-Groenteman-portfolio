import { FOCUSABLE_SELECTOR } from './constants';

export function getFocusable(container: Element): HTMLElement[] {
    return [
        ...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ].filter(
        (el) => !el.hasAttribute('hidden') && el.getClientRects().length > 0,
    );
}
