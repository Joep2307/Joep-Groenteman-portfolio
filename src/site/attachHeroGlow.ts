import {
    GLOW_EASING,
    GLOW_RANGE_X_PX,
    GLOW_RANGE_Y_PX,
    GLOW_SCALE,
} from './constants';
import type { GeometryModule } from './GeometryModule';

/** Eases the hero glow toward the pointer, paused while off-screen. */
export function attachHeroGlow(
    doc: Document,
    view: Window & typeof globalThis,
    geometry: GeometryModule,
): void {
    const glow = doc.querySelector<HTMLElement>('.hero-gradient');
    const intro = doc.getElementById('intro');
    if (!glow || !intro) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame: number | null = null;

    const animate = (): void => {
        currentX = geometry.ease_toward(currentX, targetX, GLOW_EASING);
        currentY = geometry.ease_toward(currentY, targetY, GLOW_EASING);
        const x = String(currentX);
        const y = String(currentY);
        const translate = `translate(${x}px,${y}px)`;
        glow.style.transform = `${translate} scale(${String(GLOW_SCALE)})`;
        frame = view.requestAnimationFrame(animate);
    };

    view.addEventListener('pointermove', (event) => {
        targetX = geometry.glow_target(
            event.clientX,
            view.innerWidth,
            GLOW_RANGE_X_PX,
        );
        targetY = geometry.glow_target(
            event.clientY,
            view.innerHeight,
            GLOW_RANGE_Y_PX,
        );
    });
    view.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
    });

    const observer = new view.IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting && frame === null) {
            frame = view.requestAnimationFrame(animate);
        } else if (!entry?.isIntersecting && frame !== null) {
            view.cancelAnimationFrame(frame);
            frame = null;
        }
    });
    observer.observe(intro);
}
