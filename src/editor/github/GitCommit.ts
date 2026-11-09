import type { GitObject } from './GitObject';

export interface GitCommit extends GitObject {
    readonly tree: GitObject;
}
