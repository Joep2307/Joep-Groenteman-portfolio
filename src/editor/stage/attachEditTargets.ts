import { PAGE_CONTROLS } from '../constants';
import type { EditorState } from '../EditorState';
import { editTargetOf } from './editTargetOf';
import { editTargets } from './editTargets';
import { nodeOf } from './nodeOf';
import { openFromPage } from './openFromPage';

/**
 * Makes the page in the frame editable by clicking: each part is outlined
 * with a label while the pointer is over it, and a click, or Enter on a
 * link, opens it in the edit panel instead of doing what it does on the
 * site.
 */
export function attachEditTargets(
    state: EditorState,
    page: Document,
    view: Window & typeof globalThis,
): void {
    for (const { selector, view: name, label } of editTargets(state)) {
        const el = page.querySelector(selector);
        el?.setAttribute('data-edit', name);
        el?.setAttribute('data-edit-label', label);
    }

    const tag = page.createElement('div');
    tag.className = 'edit-hover-label';
    tag.setAttribute('aria-hidden', 'true');
    tag.hidden = true;
    page.body.append(tag);

    let current: Element | null = null;
    const place = (): void => {
        if (!current) return;
        const box = current.getBoundingClientRect();
        tag.style.top = `${String(Math.max(box.top, 0) + 8)}px`;
        tag.style.left = `${String(Math.max(box.left, 0) + 8)}px`;
    };
    const hover = (el: Element | null): void => {
        if (el === current) return;
        current?.classList.remove('is-edit-hover');
        current = el;
        tag.hidden = !el;
        if (!el) return;
        el.classList.add('is-edit-hover');
        tag.textContent = el.getAttribute('data-edit-label');
        place();
    };
    const targetIn = (event: Event): Element | null =>
        event.target instanceof view.Element ? event.target : null;

    page.addEventListener('pointerover', (event) => {
        const el = targetIn(event);
        hover(el?.closest('[data-edit]') ?? null);
    });
    page.documentElement.addEventListener('pointerleave', () => {
        hover(null);
    });
    page.addEventListener('scroll', place, { capture: true, passive: true });

    // On the window, in the capture phase, so it runs before the site's
    // own handlers and can stop them.
    view.addEventListener(
        'click',
        (event) => {
            const el = targetIn(event);
            if (!el || el.closest(PAGE_CONTROLS)) return;
            event.preventDefault();
            event.stopPropagation();
            const name = editTargetOf(el);
            if (name) openFromPage(state, name, nodeOf(state, el));
        },
        { capture: true },
    );
}
