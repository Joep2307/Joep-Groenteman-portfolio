import previewCss from '../../styles/preview.scss?inline';
import siteCss from '../../styles/site.scss?inline';
import { PREVIEW_CSP } from '../constants';
import { assetUrl } from '../document/assetUrl';
import type { EditorState } from '../EditorState';

/**
 * The page as the preview frame gets it: unable to run scripts of its own,
 * styled with the built site styles, and with images that show pending
 * uploads.
 */
export function previewDocument(state: EditorState): string {
    const clone = state.doc.cloneNode(true) as Document;

    // The editor mounts the site's script itself, and nothing else in the
    // page may run next to the GitHub token: the policy also covers inline
    // handlers and `javascript:` links.
    clone.querySelectorAll('script').forEach((script) => {
        script.remove();
    });
    const policy = clone.createElement('meta');
    policy.httpEquiv = 'Content-Security-Policy';
    policy.content = PREVIEW_CSP;
    clone.head.prepend(policy);

    // The page links its styles as source files, which only the build can
    // read. Styles from elsewhere, such as the web fonts, stay.
    clone.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        if (!/^https?:/.test(link.getAttribute('href') ?? '')) link.remove();
    });
    const style = clone.createElement('style');
    style.textContent = siteCss + previewCss;
    clone.head.append(style);

    clone.querySelectorAll('img[src]').forEach((img) => {
        img.setAttribute('src', assetUrl(state, img.getAttribute('src')));
        img.removeAttribute('loading');
    });
    return `<!DOCTYPE html>${clone.documentElement.outerHTML}`;
}
