import { describe, expect, it } from 'vitest';
import { loadGeometry } from './loadGeometry';

describe('loadGeometry', () => {
    it('loads the module', async () => {
        expect(await loadGeometry()).not.toBeNull();
    });

    it('exposes the maths from the wasm build', async () => {
        const geometry = await loadGeometry();
        expect(geometry?.tilt(200, 100, 100, 3)).toBe(1.5);
        expect(geometry?.magnetic_offset(200, 100, 100, 0.5)).toBe(25);
        expect(geometry?.parallax_offset(0, 1000, 420)).toBe(-210);
        expect(geometry?.ease_toward(0, 100, 0.12)).toBe(12);
        expect(geometry?.scroll_progress(200, 800)).toBe(25);
    });
});
