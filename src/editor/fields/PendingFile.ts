/** A file waiting to be uploaded on publish. */
export interface PendingFile {
    readonly base64: string;
    readonly dataUrl: string;
}
