import { IMAGE_PREFIX } from '../constants';

/** A tidy path for an uploaded image that no known image has yet. */
export function uniqueImagePath(
    knownImages: readonly string[],
    fileName: string,
): string {
    const dot = fileName.lastIndexOf('.');
    const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : 'jpg';
    const slug =
        (dot > 0 ? fileName.slice(0, dot) : fileName)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'image';
    let path = `${IMAGE_PREFIX}${slug}.${ext}`;
    for (let n = 2; knownImages.includes(path); n++) {
        path = `${IMAGE_PREFIX}${slug}-${String(n)}.${ext}`;
    }
    return path;
}
