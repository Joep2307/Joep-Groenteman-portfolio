import { IMAGE_FOLDER, IMAGE_PREFIX, SITE_ROOT } from '../constants';
import type { ContentEntry } from './ContentEntry';
import { githubFetch } from './githubFetch';

/** The site's images at a commit, as the paths the page refers to. */
export async function listImages(head: string): Promise<string[]> {
    const entries = (await githubFetch(
        `/contents/${SITE_ROOT}${IMAGE_FOLDER}?ref=${head}`,
    )) as ContentEntry[];
    return entries
        .filter((entry) => entry.type === 'file')
        .map((entry) => IMAGE_PREFIX + entry.name);
}
