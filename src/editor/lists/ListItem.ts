/** One row of a list: the page elements that move and go together. */
export interface ListItem {
    readonly nodes: [Element, ...Element[]];
    /** A fixed row can be moved but not removed. */
    readonly fixed?: boolean;
}
