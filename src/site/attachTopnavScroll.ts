/** Hides the name next to the logo once the page has scrolled. */
export function attachTopnavScroll(doc: Document): void {
    const topnav = doc.querySelector('.topnav');
    if (!topnav) return;
    const update = (): void => {
        const scrolled = doc.documentElement.scrollTop > 0;
        topnav.classList.toggle('scrolled', scrolled);
    };
    doc.addEventListener('scroll', update, { passive: true });
    update();
}
