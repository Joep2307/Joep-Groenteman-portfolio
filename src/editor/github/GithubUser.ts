/** The part of GitHub's `GET /user` answer the editor uses. */
export interface GithubUser {
    readonly id: number;
    readonly login: string;
}
