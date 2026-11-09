import { IMAGE_PREFIX, PUBLIC_ROOT, SITE_ROOT } from '../constants';

/** Where a file the page refers to lives in the repository. */
export function repoPath(sitePath: string): string {
    const path = sitePath.replace(/^\/+/, '');
    return (path.startsWith(IMAGE_PREFIX) ? SITE_ROOT : PUBLIC_ROOT) + path;
}
