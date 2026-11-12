import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Waits out the entrance animations: axe measures contrast as it is at that
 * moment, so text still fading in fails. The eyebrow's pulse never ends.
 */
async function settle(page: Page): Promise<void> {
    await page.evaluate(() =>
        Promise.allSettled(
            document
                .getAnimations()
                .filter(
                    (item) => item.effect?.getTiming().iterations !== Infinity,
                )
                .map((item) => item.finished),
        ),
    );
}

test('the site has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
});

test('an open case panel has no accessibility violations', async ({
    page,
}) => {
    await page.goto('/');
    await page.locator('[data-open="panel-01"]').click();
    await expect(page.locator('#panel-01')).toBeVisible();
    await settle(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
});
