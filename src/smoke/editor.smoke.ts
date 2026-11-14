import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Answers the login check: logged in, or not. */
async function mockLogin(page: Page, loggedIn: boolean): Promise<void> {
    await page.route('**/api/auth/me', (route) =>
        loggedIn
            ? route.fulfill({ json: { login: 'joep' } })
            : route.fulfill({ status: 401, json: { message: 'No.' } }),
    );
}

/** Answers the editor's GitHub reads, through the proxy, from disk. */
async function mockGithub(page: Page): Promise<void> {
    const html = readFileSync('exe/index.html').toString('base64');
    await page.route('**/api/github?*', (route) => {
        const path =
            new URL(route.request().url()).searchParams.get('path') ?? '';
        if (path === '') {
            return route.fulfill({ json: { permissions: { push: true } } });
        }
        if (path.startsWith('/git/ref/heads/')) {
            return route.fulfill({ json: { object: { sha: 'head' } } });
        }
        if (path.startsWith('/contents/exe/index.html')) {
            return route.fulfill({ json: { sha: 'blob', content: html } });
        }
        if (path.startsWith('/contents/exe/img')) {
            return route.fulfill({ json: [] });
        }
        return route.fulfill({ status: 404, json: {} });
    });
}

/** The editor, logged in, with the page loaded in its frame. */
async function openEditor(page: Page): Promise<void> {
    await mockLogin(page, true);
    await mockGithub(page);
    await page.goto('/dev/');
    await expect(
        page.frameLocator('#preview-frame').locator('.hero-title'),
    ).toBeVisible();
}

test('the footer of the site links to the editor', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('footer').getByRole('link', { name: 'Log in' });
    await expect(link).toHaveAttribute('href', '/dev/');
});

test('without a login the editor asks you to sign in', async ({ page }) => {
    await mockLogin(page, false);
    const response = await page.goto('/dev/');
    expect(response?.status()).toBe(200);
    await expect(
        page.getByRole('heading', { name: 'Log in to edit your portfolio' }),
    ).toBeVisible();
    await expect(
        page.getByRole('link', { name: 'Sign in with GitHub' }),
    ).toHaveAttribute('href', '/api/auth/login');
});

test('a refused sign-in says why, once', async ({ page }) => {
    await mockLogin(page, false);
    await page.goto('/dev/?login=denied');
    await expect(page.getByRole('alert')).toContainText(
        "This GitHub account can't edit this site",
    );
    expect(new URL(page.url()).search).toBe('');
});

test('logged in, the page fills the striped editor', async ({ page }) => {
    await openEditor(page);
    await expect(page.locator('#drawer')).toBeHidden();
    for (const name of ['Sections', 'Publish', 'Log out']) {
        await expect(page.getByRole('button', { name })).toBeVisible();
    }
});

test('clicking the hero edits it, Escape closes', async ({ page }) => {
    await openEditor(page);
    const frame = page.frameLocator('#preview-frame');
    await frame.locator('.hero-title').click();

    const drawer = page.locator('#drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('heading', { level: 1 })).toHaveText(
        'Intro',
    );
    const title = drawer.getByLabel('Title', { exact: true });
    await expect(title).toBeFocused();

    await title.fill('Edited in place');
    await expect(frame.locator('.hero-title')).toHaveText('Edited in place');

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
});

test('clicking a case card edits that project', async ({ page }) => {
    await openEditor(page);
    const frame = page.frameLocator('#preview-frame');
    const card = frame.locator('.case').first();
    const name = await card.locator('.case-title').innerText();
    await card.locator('.case-title').click();
    await expect(
        page.locator('#drawer').getByRole('heading', { level: 1 }),
    ).toHaveText(name);
    await expect(page.getByLabel('Project title')).toBeFocused();
    // The click edits the card; it does not open the case study.
    await expect(frame.locator('#overlay')).not.toHaveClass(/active/);
});

test('Sections lists every part of the page', async ({ page }) => {
    await openEditor(page);
    await page.getByRole('button', { name: 'Sections' }).click();
    const list = page.getByRole('navigation', {
        name: 'Every part of the page',
    });
    await expect(list).toBeVisible();
    await list.getByRole('button', { name: 'Site settings' }).click();
    await expect(
        page.locator('#drawer').getByRole('heading', { level: 1 }),
    ).toHaveText('Site settings');
});

test('the login screen has no accessibility violations', async ({ page }) => {
    await mockLogin(page, false);
    await page.goto('/dev/?login=denied');
    await expect(page.getByRole('alert')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
});

test('the open edit panel has no accessibility violations', async ({
    page,
}) => {
    await openEditor(page);
    await page.frameLocator('#preview-frame').locator('.hero-title').click();
    await expect(page.locator('#drawer')).toBeVisible();
    const results = await new AxeBuilder({ page })
        .exclude('#preview-frame')
        .analyze();
    expect(results.violations).toEqual([]);
});
