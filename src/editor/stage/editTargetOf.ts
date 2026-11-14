/** The view the innermost edit target around an element opens, if any. */
export function editTargetOf(el: Element): string | null {
    return el.closest('[data-edit]')?.getAttribute('data-edit') ?? null;
}
