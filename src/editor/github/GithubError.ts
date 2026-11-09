/** A failed GitHub request, with the HTTP status that came back. */
export class GithubError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'GithubError';
        this.status = status;
    }
}
