import type { PendingFile } from '../fields/PendingFile';

/** Unpublished edits, as kept on this device. */
export interface Draft {
    readonly html: string;
    readonly baseBlobSha: string | null;
    readonly pending?: Record<string, PendingFile>;
}
