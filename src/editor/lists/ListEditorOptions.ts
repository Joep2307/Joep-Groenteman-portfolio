import type { ElementChild } from '../util/ElementChild';
import type { ListAdd } from './ListAdd';
import type { ListItem } from './ListItem';

export interface ListEditorOptions<T extends ListItem> {
    /** Unique among the lists on screen; focus is restored through it. */
    readonly key: string;
    /** What a row is called in its button labels, such as "paragraph". */
    readonly name: string;
    readonly items: readonly T[];
    readonly render: (
        item: T,
        index: number,
    ) => ElementChild | readonly ElementChild[];
    readonly adds?: readonly ListAdd[];
    /** Swaps two neighbouring items on the page. */
    readonly swap?: (items: readonly T[], a: number, b: number) => void;
    readonly remove?: (item: T) => void;
    /** The question to ask before removing; without it nothing is asked. */
    readonly confirmRemove?: (item: T) => string;
    readonly rowClass?: string;
}
