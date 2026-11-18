/** The parts of an archived entry, one for each element it holds. */
export function entryParts(entry: Element): HTMLElement[] {
    return [...entry.children].filter(
        (el): el is HTMLElement =>
            el.hasAttribute('data-home') && 'dataset' in el,
    );
}
