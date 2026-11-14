import {
    SHAPE_DRIFT_PX,
    SHAPE_EASING,
    SHAPE_REPEL_MAX_PX,
    SHAPE_REPEL_REACH_PX,
} from './constants';
import type { GeometryModule } from './GeometryModule';
import type { ShapeState } from './ShapeState';

/**
 * Drifts the decorative shapes with the pointer, each by its own depth,
 * and nudges a shape aside when the pointer comes close. Paused while no
 * group of shapes is on screen.
 */
export function attachShapes(
    doc: Document,
    view: Window & typeof globalThis,
    geometry: GeometryModule,
): void {
    const groups = doc.querySelectorAll<HTMLElement>('.shapes');
    const shapes = [
        ...doc.querySelectorAll<HTMLElement>('.shapes .shape'),
    ].map((el): ShapeState => {
        const depth = Number(el.getAttribute('data-depth')) || 1;
        return { el, depth, x: 0, y: 0, targetX: 0, targetY: 0 };
    });
    if (shapes.length === 0) return;

    const onScreen = new Set<Element>();
    let frame: number | null = null;

    const animate = (): void => {
        for (const shape of shapes) {
            const { el, targetX, targetY } = shape;
            shape.x = geometry.ease_toward(shape.x, targetX, SHAPE_EASING);
            shape.y = geometry.ease_toward(shape.y, targetY, SHAPE_EASING);
            const x = shape.x.toFixed(2);
            const y = shape.y.toFixed(2);
            el.style.translate = `${x}px ${y}px`;
        }
        frame = view.requestAnimationFrame(animate);
    };

    view.addEventListener('pointermove', (event) => {
        if (frame === null) return;
        const { clientX, clientY } = event;
        for (const shape of shapes) {
            const rect = shape.el.getBoundingClientRect();
            // The centre the shape rests at, without its current offset.
            const awayX = rect.left + rect.width / 2 - shape.x - clientX;
            const awayY = rect.top + rect.height / 2 - shape.y - clientY;
            const drift = SHAPE_DRIFT_PX * shape.depth;
            shape.targetX =
                geometry.parallax_offset(clientX, view.innerWidth, drift) +
                geometry.repel_offset(
                    awayX,
                    awayY,
                    SHAPE_REPEL_REACH_PX,
                    SHAPE_REPEL_MAX_PX,
                );
            shape.targetY =
                geometry.parallax_offset(clientY, view.innerHeight, drift) +
                geometry.repel_offset(
                    awayY,
                    awayX,
                    SHAPE_REPEL_REACH_PX,
                    SHAPE_REPEL_MAX_PX,
                );
        }
    });
    doc.documentElement.addEventListener('pointerleave', () => {
        for (const shape of shapes) {
            shape.targetX = 0;
            shape.targetY = 0;
        }
    });

    const observer = new view.IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) onScreen.add(entry.target);
            else onScreen.delete(entry.target);
        }
        if (onScreen.size > 0 && frame === null) {
            frame = view.requestAnimationFrame(animate);
        } else if (onScreen.size === 0 && frame !== null) {
            view.cancelAnimationFrame(frame);
            frame = null;
        }
    });
    groups.forEach((group) => {
        observer.observe(group);
    });
}
