import { BRANCH, PAGE_PATH } from '../constants';
import type { ContentFile } from './ContentFile';
import { decodeBase64 } from './decodeBase64';
import { githubFetch } from './githubFetch';
import type { GitRef } from './GitRef';
import type { LatestSite } from './LatestSite';

export async function fetchLatest(): Promise<LatestSite> {
    const ref = (await githubFetch(`/git/ref/heads/${BRANCH}`)) as GitRef;
    const head = ref.object.sha;
    const file = (await githubFetch(
        `/contents/${PAGE_PATH}?ref=${head}`,
    )) as ContentFile;
    return { head, blobSha: file.sha, html: decodeBase64(file.content) };
}
