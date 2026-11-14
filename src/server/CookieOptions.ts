export interface CookieOptions {
    /** Seconds; 0 deletes the cookie. */
    readonly maxAge: number;
    readonly path: string;
    /** Off only on plain http, which is local development. */
    readonly secure: boolean;
}
