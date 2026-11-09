import { CASE_REVEAL_THRESHOLD } from './constants';

/** Reveals each case the first time it scrolls into view. */
export function observeCaseReveal(
    doc: Document,
    view: Window & typeof globalThis,
): void {
    const observer = new view.IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        },
        { threshold: CASE_REVEAL_THRESHOLD },
    );
    doc.querySelectorAll('.case').forEach((item) => {
        observer.observe(item);
    });
}
