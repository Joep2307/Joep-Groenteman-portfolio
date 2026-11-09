export interface FieldOptions {
    /** A textarea that grows with its text, instead of a one-line input. */
    readonly multiline?: boolean | undefined;
    readonly hint?: string | undefined;
    readonly placeholder?: string | undefined;
    /** The id of a datalist with suggestions. */
    readonly list?: string | undefined;
    readonly disabled?: boolean | undefined;
    /** The input type; ignored for a multiline field. */
    readonly type?: string | undefined;
}
