import { describe, expect, it } from 'vitest';
import { loadGeometry } from '../site/loadGeometry';

async function geometry() {
    const module = await loadGeometry();
    if (!module) throw new Error('the wasm build did not load');
    return module;
}

describe('geometry bindings', () => {
    it('tilts from -max to max across a rect', async () => {
        const { tilt } = await geometry();

        expect(tilt(100, 100, 100, 3)).toBe(-1.5);
        expect(tilt(150, 100, 100, 3)).toBe(0);
        expect(tilt(200, 100, 100, 3)).toBe(1.5);
        expect(tilt(5, 5, 0, 3)).toBe(0);
    });

    it('pulls toward the pointer by a fraction of its distance', async () => {
        const { magnetic_offset } = await geometry();

        expect(magnetic_offset(150, 100, 100, 0.5)).toBe(0);
        expect(magnetic_offset(200, 100, 100, 0.5)).toBe(25);
        expect(magnetic_offset(100, 100, 100, 0.5)).toBe(-25);
    });

    it('spreads the glow over its range, even with no viewport', async () => {
        const { glow_target } = await geometry();

        expect(glow_target(0, 1000, 420)).toBe(-210);
        expect(glow_target(500, 1000, 420)).toBe(0);
        expect(glow_target(1000, 1000, 420)).toBe(210);
        expect(glow_target(10, 0, 420)).toBe(0);
    });

    it('eases a fraction of the way to the target', async () => {
        const { ease_toward } = await geometry();

        expect(ease_toward(0, 100, 0.12)).toBe(12);
        expect(ease_toward(100, 100, 0.12)).toBe(100);
        expect(ease_toward(100, 0, 0.5)).toBe(50);
    });

    it('turns scroll position into a percentage', async () => {
        const { scroll_progress } = await geometry();

        expect(scroll_progress(0, 800)).toBe(0);
        expect(scroll_progress(200, 800)).toBe(25);
        expect(scroll_progress(800, 800)).toBe(100);
        expect(scroll_progress(50, 0)).toBe(0);
    });
});
