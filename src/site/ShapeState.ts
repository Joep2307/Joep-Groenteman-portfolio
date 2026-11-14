/** A decorative shape, where it has eased to and where it is heading. */
export interface ShapeState {
    readonly el: HTMLElement;
    /** Multiplies how far the shape drifts with the pointer. */
    readonly depth: number;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
}
