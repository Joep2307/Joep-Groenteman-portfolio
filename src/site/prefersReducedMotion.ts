export function prefersReducedMotion(view: Window): boolean {
    return view.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
