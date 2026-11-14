/** Who is logged in, and until when (seconds since 1970). */
export interface Session {
    readonly id: number;
    readonly login: string;
    readonly exp: number;
}
