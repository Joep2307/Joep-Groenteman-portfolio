import { RAIL_ROOT_MARGIN } from './constants';

/** Marks the rail item of the section currently in view. */
export function observeRail(
    doc: Document,
    view: Window & typeof globalThis,
): void {
    const items = doc.querySelectorAll('.rail-item');
    const observer = new view.IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const item = doc.querySelector(
                    `.rail-item[data-target="${entry.target.id}"]`,
                );
                if (!item || !entry.isIntersecting) continue;
                items.forEach((other) => {
                    other.classList.remove('active');
                    other.removeAttribute('aria-current');
                });
                item.classList.add('active');
                item.setAttribute('aria-current', 'location');
            }
        },
        { rootMargin: RAIL_ROOT_MARGIN },
    );
    doc.querySelectorAll('main section').forEach((section) => {
        observer.observe(section);
    });
}
