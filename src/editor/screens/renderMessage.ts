import type { ElementChild } from '../util/ElementChild';
import { h } from '../util/h';
import { query } from '../util/query';

/** Fills the page with a heading, some lines and at most one action. */
export function renderMessage(
    title: string,
    lines: readonly ElementChild[],
    action?: HTMLElement,
): void {
    query('#app').replaceChildren(
        h('main', { class: 'center-page' }, h('h1', {}, title), lines, action),
    );
}
