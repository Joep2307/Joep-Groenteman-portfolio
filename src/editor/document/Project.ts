import type { ListItem } from '../lists/ListItem';

/** A project: its card on the homepage and its case study panel. */
export interface Project extends ListItem {
    readonly card: HTMLElement;
    readonly panel: HTMLElement;
    /** The panel's id, which the editor's views go by. */
    readonly id: string;
    readonly title: string;
}
