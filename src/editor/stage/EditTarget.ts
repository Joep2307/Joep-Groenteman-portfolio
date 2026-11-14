/** A part of the page that opens a view when clicked. */
export interface EditTarget {
    readonly selector: string;
    /** A view name, as `resolveView` takes it. */
    readonly view: string;
    /** Shown on the page while the pointer is over it. */
    readonly label: string;
}
