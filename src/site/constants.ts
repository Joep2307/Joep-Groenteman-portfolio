/** Tilt of a case image with the pointer at its edge; kept subtle. */
export const TILT_MAX_DEGREES = 3;
export const TILT_PERSPECTIVE_PX = 800;

export const MAGNETIC_SELECTOR = '.contact-link, .cv-btn, .case-link';
export const MAGNETIC_FACTOR_X = 0.18;
export const MAGNETIC_FACTOR_Y = 0.28;

/**
 * Travel of a shape with depth 1 as the pointer crosses the window. With
 * the repel push on top, a shape moves at most half this times its depth
 * plus `SHAPE_REPEL_MAX_PX`; `--shape-overhang` in the tokens must stay
 * larger, or a shape bleeding off the page edge pulls clear of it.
 */
export const SHAPE_DRIFT_PX = 40;
/** How close the pointer gets before a shape moves out of its way. */
export const SHAPE_REPEL_REACH_PX = 240;
export const SHAPE_REPEL_MAX_PX = 24;
export const SHAPE_EASING = 0.1;

/**
 * The rail marks the section that crosses a thin band across the middle of
 * the screen. A share-visible threshold would never fire for a section
 * taller than the screen, like the work list with one case per screen.
 */
export const RAIL_ROOT_MARGIN = '-45% 0px -54% 0px';
export const CASE_REVEAL_THRESHOLD = 0.15;

export const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** What goes inert behind an open panel. */
export const PAGE_CONTENT_SELECTORS = [
    '.topnav',
    '#rail',
    '#main-content',
    'footer',
];
