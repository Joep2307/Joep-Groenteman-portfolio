import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REPO_API, TOKEN_KEY } from '../constants';
import { GithubError } from './GithubError';
import { githubFetch } from './githubFetch';

describe('githubFetch', () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
        localStorage.setItem(TOKEN_KEY, 'github_pat_test');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        fetchMock.mockReset();
        localStorage.clear();
    });

    it('calls the repository API with the saved token', async () => {
        fetchMock.mockResolvedValue(Response.json({ sha: 'abc' }));
        await expect(githubFetch('/git/ref/heads/main')).resolves.toEqual({
            sha: 'abc',
        });
        const [url, init] = fetchMock.mock.calls[0] ?? [];
        expect(url).toBe(`${REPO_API}/git/ref/heads/main`);
        expect(new Headers(init?.headers).get('Authorization')).toBe(
            'Bearer github_pat_test',
        );
    });

    it("throws GitHub's message with the status", async () => {
        fetchMock.mockResolvedValue(
            Response.json({ message: 'Bad credentials' }, { status: 401 }),
        );
        const error = await githubFetch('').catch((err: unknown) => err);
        expect(error).toBeInstanceOf(GithubError);
        expect(error).toMatchObject({
            message: 'Bad credentials',
            status: 401,
        });
    });

    it('is a 401 without asking GitHub when no token is saved', async () => {
        localStorage.clear();
        await expect(githubFetch('')).rejects.toMatchObject({ status: 401 });
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
