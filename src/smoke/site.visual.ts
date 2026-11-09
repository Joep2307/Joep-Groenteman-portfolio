import { expect, test, type Page } from '@playwright/test';

const SECTIONS = ['intro', 'work', 'about', 'contact'];
const PANELS = ['panel-01', 'panel-02', 'panel-03', 'panel-04', 'panel-05'];
const FIXED_CHROME = '.skip-link, .progress, .topnav, .rail';

async function hide(page: Page, selector: string): Promise<void> {
    await page.addStyleTag({
        content: `${selector} { visibility: hidden !important; }`,
    });
}

async function openSite(page: Page): Promise<void> {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(async () => {
        await document.fonts.ready;
        const images = [...document.images];
        for (const image of images) image.loading = 'eager';
        await Promise.all(images.map((image) => image.decode()));
        for (const item of document.querySelectorAll('.case')) {
            item.classList.add('in-view');
        }
    });
}

test('top of the page', async ({ page }) => {
    await openSite(page);
    await expect(page).toHaveScreenshot('viewport.png', {
        animations: 'disabled',
    });
});

for (const section of SECTIONS) {
    test(`section ${section}`, async ({ page }) => {
        await openSite(page);
        // A section taller than the viewport is captured past its edges,
        // which would paint the fixed chrome over the middle of the shot.
        await hide(page, FIXED_CHROME);
        await expect(page.locator(`#${section}`)).toHaveScreenshot(
            `section-${section}.png`,
            { animations: 'disabled' },
        );
    });
}

for (const panel of PANELS) {
    test(`case panel ${panel}`, async ({ page }) => {
        await openSite(page);
        await page.locator(`[data-open="${panel}"]`).first().click();
        const locator = page.locator(`#${panel}`);
        await expect(locator).toBeVisible();
        // The blurred page behind depends on where the opening click left
        // the scroll position, so keep it out of the comparison.
        await hide(page, `${FIXED_CHROME}, main, footer`);
        // Panels scroll inside the overlay, so grow the viewport to fit.
        const { width } = page.viewportSize() ?? { width: 0 };
        const height = await locator.evaluate((el) => el.scrollHeight);
        await page.setViewportSize({ width, height });
        await expect(page).toHaveScreenshot(`${panel}.png`, {
            animations: 'disabled',
        });
    });
}
