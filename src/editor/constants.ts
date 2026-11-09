export const REPO_NAME = 'Joep-Groenteman-portfolio';
export const REPO = `Joep2307/${REPO_NAME}`;
export const BRANCH = 'main';
export const API_URL = `https://api.github.com/repos/${REPO}`;
export const LIVE_URL = 'https://joep-groenteman-portfolio-qwc2.vercel.app';
export const TOKEN_KEY = 'portfolio-editor-token';
export const TOKEN_URL =
    'https://github.com/settings/personal-access-tokens/new?name=Portfolio+editor&description=Publishes+portfolio+edits+from+the+%2Fdev+page&expires_in=365&contents=write';

/**
 * The site's folder in the repository. The page refers to its files
 * relative to this folder, and so does the editor until it talks to GitHub.
 */
export const SITE_ROOT = 'exe/';
export const PAGE_PATH = `${SITE_ROOT}index.html`;
/** Images sit beside the page; the build serves them from the same path. */
export const IMAGE_FOLDER = 'img';
export const IMAGE_PREFIX = `${IMAGE_FOLDER}/`;
/** Any other file the page links to, such as the CV, is served from here. */
export const PUBLIC_ROOT = `${SITE_ROOT}public/`;

/** A larger upload still works, but the notice suggests a smaller file. */
export const MAX_UPLOAD_NOTE_BYTES = 2 * 1024 * 1024;
export const BYTES_PER_MB = 1024 * 1024;

/**
 * Every selector the editor relies on, so a hand edit that removes one
 * gives a clear message.
 */
export const REQUIRED_SELECTORS = [
    'title',
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    '.topnav .mark a',
    '.contact-link',
    '.rail',
    '#intro .eyebrow',
    '.hero-title',
    '.hero-sub',
    '.hero-meta',
    '.scroll-cue',
    '#work .section-title',
    '.cases',
    '#about .section-title',
    '.about-bio',
    '.about-bio [data-open]',
    '.skills-list',
    '#contact .section-title',
    '.contact-title',
    '.contact-email',
    '.socials',
    '#overlay',
    '.panel-close',
    'footer span',
];

/** The sections every page has; any other section is a custom one. */
export const FIXED_SECTION_IDS = ['intro', 'work', 'about', 'contact'];

export const DEFAULT_COMMIT_MESSAGE = 'Update portfolio content';

export const DRAFT_DATABASE = 'portfolio-editor';
export const DRAFT_STORE = 'kv';
export const DRAFT_KEY = 'draft';

/** How long typing has to pause before the preview and draft update. */
export const FLUSH_DELAY_MS = 300;
export const NOTICE_DURATION_MS = 7000;

/** The preview starts open on wider windows; matches `$stacked` in SCSS. */
export const STACKED_MAX_WIDTH_PX = 1100;

/**
 * The preview frame shares the editor's origin so the editor can mount the
 * site into it. Its scripts stay enabled for the listeners the editor adds;
 * `PREVIEW_CSP` is what stops the page's own markup from running any.
 */
export const PREVIEW_SANDBOX = 'allow-same-origin allow-scripts';
export const PREVIEW_CSP = "script-src 'none'";

export const PARAGRAPHS_HINT =
    'Double asterisks make text **bold**. The first paragraph shows ' +
    'larger on the site.';

// The whitespace in these follows the page's own indentation, so new
// markup lines up with what is already there.
export const CV_ENTRY_HTML = `<div class="cv-item">
                    <div class="cv-item-head">
                        <span class="cv-role"></span>
                        <span class="cv-date"></span>
                    </div>
                </div>`;

export const PANEL_BLOCK_HTML =
    '<div class="panel-block">\n<h4></h4>\n<p></p>\n</div>';

export const SOCIAL_LINK_HTML =
    '<a href="" target="_blank" rel="noopener noreferrer">' +
    '<span class="sr-only"> (opens in a new tab)</span></a>';
