import { expect, test } from '@playwright/test';

test('the four sections render', async ({ page }) => {
    await page.goto('/');
    for (const id of ['intro', 'work', 'about', 'contact']) {
        await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator('#intro .hero-title')).toBeVisible();
    await expect(page.locator('#work .case')).toHaveCount(4);
});

test('a case panel opens, traps focus, and closes on Escape', async ({
    page,
}) => {
    await page.goto('/');
    const opener = page.locator('[data-open="panel-01"]');
    await opener.focus();
    await opener.press('Enter');

    const panel = page.locator('#panel-01');
    await expect(panel).toBeVisible();
    await expect(page.locator('#panel-02')).toBeHidden();
    await expect(panel).toBeFocused();

    // Tab many times: focus must never leave the overlay.
    for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Tab');
        const inside = await page.evaluate(
            () =>
                document
                    .getElementById('overlay')
                    ?.contains(document.activeElement) ?? false,
        );
        expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(page.locator('#overlay')).toBeHidden();
    await expect(opener).toBeFocused();
});

test('the next button wraps from the last panel to the first', async ({
    page,
}) => {
    await page.goto('/');
    await page.locator('[data-open="panel-04"]').click();
    await expect(page.locator('#panel-04')).toBeVisible();

    await page.locator('#panel-04 [data-nav="next"]').click();
    await expect(page.locator('#panel-05')).toBeVisible();
    await page.locator('#panel-05 [data-nav="next"]').click();
    await expect(page.locator('#panel-01')).toBeVisible();
});

test('rail links scroll to their section', async ({ page }) => {
    await page.goto('/');
    await page.locator('.rail-item[data-target="contact"]').click();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(
        page.locator('.rail-item[data-target="contact"]'),
    ).toHaveClass(/active/);
});
