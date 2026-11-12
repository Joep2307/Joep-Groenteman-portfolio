/**
 * Keeps a freshly drawn preview where `place` puts it. The page goes on
 * growing while its styles and images arrive, and not every browser keeps
 * its place through that, so `place` runs again on each change until the
 * page has loaded or the person using it takes over. `onSettled` runs then.
 */
export function holdScroll(
    page: Document,
    view: Window & typeof globalThis,
    place: () => void,
    onSettled: () => void,
): void {
    const takeovers = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    let settled = false;
    const observer = new view.ResizeObserver(place);
    const settle = (): void => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        for (const type of takeovers) view.removeEventListener(type, settle);
        onSettled();
    };

    place();
    observer.observe(page.documentElement);
    observer.observe(page.body);
    for (const type of takeovers) {
        view.addEventListener(type, settle, { passive: true });
    }
    view.addEventListener(
        'load',
        () => {
            if (!settled) place();
            settle();
        },
        { once: true },
    );
}
