/** What a view draws in the form: its heading and what goes under it. */
export interface ViewContent {
    readonly title: string;
    readonly content: readonly HTMLElement[];
}
