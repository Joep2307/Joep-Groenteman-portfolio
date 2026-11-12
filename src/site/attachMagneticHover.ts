import {
    MAGNETIC_FACTOR_X,
    MAGNETIC_FACTOR_Y,
    MAGNETIC_SELECTOR,
} from './constants';
import type { GeometryModule } from './GeometryModule';

/** Pulls key links and buttons slightly toward the pointer. */
export function attachMagneticHover(
    doc: Document,
    geometry: GeometryModule,
): void {
    doc.querySelectorAll<HTMLElement>(MAGNETIC_SELECTOR).forEach((el) => {
        el.addEventListener('pointermove', (event) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = geometry
                .magnetic_offset(event.clientX, left, width, MAGNETIC_FACTOR_X)
                .toFixed(2);
            const y = geometry
                .magnetic_offset(event.clientY, top, height, MAGNETIC_FACTOR_Y)
                .toFixed(2);
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener('pointerleave', () => {
            el.style.transform = '';
        });
    });
}
