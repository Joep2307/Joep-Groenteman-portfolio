/** Whether the request came over https; local development uses http. */
export function isHttps(request: Request): boolean {
    return new URL(request.url).protocol === 'https:';
}
