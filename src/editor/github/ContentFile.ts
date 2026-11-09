import type { GitObject } from './GitObject';

/** A file as the contents API returns it. */
export interface ContentFile extends GitObject {
    /** Base64, wrapped over several lines. */
    readonly content: string;
}
