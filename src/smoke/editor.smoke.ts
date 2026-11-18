import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const REPO_API =
    'https://api.github.com/repos/Joep2307/Joep-Groenteman-portfolio';
const TOKEN_KEY = 'portfolio-editor-token';
const JOEP = { id: 114413220, login: 'Joep2307' };

/** Saves a token in the browser before the editor loads. */
async function saveToken(page: Page): Promise<void> {
    await page.addInitScript((key) => {
        localStorage.setItem(key, 'github_pat_test');
    }, TOKEN_KEY);
}

/** Answers GitHub's "who is this?" with the given account, or a 401. */
async function mockViewer(
    page: Page,
    user: { id: number; login: string } | null,
): Promise<void> {
    await page.route('https://api.github.com/user', (route) =>
        user
            ? route.fulfill({ json: user })
            : route.fulfill({
                  status: 401,
                  json: { message: 'Bad credentials' },
              }),
    );
}

/** Answers the editor's reads of the repository, from disk. */
async function mockGithub(page: Page): Promise<void> {
    const html = readFileSync('exe/index.html').toString('base64');
    await page.route(`${REPO_API}**`, (route) => {
        const path = new URL(route.request().url()).pathname.slice(
            new URL(REPO_API).pathname.length,
        );
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
    await saveToken(page);
    await mockViewer(page, JOEP);
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

test('without a token the editor asks for one', async ({ page }) => {
    const response = await page.goto('/dev/');
    expect(response?.status()).toBe(200);
    await expect(
        page.getByRole('heading', { name: 'Log in to edit your portfolio' }),
    ).toBeVisible();
    await expect(page.getByLabel('GitHub token')).toBeFocused();
    await expect(
        page.getByRole('link', { name: /Create a token on GitHub/ }),
    ).toHaveAttribute(
        'href',
        /^https:\/\/github\.com\/settings\/personal-access-tokens\/new\?/,
    );
});

test('pasting a token logs in and keeps it', async ({ page }) => {
    await mockViewer(page, JOEP);
    await mockGithub(page);
    await page.goto('/dev/');
    await page.getByLabel('GitHub token').fill('  github_pat_test  ');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(
        page.frameLocator('#preview-frame').locator('.hero-title'),
    ).toBeVisible();
    expect(
        await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY),
    ).toBe('github_pat_test');
});

test("another account's token is refused and forgotten", async ({ page }) => {
    await saveToken(page);
    await mockViewer(page, { id: 1, login: 'someone' });
    await page.goto('/dev/');
    await expect(page.getByRole('alert')).toContainText(
        "This token belongs to someone, which can't edit this site",
    );
    expect(
        await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY),
    ).toBeNull();
});

test('a token GitHub rejects sends you back to log in', async ({ page }) => {
    await saveToken(page);
    await mockViewer(page, null);
    await page.goto('/dev/');
    await expect(page.getByRole('alert')).toContainText(
        "GitHub didn't accept this token",
    );
});

test('log out forgets the token', async ({ page }) => {
    await openEditor(page);
    page.once('dialog', (dialog) => void dialog.accept());
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page.getByLabel('GitHub token')).toBeVisible();
    expect(
        await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY),
    ).toBeNull();
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
    await saveToken(page);
    await mockViewer(page, null);
    await page.goto('/dev/');
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

/** Opens a view from the list of every part of the page. */
async function openView(page: Page, name: string): Promise<void> {
    await page.getByRole('button', { name: 'Sections', exact: true }).click();
    await page
        .getByRole('navigation', { name: 'Every part of the page' })
        .getByRole('button', { name, exact: true })
        .click();
    await expect(
        page.locator('#drawer').getByRole('heading', { level: 1 }),
    ).toHaveText(name.replace(/ \(\d+\)$/, ''));
}

test('a project can be archived and restored', async ({ page }) => {
    await openEditor(page);
    const frame = page.frameLocator('#preview-frame');
    const titles = frame.locator('.case .case-title');
    const before = await titles.allInnerTexts();

    await openView(page, 'Projects');
    await page.getByRole('button', { name: 'Archive project 2' }).click();
    await expect(titles).toHaveText(before.filter((_, i) => i !== 1));
    await expect(frame.locator('.case-index').nth(1)).toContainText('CASE 02');

    await openView(page, 'Archive (1)');
    const drawer = page.locator('#drawer');
    await expect(drawer).toContainText(before[1] ?? '');
    const results = await new AxeBuilder({ page })
        .exclude('#preview-frame')
        .analyze();
    expect(results.violations).toEqual([]);

    await drawer.getByRole('button', { name: 'Restore' }).click();
    await expect(titles).toHaveText(before);
    await expect(drawer).toContainText('Nothing is archived');
    await expect(page.locator('#status')).toHaveText(
        'Everything is published',
    );
});

test('sections can be dragged into a new order', async ({ page }) => {
    await openEditor(page);
    await openView(page, 'Arrange sections');
    const rows = page.locator('[data-row^="sections:"] .project-open');
    await expect(rows).toHaveText(['Selected work', 'About', 'Contact']);

    // The mouse does not scroll, so the rows have to be on screen.
    await page.getByRole('button', { name: 'All sections' }).click();
    await page.locator('[data-row="sections:2"]').scrollIntoViewIfNeeded();
    const grip = page.locator('[data-row="sections:2"] .row-grip');
    const target = page.locator('[data-row="sections:0"]');
    const from = await grip.boundingBox();
    const to = await target.boundingBox();
    if (!from || !to) throw new Error('The rows are not on screen.');
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x + from.width / 2, to.y + 4, { steps: 12 });
    await page.mouse.up();

    await expect(rows).toHaveText(['Contact', 'Selected work', 'About']);
    const frame = page.frameLocator('#preview-frame');
    // The preview redraws once the editor has caught up.
    await expect
        .poll(() =>
            frame
                .locator('main > section')
                .evaluateAll((all) => all.map((el) => el.id)),
        )
        .toEqual(['intro', 'contact', 'work', 'about']);
    await expect(frame.locator('.rail-item .label')).toHaveText([
        'Intro',
        'Contact',
        'Work',
        'About',
    ]);
    await expect(frame.locator('#contact .section-num')).toHaveText('01');

    const results = await new AxeBuilder({ page })
        .exclude('#preview-frame')
        .analyze();
    expect(results.violations).toEqual([]);
});
