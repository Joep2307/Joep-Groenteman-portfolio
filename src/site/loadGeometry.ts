import type { GeometryModule } from './GeometryModule';

/**
 * Loads the wasm geometry. The module system loads it once and hands the
 * same instance to every caller. Resolves to `null` if it cannot load, so
 * the effects can be skipped and the page stays readable without wasm.
 */
export function loadGeometry(): Promise<GeometryModule | null> {
    return import('../geometry/pkg/geometry').catch(() => null);
}
