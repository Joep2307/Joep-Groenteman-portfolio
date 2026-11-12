import type { GitObject } from './GitObject';

export interface GitRef {
    readonly object: GitObject;
}
