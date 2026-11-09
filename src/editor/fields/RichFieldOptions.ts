export interface RichFieldOptions {
    /** Selector for child elements the field leaves alone. */
    readonly skip?: string | undefined;
    readonly multiline?: boolean | undefined;
    readonly hint?: string | undefined;
}
