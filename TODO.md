# TODO — bring the portfolio up to the coding standards

Plan first, then full implementation. Nothing below is started yet.

## Which model for which task

Every task ends with the Claude model best suited to it. These are
judgement calls, not measurements.

| Tag        | Model      | Use it for                                  |
| ---------- | ---------- | ------------------------------------------- |
| `[Haiku]`  | Haiku 5.5  | Mechanical, fully specified, nothing to     |
|            |            | decide                                      |
| `[Sonnet]` | Sonnet 5.5 | Ordinary, well-scoped coding                |
| `[Opus]`   | Opus 5.5   | Design judgement, or several moving parts   |
| `[Fable]`  | Fable 5.1  | Restructuring large tangled code where a    |
|            |            | mistake can damage the live site            |
| `[you]`    | —          | Needs your account, your eyes or your call  |

In practice you pick a model per session, so per phase:

| Phase                | Model  | Switch up for                       |
| -------------------- | ------ | ----------------------------------- |
| 0 safety net         | Sonnet | —                                   |
| 1 tooling and config | Sonnet | Opus: Vite config, custom lint rule |
| 2 site styles        | Sonnet | Opus: screenshot comparison         |
| 3 site script        | Sonnet | Opus: `mountSite`, panel and focus  |
| 4 geometry in Rust   | Sonnet | Opus: wasm loading                  |
| 5 editor port        | Fable  | —                                   |
| 6 tests              | Sonnet | —                                   |
| 7 CI, hooks, deploy  | Sonnet | Opus: Rust on Vercel                |
| 8 cutover            | Opus   | —                                   |
| 9 accessibility      | Sonnet | Opus: contrast, no-script, skills   |

Cost rises steeply from Haiku to Fable. If you want one model for
everything, use Opus.

## Running it best and fastest

Three models: Fable, Opus and Sonnet. Skip Haiku; its tasks are
one-file configs, and handing them off costs more time than it saves.
Five sessions at the busiest point, each in its own git worktree.

| Stage | Runs                 | Session            | Model  |
| ----- | -------------------- | ------------------ | ------ |
| 1     | alone                | Phase 0 + 1, plus  | Opus   |
|       |                      | a `mountSite` stub |        |
| 2     | 5 at the same time   | Phase 2 styles     | Sonnet |
|       |                      | Phase 3 script     | Opus   |
|       |                      | Phase 4 Rust       | Sonnet |
|       |                      | Phase 5 editor     | Fable  |
|       |                      | Phase 7 CI, deploy | Sonnet |
| 3     | 2 at the same time   | Merge the five and | Opus   |
|       |                      | wire them together |        |
|       |                      | Phase 6 tests      | Sonnet |
| 4     | alone, with you      | Phase 8 cutover    | Opus   |

Stage 1 has to finish first because everything else builds on its
layout and config. The editor port sets the total time; the other
stage 2 sessions finish before it, so more sessions would not help.

## Where the repo is today

- `index.html` (1,791 lines): the live site. ~1,080 lines of inline CSS,
  ~195 lines of inline JS, the rest is content.
- `dev/index.html` (1,933 lines, untracked): the portfolio editor. ~635
  lines of inline CSS, ~1,255 lines of inline JS.
- No build step, no package.json, no tests, no linting, no CI, no
  `.gitignore` (`.DS_Store` is committed).
- Vercel deploys `main` as static files.
- Installed locally: Node 24, pnpm, cargo, rustc, wasm-pack.

## The standards (same for every project)

Outcomes to tick off at the end, not tasks, so no model tag.

- [ ] TypeScript, modular, strict tsconfig
- [ ] All code in `src/`; the app itself in `exe/`
- [ ] One symbol per file; constants may share a file
- [ ] SCSS, modular (`@use` partials)
- [ ] Positioning/orientation maths in a small Rust library, used from
      TypeScript through wasm
- [ ] 79 column lines, 4 space indent
- [ ] Config: `.vscode`, `.editorconfig`, Vitest, smoke tests, strict
      tsconfig, linting/formatting, CI, pre-commit hooks

## Target layout

```
exe/                    the app: HTML shells and thin entry points
    index.html          site content (served at /)
    main.ts             imports mountSite from src and calls it
    img/                site images
    public/             files served as-is (CV pdf)
    dev/
        index.html      editor shell (served at /dev/)
        main.ts
src/
    site/               one symbol per file, e.g. openPanel.ts
    editor/             one symbol per file, grouped in folders
    shared/             symbols used by both apps
    styles/             SCSS partials + site.scss / editor.scss
    geometry/           Rust crate (Cargo.toml, src/*.rs)
    smoke/              Playwright smoke tests
```

Vite runs with `root: exe`, so `exe/index.html` builds to `/` and
`exe/dev/index.html` to `/dev/`, the same URLs as now.

## Things that will break if ignored

- [x] **The editor edits `index.html` at the repo root** through the
      GitHub API and uploads images to `img/`. Both paths move to
      `exe/`. Port the editor in the same change as the move. `[Opus]`
- [x] **The editor preview assumes a self-contained page.** It puts the
      page in an iframe `srcdoc` and pokes at the site's inline globals
      (`overlay`, `panels`, `activePanel`). With external CSS/JS that
      stops working. Fix: the site exposes `mountSite(doc, options)`;
      the editor imports it plus the compiled site CSS and mounts both
      into the iframe. `[Fable]`
      As built, this differs from the original plan of a frame with no
      `allow-same-origin`. The frame is `allow-same-origin allow-scripts`
      and the editor calls `mountSite` from outside, so wasm loads and the
      preview has the effects. `script-src 'none'` in the page is what
      stops its markup from running code next to the token; the frame
      could read the token if that policy were ever removed.
- [ ] **Vercel has no build configured.** Needs a build command, `dist`
      as output, and Rust + wasm-pack available during the build.
      `[Opus]`
- [x] **Editor publishes must not fail CI.** The editor writes
      `exe/index.html` with its own whitespace, so exclude that file
      from the Prettier check. `[Haiku]`
- [ ] **Do not publish from the old editor during the migration**; it
      would recreate a root `index.html`. `[you]`

## Found during stage 1

- [ ] **Mobile panels are cut off on the live site** (seen in Chromium's
      Pixel 7 emulation, not yet on a real phone). The page lays out at
      556px on a 412px screen, so case panels lose about 144px on the
      right. `.hero-gradient` looks like the cause. The mobile baseline
      records this as it is, so a fix will show as a difference and
      needs a recapture. `[you]`
- [ ] **Root `index.html` has an uncommitted topnav change** that is not
      live, so the baseline does not include it. The comparison can't
      see it either: it only shows on scroll, and the screenshots hide
      the topnav once scrolled. Check it by eye. `[you]`
- [ ] **`/dev/` is a 404 on the live site** because `dev/` was never
      committed. Cutover makes the editor public for the first time.
      `[you]`

Visual comparison: `pnpm baseline:compare`. The screenshots are from
macOS Chromium, so it is a local check and does not belong in CI.

## Found during stage 3

- [ ] **Nothing is committed yet.** All stages share one working tree on
      `standards-migration`. The hook is tested with real commits in a
      throwaway copy, and CI's commands pass there from a fresh checkout,
      but the workflow itself has never run on GitHub, so that box stays
      open until it has. `[you]`
- [ ] **First real Vercel build is untested.** Its commands work on macOS
      from an empty environment; Vercel itself runs Linux. pnpm 10 switches
      itself to the pinned 12.6.0, but pnpm 9 fails with `packages field
      missing or empty`. This project should get 10; if that error
      appears, set `ENABLE_EXPERIMENTAL_COREPACK=1`. `installCommand` is
      exactly at Vercel's 256 character limit. `[you]`
- [ ] **The preview security change needs your yes** (see "The editor
      preview assumes a self-contained page" above). `[you]`

## Phase 0 — safety net

- [x] Work on a branch (`standards-migration`) `[Haiku]`
- [ ] Verify on a Vercel preview before merging `[Haiku]`
- [x] Capture baseline screenshots of the live site (desktop + mobile,
      each section, each case panel open) to compare against later
      `[Sonnet]`
- [x] Add `.gitignore` (node_modules, dist, target, wasm pkg, .DS_Store)
      and untrack `.DS_Store` `[Haiku]`
- [x] Fix `Joep-Groenteman-portfolio.code-workspace` (lists `.` twice)
      `[Haiku]`

## Phase 1 — tooling and config

- [x] `package.json` with pnpm; scripts: `dev`, `build`, `preview`,
      `typecheck`, `lint`, `format`, `test`, `smoke`, `wasm` `[Sonnet]`
- [x] Vite config: `root: exe`, two HTML inputs, SCSS, wasm plugin
      `[Opus]`
- [x] `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`,
      `exactOptionalPropertyTypes`, `noImplicitOverride`,
      `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`
      `[Haiku]`
- [x] `.editorconfig`: 4 spaces, max line length 79, LF, final newline
      `[Haiku]`
- [x] Prettier: `printWidth: 79`, `tabWidth: 4` `[Haiku]`
- [x] ESLint with typescript-eslint strict type-checked rules
      `[Sonnet]`
- [x] Lint rule enforcing one export per file, with `constants.ts`
      exempt, and file name equal to symbol name `[Opus]`
- [x] Stylelint for SCSS `[Sonnet]`
- [x] `rustfmt.toml` with `max_width = 79`; clippy with warnings denied
      `[Haiku]`
- [x] `.vscode/settings.json` (format on save, ruler at 79, tab size 4,
      formatters per language) and `.vscode/extensions.json` `[Haiku]`
- [x] Vitest config (jsdom) with coverage `[Sonnet]`
- [x] Playwright config that runs against `vite preview` `[Sonnet]`

## Phase 2 — site styles to SCSS

Move the inline `<style>` out of `index.html` without changing output.

- [x] `src/styles/abstracts/`: `_tokens.scss` (the `:root` variables),
      `_breakpoints.scss` (640 / 800 / 900px), `_mixins.scss`
      `[Sonnet]`
- [x] `src/styles/base/`: reset, typography, focus, `.sr-only`,
      skip link `[Sonnet]`
- [x] `src/styles/site/`: one partial per block — progress, rail,
      topnav, hero, hero-entrance, magnetic, case-tilt, section-head,
      cases, about, contact, overlay, panel, cv-entries, footer
      `[Sonnet]`
- [x] `src/styles/site.scss` entry that `@use`s the partials `[Haiku]`
- [x] Move the 2 inline `style=""` attributes into partials `[Sonnet]`
- [x] Compare against the Phase 0 screenshots `[Opus]`

## Phase 3 — site script to TypeScript

One symbol per file under `src/site/`.

- [x] `mountSite.ts` — wires everything; takes the document so the
      editor preview can reuse it `[Opus]`
- [x] `prefersReducedMotion.ts` `[Haiku]`
- [x] `attachCaseTilt.ts`, `attachMagneticHover.ts` `[Sonnet]`
- [x] `attachScrollProgress.ts`, `attachTopnavScroll.ts` `[Sonnet]`
- [x] `observeRail.ts`, `observeCaseReveal.ts` `[Sonnet]`
- [x] `attachPanels.ts`, `openPanel.ts`, `showPanel.ts`, `closePanel.ts`,
      `stepPanel.ts`, `getFocusable.ts`, `trapFocus.ts`, `PanelState.ts`
      `[Opus]`
- [x] `attachHeroGlow.ts` `[Sonnet]`
- [x] `constants.ts` — tilt max, magnetic factors, glow range and
      easing, observer thresholds `[Haiku]`
- [x] `exe/main.ts` and the `<script type="module">` tag in
      `exe/index.html` `[Sonnet]`

## Phase 4 — geometry in Rust

Crate at `src/geometry/`, one function per `.rs` file, re-exported from
`lib.rs`, built with wasm-pack.

Each function works on one axis and returns a number, so calls from
JavaScript allocate nothing; call it once per axis. The last item waits
for the Phase 3 files to exist.

- [x] `tilt` — pointer position in a rect to rotateX/rotateY degrees
      `[Sonnet]`
- [x] `magnetic_offset` — pointer offset from a rect centre to a
      translate `[Sonnet]`
- [x] `glow_target` — pointer position in the viewport to the glow
      offset `[Sonnet]`
- [x] `ease_toward` — one easing step toward a target `[Sonnet]`
- [x] `scroll_progress` — scroll position to a 0–100 percentage
      `[Sonnet]`
- [x] `cargo test` unit tests for each `[Sonnet]`
- [x] `src/site/loadGeometry.ts` — loads the wasm once; the effects
      attach after it resolves and are skipped if it fails, so the page
      never depends on wasm to be readable `[Opus]`
- [x] Replace the inline maths in the Phase 3 files with these calls
      `[Sonnet]`

## Phase 5 — port the editor

Same treatment for `dev/index.html`; the largest piece of work.

- [x] Styles into `src/styles/editor/`: buttons, layout, forms, rows,
      image-field, messages, login, publish-dialog; shared tokens come
      from `abstracts/` `[Sonnet]`
- [x] Script into `src/editor/`, one symbol per file, in folders that
      follow the current sections: `github/`, `draft/`, `markup/`,
      `document/`, `fields/`, `lists/`, `views/`, `shell/`, `preview/`,
      `publish/`, `screens/` `[Fable]`
- [x] Replace the module-level `let` state with one typed
      `EditorState` passed to the functions that need it `[Fable]`
- [x] `constants.ts`: repo, branch, API URL, live URL, token key,
      required selectors, and the new `SITE_ROOT = 'exe/'` `[Sonnet]`
- [x] Read and publish `exe/index.html`; list and upload `exe/img/`
      `[Opus]`
- [x] Rebuild the preview on `mountSite` (see "will break" above)
      `[Fable]`
- [x] Keep the conflict check, draft restore and required-selector
      guard behaving exactly as now `[Fable]`

## Phase 6 — tests

- [x] Vitest, next to the symbol (`openPanel.test.ts`): focus trap and
      focus return, panel stepping wrap-around, `toMarkup`/`fromMarkup`
      round trip, `uniqueImagePath`, `validate`, renumbering `[Sonnet]`
- [x] Vitest against the wasm build for the geometry bindings
      `[Sonnet]`
- [x] Smoke, site: loads with no console errors; four sections render;
      a case panel opens, traps focus, closes on Escape and returns
      focus; rail links scroll `[Sonnet]`
- [x] Smoke, editor: `/dev/` shows the login screen without a token
      `[Sonnet]`
- [x] Smoke, accessibility: axe run on the site and on an open panel
      `[Sonnet]`

## Phase 7 — CI, hooks, deploy

- [ ] GitHub Actions on push and PR: install, wasm build, format check,
      ESLint, Stylelint, `cargo fmt --check`, clippy, typecheck,
      Vitest, `cargo test`, build, smoke `[Sonnet]`
- [x] Husky + lint-staged pre-commit: format and lint staged files;
      typecheck `[Sonnet]`
- [ ] `vercel.json`: build command, `dist` output, install step that
      provides Rust and wasm-pack `[Opus]`
- [ ] Branch protection on `main` requiring CI — but the editor pushes
      straight to `main`, so either leave `main` unprotected or allow
      the editor's token to bypass `[you]`

## Phase 8 — cutover

- [ ] Vercel preview matches the Phase 0 screenshots `[Opus]`
- [ ] On the preview: edit text and upload an image in the editor,
      publish, confirm the commit touches only `exe/` `[Opus]` `[you]`
- [ ] Merge, confirm the live site and `/dev/` `[Sonnet]`
- [ ] Delete the root `index.html`, `img/` and `dev/` `[Haiku]`
- [ ] README: how to run, test, build, and the standards above
      `[Sonnet]`

## Phase 9 — accessibility fixes

From the accessibility test on 2026-11-06. axe finds nothing; these came
from the manual checks. The first four are in the root `index.html` too,
so the live site most likely has them.

Do this phase after the cutover. The fixes change how the page looks, so
the Phase 8 comparison would fail on them. Once they are live, recapture
with `pnpm baseline:capture`.

### Must fix

- [ ] **About section runs off the screen on phones** (WCAG 1.4.10).
      `.about-grid` stays two columns at every width, so at 320–412px
      the skills text is cut off with no way to scroll to it. Collapse
      to one column below `$md` in `_about.scss` `[Sonnet]`
- [ ] **"Get in touch" is off-screen on phones.** `.hero-gradient`
      widens the page, so the fixed top bar is laid out 600–670px wide
      on a 360–412px screen. Clip the glow (`overflow-x: clip` on
      `#intro` or `html`). Same cause as "Mobile panels are cut off"
      under stage 1; tick both `[Sonnet]`
- [ ] Check both fixes on a real phone; so far they are only seen in
      Chromium's phone emulation `[you]`
- [ ] **Hero text contrast drops below 4.5:1** (WCAG 1.4.3).
      `.hero-sub` and the `.eyebrow` sit on the blue glow: 3.97:1 at
      412px, 4.14:1 at 1280px with the pointer near the text. Lighten
      `--text-muted` there or dim the glow, then measure again at 412,
      820 and 1280px `[Opus]`
- [ ] **The work is invisible without JavaScript.** `.case` starts at
      `opacity: 0` and only a script adds `.in-view`. Hide the cases
      only once the script is running, for example behind a class it
      sets on `<html>` `[Sonnet]`
- [ ] Give the case studies and the CV a way to be read without
      JavaScript; today the overlay stays `hidden` `[Opus]`

### Should fix

- [ ] Targets to at least 24px high: `.panel-nav button` (15px),
      `.rail-item` (20px), `.contact-link` (23px). They pass WCAG 2.5.8
      only through the spacing exception `[Sonnet]`
- [ ] The top bar is see-through and sits over scrolling text below
      `$lg`, so the logo and link are briefly unreadable. Give it a
      background there, or let it scroll away `[Opus]`
- [ ] Forced colours: the rail's inactive lines vanish because they are
      drawn with `background`. Draw them with a border `[Sonnet]`
- [ ] "Hard skills" and "Soft skills" are list items styled as
      headings. Make them real headings above two lists. The editor
      reads and writes `li.skills-heading` in `viewAbout.ts`, so both
      change together `[Opus]`
- [ ] Alt text that does not match its image `[you]`:
    - EAA card: says "shown on a laptop screen"; the image is two
      report covers. Suggested: "Covers of two WCAG 2.2 audit reports,
      one for Zwitserleven and one for Reaal"
    - EAA panel: says "prepared for Reaal, dated 15 May 2025"; 15 May
      is the Zwitserleven cover, Reaal's is 5 June
    - The Line panel: says "showing alternative routes"; the image is
      the landing page reading "Take the other road"
- [ ] CV PDF: tagged, with title and language, but its 20 figure tags
      have no alt text. Add alt text or mark them decorative, then check
      in Acrobat or PAC `[you]`

### Editor

- [ ] `aria-label` on `<main id="editor">`; axe reports it as a
      duplicate landmark beside the preview's `<main>` `[Sonnet]`
- [ ] Tab walks the preview frame's 11 links after the last field.
      Take the preview out of the tab order `[Sonnet]`
- [ ] Login: tie the error to the token field with `aria-describedby`
      and `aria-invalid` `[Sonnet]`

### Tests, so these stay fixed

- [ ] Smoke, accessibility: axe on all five panels and on a phone
      viewport, not just the home page and one panel `[Sonnet]`
- [ ] Smoke: no text past the right edge at 320px and 412px `[Sonnet]`
- [ ] Smoke: the cases are visible with JavaScript off `[Sonnet]`
- [ ] Screen reader pass with VoiceOver, on desktop and on a phone;
      the test above did not cover one `[you]`

## Decisions to confirm before starting

All three are `[you]`.

1. **`src/` vs `exe/`.** Read here as: `exe/` holds what gets served
   (HTML, entry files, images) and `src/` holds every module. Say so if
   you meant something else.
2. **Rust on Vercel.** Recommended: install rustup + wasm-pack in the
   Vercel build. Alternative: build in GitHub Actions and deploy the
   prebuilt output.
3. **Site content stays in HTML.** The editor works by editing the
   page's DOM, so case studies stay as markup in `exe/index.html`
   rather than moving into TypeScript data.
