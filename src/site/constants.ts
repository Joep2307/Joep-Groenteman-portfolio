/** Tilt of a case image with the pointer at its edge; kept subtle. */
export const TILT_MAX_DEGREES = 3;
export const TILT_PERSPECTIVE_PX = 800;

export const MAGNETIC_SELECTOR = '.contact-link, .cv-btn, .case-link';
export const MAGNETIC_FACTOR_X = 0.18;
export const MAGNETIC_FACTOR_Y = 0.28;

export const GLOW_RANGE_X_PX = 420;
export const GLOW_RANGE_Y_PX = 320;
export const GLOW_EASING = 0.12;
export const GLOW_SCALE = 1.18;

export const RAIL_THRESHOLD = 0.4;
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
