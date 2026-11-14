/**
 * Marks the field a click on the page led to, so it is clear which one
 * it is even when focus does not show.
 */
export function markTarget(input: HTMLElement | null): void {
    document.querySelectorAll('.is-target').forEach((el) => {
        el.classList.remove('is-target');
    });
    input?.closest('.field, .image-field')?.classList.add('is-target');
}
