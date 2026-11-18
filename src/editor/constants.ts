export const REPO_NAME = 'Joep-Groenteman-portfolio';
export const REPO = `Joep2307/${REPO_NAME}`;
export const BRANCH = 'main';
export const LIVE_URL = 'https://joepgroenteman.com';
/** The editor talks to GitHub straight from the browser. */
export const GITHUB_API = 'https://api.github.com';
export const REPO_API = `${GITHUB_API}/repos/${REPO}`;
/**
 * The only account that can log in, matched on the numeric id (Joep2307),
 * so a renamed account still works and someone taking the old name does
 * not get in.
 */
export const EDITOR_GITHUB_ID = 114413220;
/** Where this browser keeps the token until you log out. */
export const TOKEN_KEY = 'portfolio-editor-token';
/**
 * GitHub's page for a new fine-grained token, filled in as far as GitHub
 * allows. Which repository it may touch has to be picked by hand.
 */
export const NEW_TOKEN_URL =
    'https://github.com/settings/personal-access-tokens/new?' +
    new URLSearchParams({
        name: 'Portfolio editor',
        description: `Edit and publish ${LIVE_URL} from /dev/`,
        target_name: 'Joep2307',
        expires_in: '90',
        contents: 'write',
    }).toString();

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

/**
 * The preview frame shares the editor's origin so the editor can mount the
 * site into it. Its scripts stay enabled for the listeners the editor adds;
 * `PREVIEW_CSP` is what stops the page's own markup from running any.
 */
export const PREVIEW_SANDBOX = 'allow-same-origin allow-scripts';
export const PREVIEW_CSP = "script-src 'none'";

/**
 * Clicks on these in the page do what they do on the site, so case
 * studies can be opened, stepped through and closed while editing.
 */
export const PAGE_CONTROLS = '.panel-close, #overlay, .rail, [data-nav]';

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

/**
 * Archived parts wait in a template at the end of the page: inert, so
 * visitors, screen readers and the site's scripts never see them.
 */
export const ARCHIVE_ID = 'archive';
/** Marks a parent without an id, so an archived part can find it again. */
export const ARCHIVE_HOME_ATTR = 'data-archive-home';
/** How much of an archived part's text the archive shows. */
export const ARCHIVE_TITLE_LENGTH = 90;

/** Dragging a row this close to the panel's edge scrolls the panel. */
export const DRAG_EDGE_PX = 48;
export const DRAG_MAX_SCROLL_PX = 14;

/** What the archive calls each piece of a case study or CV section. */
export const BLOCK_KINDS = {
    text: 'Paragraph',
    image: 'Image',
    entry: 'CV entry',
    languages: 'Languages',
    other: 'Custom HTML',
} as const;
