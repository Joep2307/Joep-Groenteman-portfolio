import { TILT_MAX_DEGREES, TILT_PERSPECTIVE_PX } from './constants';
import type { GeometryModule } from './GeometryModule';

/** Tilts each case image slightly toward the pointer. */
export function attachCaseTilt(doc: Document, geometry: GeometryModule): void {
    const perspective = `perspective(${String(TILT_PERSPECTIVE_PX)}px)`;
    doc.querySelectorAll<HTMLElement>('.case-media').forEach((media) => {
        media.addEventListener('pointermove', (event) => {
            const { left, top, width, height } = media.getBoundingClientRect();
            const x = geometry
                .tilt(event.clientY, top, height, -TILT_MAX_DEGREES)
                .toFixed(2);
            const y = geometry
                .tilt(event.clientX, left, width, TILT_MAX_DEGREES)
                .toFixed(2);
            const rotate = `rotateX(${x}deg) rotateY(${y}deg)`;
            media.style.transform = `${perspective} ${rotate}`;
        });
        media.addEventListener('pointerleave', () => {
            media.style.transform = '';
        });
    });
}
