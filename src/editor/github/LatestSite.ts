/** The page as it is on GitHub right now. */
export interface LatestSite {
    /** The commit the branch points at. */
    readonly head: string;
    readonly blobSha: string;
    readonly html: string;
}
