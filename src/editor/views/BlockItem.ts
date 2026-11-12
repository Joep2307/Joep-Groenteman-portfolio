import type { ListItem } from '../lists/ListItem';

/** One piece of a case study or CV section. */
export interface BlockItem extends ListItem {
    readonly type: 'text' | 'image' | 'entry' | 'languages' | 'other';
}
