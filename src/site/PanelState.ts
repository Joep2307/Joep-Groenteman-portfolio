export interface PanelState {
    readonly doc: Document;
    readonly view: Window & typeof globalThis;
    readonly overlay: HTMLElement;
    readonly panels: readonly HTMLElement[];
    /** Goes inert while a panel is open. */
    readonly pageContent: readonly Element[];
    /** Gets focus back when the panel closes. */
    lastFocused: HTMLElement | null;
    activePanel: HTMLElement | null;
}
