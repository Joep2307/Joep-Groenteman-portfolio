export interface MountSiteOptions {
    /** Panel to show on mount, leaving keyboard focus where it is. */
    readonly initialPanel?: string;
    /** Show every case at once instead of revealing them on scroll. */
    readonly revealCases?: boolean;
}
