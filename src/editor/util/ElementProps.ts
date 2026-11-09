/**
 * Attributes for `h`. A function is added as a listener for the event its
 * key names (`onclick`), `true` sets an empty attribute, and `false`,
 * `null` and `undefined` leave the attribute off.
 */
export type ElementProps = Readonly<
    Record<
        string,
        string | number | boolean | null | undefined | ((event: Event) => void)
    >
>;
