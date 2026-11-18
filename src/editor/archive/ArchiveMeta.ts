/** What the archive shows about an archived part. */
export interface ArchiveMeta {
    /** What it is, such as "Project" or "Paragraph". */
    readonly kind: string;
    readonly title: string;
    /** The view it was archived from, such as "About". */
    readonly from: string;
}
