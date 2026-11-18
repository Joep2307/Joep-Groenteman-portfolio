import type { ListItem } from '../lists/ListItem';

/** A section of the page, with its item in the side navigation. */
export interface PageSection extends ListItem {
    readonly section: HTMLElement;
    readonly rail: HTMLElement | null;
    readonly id: string;
    readonly title: string;
}
