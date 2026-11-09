import type { GeometryModule } from './GeometryModule';

/** Keeps the progress bar at the top in step with the page scroll. */
export function attachScrollProgress(
    doc: Document,
    geometry: GeometryModule,
): void {
    const progress = doc.getElementById('progress');
    if (!progress) return;
    const root = doc.documentElement;
    const update = (): void => {
        const percent = geometry.scroll_progress(
            root.scrollTop,
            root.scrollHeight - root.clientHeight,
        );
        progress.style.width = `${String(percent)}%`;
    };
    doc.addEventListener('scroll', update, { passive: true });
    update();
}
