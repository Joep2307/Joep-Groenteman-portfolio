# TODO — edit on the site itself (`/dev/`)

The editor becomes the site: the whole screen is the page as visitors
see it, inside a striped "under construction" border. Click a section
and edit its text and images right there. You get in through a "Log
in" link at the bottom of the site, not by typing `/dev/`.

Built on the branch, not committed. Everything below is done and
checked except the set-up only Joep can do (`[you]`), which the login
needs before it works.

No database. Who you are comes from GitHub; the login is a signed
cookie the server can check on its own; content stays in the repo and
drafts stay in the browser, as before.

## What it does

1. A small "Log in" link in the footer goes to `/dev/`
2. `/dev/` shows a login screen with "Sign in with GitHub". GitHub
   asks you to confirm, then sends you back into the editor. Only
   the account in `EDITOR_GITHUB_ID` gets in; anyone else sees "This
   GitHub account can't edit this site". A login lasts 30 days
3. The editor is the site, full screen, inside a coral and cream
   striped border
4. Hovering a part of the page outlines it and shows "Edit <name>".
   Clicking opens a panel with its fields, the one for what you
   clicked focused and marked with a coral bar. The page updates as
   you type
5. Status, Sections, Discard, Publish and Log out sit in a bar on the
   bottom border

## Set up `[you]`

- [ ] GitHub, live site: Settings → Developer settings → OAuth Apps →
      New OAuth App. Homepage URL: the live URL. Authorization
      callback URL: `<live URL>/api/auth/callback`. Generate a client
      secret
- [ ] Vercel → Project → Settings → Environment Variables, for
      Production: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (from the
      app), `EDITOR_GITHUB_ID` (the `id` number at
      `https://api.github.com/users/Joep2307`), `SESSION_SECRET`
      (`openssl rand -base64 32`). `GITHUB_TOKEN` stays. Delete
      `EDITOR_PASSWORD`. Redeploy
- [ ] After the deploy, open `<live URL>/api/auth/me`. JSON saying
      "Not logged in." is right; a Vercel error page means the
      function did not build (see "Risk" below)
- [ ] Local, optional: a second OAuth App with callback
      `http://localhost:5173/api/auth/callback`, and the same four
      variables (with its id and secret) plus `GITHUB_TOKEN` in
      `.env.local` in the repo root (ignored by git). `pnpm dev`
      serves `api/` itself, no Vercel CLI needed

Preview deployments get their own URL, which GitHub will not send you
back to, so sign-in works on the live site and locally only.

Risk: Vercel builds `api/*.ts`, which import `src/server/*.ts` with
`.js` extensions, as Node ES modules need. That is the documented way,
but it could not be tried before deploying. If `/api/auth/me` fails,
the fallback is to move `src/server/` into `api/_lib/`.

## Decisions taken (say so to change them)

- [x] **Stripes**: the site accent and background, 45°, 12px border,
      6px on phones (`src/styles/editor/_tokens.scss`)
- [x] **Login link**: muted text after the copyright line,
      underlined on hover and focus, 44px tall, `rel="nofollow"`
- [x] **Log in before editing**; the server checks the cookie on
      every call, so the login screen is a convenience, not the lock
- [x] **One account**, matched on the numeric id, so a renamed account
      still works and someone taking the old name does not get in
- [x] **30 days** per login
- [x] **The password is gone**: `EDITOR_PASSWORD`, `getPassword`,
      `connect`, `disconnect` and the password field
- [x] **The form editor stays** as "Sections" (bar) / "All sections"
      (panel): the list of every view, for site settings, adding and
      reordering projects and sections

## What was built

Site:

- [x] `exe/index.html`: `<a class="footer-login" href="/dev/"
      rel="nofollow">Log in</a>` in the footer, after `footer span`
- [x] `src/styles/site/_layout.scss`: footer is one row under a rule
      (a `::before` that takes a full row), link quiet until hover

Server (`api/` files are one-line entry points; the code is in
`src/server/`, one symbol per file):

- [x] `api/auth/login.ts` → `handleLogin`: random `state` in a
      10-minute cookie on the callback path, redirect to GitHub with
      no scopes and `allow_signup=false`
- [x] `api/auth/callback.ts` → `handleCallback`: checks `state`,
      swaps the code (`exchangeCode`), asks who you are
      (`fetchGithubUser`), checks the id, sets the session, back to
      `/dev/`. Failures go to `/dev/?login=cancelled|denied|expired|
      error|setup`. The GitHub token is dropped
- [x] `api/auth/me.ts` → `handleMe`: `{ login }`, 401 or 503
- [x] `api/auth/logout.ts` → `handleLogout`: POST, same origin only,
      clears the cookie
- [x] `api/github.ts` → `handleGithub`: the proxy, now behind the
      session cookie, and same origin only for writes
- [x] Session: `signSession` / `verifySession` (HMAC-SHA256 over
      base64url JSON, constant-time compare, expiry),
      `currentSession` (also re-checks `EDITOR_GITHUB_ID`). Cookies
      are `HttpOnly; SameSite=Lax`, `Secure` on https
- [x] `apiDevServer`: a Vite plugin so `pnpm dev` serves `api/` with
      `.env.local`, like Vercel does

Editor:

- [x] Every GitHub call goes through the proxy; the browser holds no
      secret. `start` asks `/api/auth/me` first; a 401 at any point,
      publishing included, goes to the login screen with the draft
      kept
- [x] `renderLogin` / `loginMessage`: the login screen and the
      reasons; `logOut` in the bar
- [x] `renderEditor`: `main.workspace` (the frame and the panel) and
      the bar, on a striped body. Preview toggle and
      `STACKED_MAX_WIDTH_PX` removed
- [x] `src/editor/stage/`: `editTargets` (what can be clicked),
      `attachEditTargets` (marks them in the frame after each redraw,
      hover outline and label, click capture on the frame's window),
      `editTargetOf`, `nodeOf`, `fieldFor`, `openFromPage`,
      `openDrawer`, `closeDrawer`, `showSections`, `toggleSections`,
      `markTarget`
- [x] `previewDocument` numbers each element (`data-node`) so a click
      finds the element of the page it came from; `registerField`
      (in `textField`, `richField`, `imageField` and the project
      title) maps that element to its input
- [x] Clicks on case study controls (close, previous, next), the
      scrim and the rail still work, so case studies can be opened
      and edited (`PAGE_CONTROLS`)

Different from the plan:

- No injected "Edit" buttons per section for the keyboard. Instead:
  Enter on any link in the page opens its part like a click, and
  "Sections" in the bar lists every part. The injected buttons would
  have changed the page's own markup and focus order
- The panel pushes the page narrower on wide screens (at 1100px and
  up) and covers the lower 62% on smaller ones

## Checked

- [x] Unit: `src/server/session.test.ts`, `auth.test.ts`,
      `handleGithub.test.ts` (replaces `proxy.test.ts`),
      `src/editor/stage/stage.test.ts`. 96 tests pass
- [x] Smoke: footer link, login screen, refused sign-in, the stage,
      click hero → Intro with Title focused → typing changes the
      page → Escape closes, click a case card → that project without
      opening its case study, Sections → Site settings, axe on the
      login screen and on the open panel. 20 pass
- [x] `pnpm typecheck`, `pnpm lint`, `npx prettier --check .`
- [x] Looked at 320, 412, 820 and 1280px: no horizontal scroll
- [x] `pnpm dev`: `/api/auth/login`, `/me` and `/logout` answer, with
      cookies set and read through the dev server
- [ ] Known: at 320px the frame is 308px wide, and the site's own
      top bar crowds there (name against "Get in touch"). It is the
      site below its smallest width, not the editor
- [ ] Not committed; the visual baseline is not recaptured (the
      footer changed)

---

# TODO — redesign (branch `redesign`)

Rounds 1, 2 and 3 are implemented on the branch, not committed. Open:
the two unticked items in phase 4, and the round 3 questions for Joep
at the end of that section.
The standards-migration plan further down is the older, separate plan.

## Palette

| Role       | Value     | Replaces  |
| ---------- | --------- | --------- |
| Background | `#fef7e6` | `#0a0a0a` |
| Text       | `#0533d3` | `#f2f1ec` |
| Accent     | `#f65135` | `#8094ff` |

The site goes from dark to light. Contrast, worked out by hand and to
be confirmed by the axe smoke test:

| Pair                 | Ratio   | Good for                        |
| -------------------- | ------- | ------------------------------- |
| Text on background   | ~8.1:1  | Everything (AAA)                |
| Accent on background | ~3.2:1  | Large text, icons, borders only |
| Accent on text blue  | ~2.5:1  | Nothing readable                |
| Background on accent | ~3.2:1  | Large text only                 |

So the accent cannot carry small text. Today it does, in 11 places
(eyebrow, section numbers, case and panel tags, CV role, skills
headings, contact email, active rail item, hover states).

## Decisions

All four went ahead with the recommended option. One change from
the plan: the hero glow is accent only, because the blue tint turned
grey where it met the orange. Also found: the top navigation used
`mix-blend-mode: difference`, which only works on a dark page, so it
is removed.

1. **Scope.** Read here as: new palette on the existing layout and
   type. Say so if layout, typography or content should change too.
2. **Small accent text.** Recommended: small labels turn text blue,
   the accent stays on large type (hero `em`, contact email), rules,
   borders, the progress bar and hover or active states paired with
   an underline or weight change. Alternative: keep accent labels and
   accept failing AA.
3. **Editor at `/dev/`.** It shares the site's tokens, so it turns
   light too. Recommended: let it. Alternative: pin the editor to the
   old dark tokens.
4. **Hero glow.** Recommended: keep it, recoloured to soft accent and
   blue tints on cream. Alternative: drop it for a flat background.

## Phase 1 — tokens

- [x] `src/styles/abstracts/_tokens.scss`: `--bg`, `--text`,
      `--accent` to the palette above
- [x] Derive the rest from those three: `--bg-alt` and `--bg-card`
      (cream a step darker and a step lighter), `--text-muted` and
      `--text-dim` (blue mixed toward cream, both kept at 4.5:1 or
      better), `--border` (blue at low alpha), `--accent-soft`,
      `--accent-dim`
- [x] `color-scheme: light` on `:root`, and a `theme-color` meta in
      `exe/index.html` and `exe/dev/index.html`

## Phase 2 — site, colours the tokens do not reach

- [x] `_hero-gradient.scss`: three hard-coded blue glows; a 95%
      opacity blur tuned for black needs retuning on cream
- [x] `_overlay.scss`: near-black scrim behind the case panel
- [x] `_cases.scss`: white 2% stripe pattern is invisible on cream
- [x] Small accent text, per decision 2
- [x] Walk every partial in `src/styles/site/` and `src/styles/base/`
      for things that only worked on dark: focus ring, skip link,
      selection, topnav background on scroll, panel shadows, case
      hover glow, progress bar
- [x] `img/logo.svg` favicon and any image or SVG drawn for a dark
      page

## Phase 3 — editor

- [x] `src/styles/editor/_tokens.scss`: `--danger` and `--warn` are
      pastels for a dark page and unreadable on cream; `--danger`
      also has to stay distinct from the red-orange accent
- [x] `--text-muted`, `--border`, `--border-strong` overrides
- [x] `_forms.scss` hard-coded `#8a8a8a`, `_publish-dialog.scss`
      near-black scrim
- [x] `preview.scss`: the in-editor preview matches the new site

## Phase 4 — verify

- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test`
- [x] `pnpm smoke`, which runs in CI and includes the axe contrast
      check; `site.smoke.ts` asserts on link colour visibility
- [x] Look at it: desktop and mobile, every section, an open case
      panel, the editor login, editor and publish dialog
- [ ] `src/smoke/baseline/` holds screenshots of the dark design, so
      `pnpm baseline:compare` fails on purpose now. Recapture once
      the design is signed off; `baseline:capture` points at the live
      site, so it needs the local build or the preview URL instead
- [ ] Vercel preview of the branch `[you]`

## Not touched

- Root `index.html` and `dev/index.html`: the pre-migration copies,
  still waiting on the cutover below.
- Layout, type, content and the Rust geometry, unless decision 1
  changes.

## Round 2 — shapes, no gradients, wide titles

Asked for on 2026-11-14: abstract shapes that move a bit under the
mouse, no gradients anywhere, CW Grotesk Wide for the titles.

### Shapes

- [x] Hero: replace `.hero-gradient` with a cluster of flat shapes
      (disc, ring, half disc, quarter, pill, triangle, dot) in the
      three palette colours plus one flat peach tint
- [x] Contact: a smaller cluster, desktop only
- [x] Shapes never sit behind text, at any width
- [x] Motion: each shape drifts with the pointer by its own depth and
      is pushed away when the pointer comes close; eased, paused
      off-screen, off under reduced motion
- [x] Maths in Rust: `parallax_offset` (replaces `glow_target`, same
      formula) and a new `repel_offset`, with Rust and binding tests
- [x] `attachShapes` replaces `attachHeroGlow`
- [x] Smoke test: a shape moves away from the pointer

### Gradients out

- [x] `_hero-gradient.scss` deleted
- [x] Case image: flat background, no stripe pattern, no glow; the
      `.glow` element leaves the page and the editor's card template
- [x] Panel image background and the scroll cue line: flat

### Type

- [x] Body text: Inter, the closest free match to Helvetica, loaded
      from Google Fonts in place of Roboto; Helvetica Neue,
      Helvetica and Arial are the fallbacks

- [x] `--display` starts with `'CW Grotesk Wide'`, Space Grotesk stays
      as the fallback
- [x] ~~The font files are not on this machine or in the repo~~
      Superseded by round 3: the display font is Archivo
- [x] ~~Once the files are in: `@font-face`, self-hosted~~ Superseded
      by round 3

## Round 3 — Swiss / Bauhaus poster restyle `[Opus]`

Asked for on 2026-11-14. Done on 2026-11-14 in the working tree, not
committed, baseline not recaptured: both wait for Joep's sign-off.
Phase 7 (dark mode) left out, as the default says.

#### How it came out, and where it departs from the brief

- **Button hover.** The brief asks for a coral fill with white text.
  White on coral measures 3.47:1 and charcoal on coral 4.07:1, both
  under 4.5:1 for 0.875rem labels. Hover is a blue fill with cream
  text (7.9:1) and a coral rim instead. Say so to accept the failing
  contrast and use the brief's version (`button` mixin in
  `abstracts/_mixins.scss`)
- **Stacked pills.** Read as: the upper pill sits 64px in from the
  edge with its round end showing, the lower one runs off the edge
  with its round end left. Both are one `.shape` drawn with a
  pseudo-element, so the drift moves them together. Below `$lg` they
  move above the title, smaller, and the title starts lower
- **Half-circles.** True half-discs (29px wide, 58px tall), one
  `.shape` with two pseudo-elements, in the bottom padding of
  `#contact` so they never meet text
- **Hero title size.** Above `$lg` it is sized from the width left
  beside the pills, `(100vw - 490px) / 8.2`, up to 7.5rem; below,
  9.4vw. 8rem only fits from about 1550px
- **Pointer drift** kept and toned down: `SHAPE_DRIFT_PX` 70 → 40,
  repel 42 → 24, reach 280 → 240. A shape now moves at most about
  36px; `--shape-overhang` is 48px
- **Motion.** The hero fade-up, the eyebrow pulse and the scroll-cue
  pulse are gone (`_hero-entrance.scss` deleted). Kept: the case
  reveal, case tilt, magnetic hover, panel slide, and the shapes'
  400ms slide-in
- **Contact icons** are CSS masks on `::before` / `::after` (mail,
  LinkedIn for `linkedin.com` links, an arrow for any other link), so
  the markup and the editor did not change
- **Panel** keeps a scrim, the body text colour at 40%, no blur; the
  close button is a cream pill on it
- **Case images** keep 4:3 with `object-fit: cover`; all four source
  images are 4:3, so nothing is lost. Panel images show whole
- **No mono font.** JetBrains Mono is dropped; the editor shows file
  paths in the system monospace (`--font-mono`)
- **No extra shape reuse.** Two motifs only, one per screen height
- **Also fixed on the way** (ticked in Phase 9 below): about grid on
  phones, the top bar width on phones, a background on the top bar
  below `$lg`, 24px targets, and the rail lines in forced colours
- **Smoke tests changed to the new design:** the shape test reads
  `.shape-pills` and waits for the slide-in; the tilt test hovers at
  16px into the image, since the rounded corner clips the very corner;
  the progress bar no longer catches the pointer
- **Checked** with lint, typecheck, unit, Rust and smoke tests (axe
  included), and screenshots at 320, 412, 640, 820, 901, 1000, 1280,
  1440 and 1920px: no horizontal scroll and no shape over text at any
  of them. The editor preview checked with the working-tree page.
  Reduced motion: no animation, no drift, no transition

Restyle the site in the style below. Keep all content, structure and
functionality. Change only the visual layer: SCSS, and markup only
where a layout change needs it. Every token is a CSS custom property
so the style is easy to tweak later.

### The brief

**1. Overall feel.** Flat, bold, editorial, a bit playful. A modern
take on Swiss and Bauhaus graphic design: warm paper background, one
strong ultramarine for type, one coral accent for chunky geometric
shapes, calm dark-grey body text. No gradients, no drop shadows, no
glassmorphism, no textures. It should read as a well-designed printed
poster or CV translated to the web: confident and graphic, still
clean and readable, lots of breathing room.

**2. Colour.** Three colours plus neutrals:

| Token                | Value     | Use                               |
| -------------------- | --------- | --------------------------------- |
| `--color-bg`         | `#FCF5E6` | Page background, everywhere       |
| `--color-primary`    | `#1A33D1` | Display type, headings, labels,   |
|                      |           | links                             |
| `--color-accent`     | `#E4603F` | Shapes, icon discs, small         |
|                      |           | highlights, hover states          |
| `--color-text`       | `#2B2B2B` | Body text and sub-headings        |
| `--color-text-muted` | `#4A4A4A` | Secondary info: dates, places     |
| `--color-rule`       | `#3A3A3A` | Thin divider lines                |
| `--color-on-accent`  | `#FFFFFF` | Icons and glyphs on coral         |

- Blue is for type. Never a large background fill.
- Coral is for shapes and small UI accents. Never body text; its
  contrast on cream is too low.
- The background stays cream. No white cards, no grey panels.
  Sections are separated by space and thin rules, not boxes.
- Optional dark mode: background `#14181F`, blue `#4D66FF`, coral
  unchanged, text `#F3EDE0`.

**3. Typography.** Two families.

Display, for the name, section headings, role labels and big
statements:

- Extra-wide, extra-heavy grotesk. Preferred: Archivo variable at
  width 125, weight 800–900. Alternatives: Unbounded 800, or the paid
  Monument Extended / Druk Wide.
- Always uppercase, colour `--color-primary`.
- Line-height 0.85–0.9, letter-spacing -0.01em to -0.02em, so
  stacked lines almost touch.
- Hero: about `clamp(3.5rem, 11vw, 8rem)`, over two lines,
  left-aligned.
- Section headings: about `clamp(1.75rem, 3.5vw, 2.5rem)`.
- Small role labels: about 1.75rem, stacked over two lines,
  right-aligned, tight leading.

Text, for body, sub-headings and metadata:

- A neutral, friendly sans: Roboto or Inter.
- Body: 1rem–1.0625rem, weight 400, line-height 1.55,
  `--color-text`.
- Item titles (job, degree, project names): weight 700, about
  1.125rem, `--color-text`, not blue. The hierarchy is blue display
  heading, bold charcoal title, regular grey detail.
- Metadata (organisation | date): regular, `--color-text-muted`,
  with a vertical bar as separator.
- Bullet lists: 0.875–0.9375rem, small round black bullets,
  line-height about 1.7, indented under the title.
- All body text left-aligned. Never justified.

**4. Layout and spacing.**

- Content width about 1100px, centred, side padding
  `clamp(1.5rem, 6vw, 5rem)`.
- Asymmetric two-column grid on desktop. Hero: the big title
  top-left; under it, supporting details on the left and a
  right-aligned role label with a short intro on the right. Content
  sections: a blue heading, then items in two columns (a main item
  left, secondary items right).
- 4–6rem between sections, 1.5–2rem between items in a section.
- 1px `--color-rule` dividers between major sections, inside the
  content column, not edge to edge.
- Mobile: one column, the huge title kept (scaled by the clamp), the
  shapes kept but smaller so they never cover text.

**5. Signature shapes — the most important part of this style.**
Flat coral forms that bleed off the edge of the viewport. CSS
(border-radius on elements) or inline SVG, absolutely positioned,
`aria-hidden="true"`, `pointer-events: none`.

- a) Top-right "stacked pills": two thick horizontal blocks, one on
  top of the other, flush against the right edge of the page. The
  upper block has a fully rounded right end. The lower block has a
  fully rounded left end and overlaps the upper one slightly, so
  together they read as an abstract "S" or "2". Each about 70px tall
  and 180–200px wide on desktop. Beside the hero title, roughly
  level with it.
- b) Bottom-left "triple half-circles": three solid D-shapes (flat
  side left, round side right) in a row, overlapping by about 40%,
  flush against the left edge of the page. About 55–60px tall. Next
  to the last section heading or the footer.
- Reuse the two motifs sparingly: a single half-disc beside a
  section heading, a pill as a hover underline. At most one or two
  shapes per screen height. Punctuation, not wallpaper.

**6. Components.**

- Images: rounded corners, radius about 16px. No border, no shadow.
  (The brief's "square" is about the portrait; do not crop project
  images to square.)
- Contact rows: a solid coral circle, about 28px, holding a white
  line icon, then the text in body style, 0.75rem gap; 0.75rem
  between rows.
- Links: blue, underline 2px thick with 0.2em offset. Hover: the
  underline turns coral. Focus: 2px solid `--color-primary`, 3px
  offset.
- Buttons: display font, uppercase, 0.875rem, blue text on cream,
  2px blue border, full pill radius. Hover: coral fill, white text,
  coral border.
- Skills: plain bulleted lists in two columns. No chips or badges.
- Project cards: no boxes. Image with 16px radius, bold charcoal
  title, muted meta line, short body. Separated by whitespace or a
  thin rule.

**7. Motion — minimal.**

- Links and buttons: a 150–200ms colour transition.
- Optional: shapes slide in 20–30px from their page edge on load,
  400ms ease-out.
- All of it off under `prefers-reduced-motion`.

**8. Accessibility.**

- Blue on cream is fine at any text size.
- White on coral is about 3.3:1: icons and large or bold text only.
- No essential information in coral alone.
- Semantic headings stay: h1, h2 for sections, h3 for item titles.

**9. Don'ts.**

- No gradients, shadows, blur, glass, or outlines around sections.
- No extra accent colours; no greens, purples or greys as UI fills.
- No lowercase display headings. No blue body text.
- No centred or justified body text.
- No rounded "card UI" look. Graphic and editorial, not a dashboard.

### Reading the brief for this site

The brief describes a CV page. This site is a portfolio: hero, work,
about, contact, plus case and CV panels. Content stays, so map by
role, do not add or move content:

| Brief                    | Here                                   |
| ------------------------ | -------------------------------------- |
| Hero name, two lines     | `.hero-title` ("Design for /           |
|                          | everyone."), which already breaks in   |
|                          | two. It stays the h1                   |
| Role label               | `#intro .eyebrow`                      |
| Intro paragraph          | `.hero-sub`                            |
| Details under the name   | `.hero-meta`                           |
| Portrait                 | None in the hero. Do not add one; the  |
|                          | 16px radius goes on the images that    |
|                          | exist                                  |
| Section headings         | `.section-title`, `.contact-title`     |
| Items in two columns     | `.cases`, `.about-grid`, CV entries    |
| Item titles              | Case titles, CV job and degree names   |
| Metadata with a bar      | Case tags and meta, CV org and dates   |
| Contact rows with discs  | `.socials` and the contact details     |
| Buttons                  | `.contact-link` in the top bar,        |
|                          | `.panel-nav` and `.panel-close`        |
| Skills                   | `.skills-list`                         |
| Cards                    | `.case`                                |
| Shape (a)                | `.hero-shapes` in `#intro`             |
| Shape (b)                | `.contact-shapes` in `#contact`, the   |
|                          | last section                           |

### What this changes compared with rounds 1 and 2

- Body text goes from blue to charcoal. Today `--text` is the blue
  and is used for everything; it splits into primary (type that
  shouts) and text (type that reads). Every `var(--text)` needs a
  decision.
- Palette values shift slightly (`#fef7e6` to `#FCF5E6`, `#0533d3`
  to `#1A33D1`, `#f65135` to `#E4603F`).
- `--bg-alt`, `--bg-card` and `--accent-tint` go. `--border` (blue
  at low alpha) becomes `--color-rule`.
- Display font becomes Archivo. That closes the two open CW Grotesk
  Wide items in round 2; tick them off as superseded.
- The round 2 shape clusters (disc, quarter, ring, half, pill,
  triangle, dot; seven in the hero, four in contact) are replaced by
  the two motifs. Far fewer shapes, coral only, bleeding off the
  page edge.
- **Pointer effects.** Round 2 added shapes that drift with and
  dodge the pointer; the site also tilts case cards and has magnetic
  hover. The brief says keep functionality and also says keep motion
  minimal. Default for this session: keep the scripts and the Rust
  untouched, give the new shapes `data-depth` so `attachShapes`
  still moves them, and tune the amounts down in
  `src/site/constants.ts` if they read as too much. Joep decides
  whether they go (see the open items).

### Phase 1 — tokens

- [x] `src/styles/abstracts/_tokens.scss`: the seven `--color-*`
      tokens, replacing `--bg`, `--text`, `--accent` and their
      derivatives. Rename at every use; leave no aliases
- [x] Non-colour tokens, so partials hold no magic numbers:
      `--font-display`, `--font-body`, `--font-mono`; display
      weight, width, line-height and letter-spacing; the three
      display sizes; body, title, meta and list sizes and
      line-heights; `--content-width` (1100px), `--page-padding`,
      `--space-section`, `--space-item`; `--rule-width` (1px),
      `--radius-image` (16px), `--radius-pill`; `--underline-width`
      (2px), `--underline-offset` (0.2em); `--transition-color`
- [x] `--scrim` (case panel overlay) has no place in the palette.
      Make the panel a full cream sheet with no scrim, or derive the
      scrim from `--color-text` at an alpha; pick what reads as
      print
- [x] `src/styles/editor/_tokens.scss` overrides follow the rename.
      `--danger` stays distinct from coral
- [x] `theme-color` meta in `exe/index.html` and `exe/dev/index.html`
      to `#FCF5E6`

### Phase 2 — type

- [x] Load Archivo from Google Fonts with the width axis, in both
      HTML files, replacing Space Grotesk:
      `family=Archivo:wdth,wght@125,800..900`. Check the URL returns
      the wide cut before relying on it
- [x] A display mixin in `abstracts/_mixins.scss`: the family,
      `font-stretch: 125%`, weight, uppercase, `--color-primary`,
      the tight line-height and letter-spacing. Use it on
      `.hero-title`, section headings, the eyebrow, `.contact-title`
      and buttons
- [x] Uppercase in CSS only. The HTML keeps its casing, for screen
      readers and for the editor
- [x] `.hero-title` has an `em` on "everyone" that round 1 coloured
      with the accent. Display type is blue; coral is not for type.
      Make it blue and drop the italic if Archivo has none at that
      width; if the word needs emphasis, use a shape (a pill
      underline), not colour
- [x] Wide black caps are far wider than today's titles. Check every
      display size from 320px up: "EVERYONE." at 11vw and the long
      project titles are the risk. Lower the clamp minimum rather
      than let anything overflow or break mid-word
- [x] Body: Inter stays (the brief allows it), 1rem–1.0625rem, 400,
      1.55, charcoal
- [x] Item titles 700 / 1.125rem charcoal; metadata regular and
      muted with a bar separator; lists small with round bullets and
      1.7 line-height
- [x] The bar separator: where the markup already has separate
      elements, draw it in CSS (a border or `::before`), so no
      content changes. Where it is typed into the text, leave the
      text alone
- [x] JetBrains Mono is loaded and used for small labels. The brief
      has two families. Move those labels to the body or display
      style and drop the font, unless something is real code

### Phase 3 — layout

- [x] One content column: `--content-width`, centred,
      `--page-padding` at the sides, used by every section
- [x] The fixed left rail and the top bar predate this layout. Keep
      both working; make sure the rail does not collide with the
      centred column or with shape (b) on the left edge
- [x] Hero grid on desktop: title top-left across the width; below,
      `.hero-meta` left, eyebrow (right-aligned, two lines) and
      `.hero-sub` right. Grid placement only, no reordering in the
      HTML unless reading order would otherwise be wrong
- [x] Work: cases in two columns, no boxes, whitespace or a rule
      between them
- [x] About: bio and skills in the asymmetric two columns; skills in
      two columns of plain bullets. `.about-grid` already overflows
      on phones (Phase 9 below, "About section runs off the
      screen"); the one-column collapse fixes it, tick that item too
- [x] Section spacing 4–6rem, item spacing 1.5–2rem
- [x] A 1px rule between major sections, inside the column
- [x] One column below the existing breakpoints in
      `abstracts/_breakpoints.scss`; add none unless needed
- [x] `html` or `main` clips horizontal overflow, so shapes bleeding
      off the edge never widen the page (also Phase 9, "Get in
      touch is off-screen")

### Phase 4 — shapes

- [x] `exe/index.html`: replace the seven spans in `.hero-shapes`
      with the stacked pills, and the four in `.contact-shapes` with
      the triple half-circles. Keep the `.shapes` / `.shape` /
      `data-depth` contract that `src/site/attachShapes.ts` reads;
      read it first
- [x] `_shapes.scss`: rebuild for the two motifs, sizes from tokens.
      Pills: ~70px by 180–200px, flush right, upper rounded right,
      lower rounded left and overlapping. Half-circles: three,
      ~55–60px tall, 40% overlap, flush left
- [x] "Flush against the edge" means the viewport edge, not the
      content column. The sections are inside a centred column now,
      so position against a full-width wrapper
- [x] Pointer drift must not pull a flush shape away from its edge
      and show a gap. Let the shape extend past the edge by at least
      the maximum drift
- [x] Smaller on mobile, and never over text at any width. Check
      320, 412, 820, 1280px
- [x] Optional load animation: slide in 20–30px from the edge,
      400ms ease-out. It must compose with the transform
      `attachShapes` sets (animate a wrapper, or a separate
      property), and be off under reduced motion
- [x] At most one extra reuse: for example a half-disc beside one
      section heading. Count shapes per screen height; two is the
      ceiling
- [x] `src/smoke/` has a test that a shape moves away from the
      pointer. Keep it passing against the new markup
- [x] The editor preview mounts the same page; check the shapes
      there

### Phase 5 — components

- [x] Links (`_reset.scss` or a new `base/_links.scss`): blue,
      2px underline, 0.2em offset, coral underline on hover, colour
      transition from the token
- [x] `_focus.scss`: 2px solid `--color-primary`, 3px offset,
      everywhere, including on coral
- [x] Buttons: one mixin for the pill button; apply to
      `.contact-link`, `.panel-nav button`, `.panel-close`. Keep
      targets at 24px high or more
- [x] `_cases.scss`, `_case-tilt.scss`: image at `--radius-image`,
      bold charcoal title, muted meta, short body. No background, no
      border, no shadow, no hover glow. Case tags lose any chip look
      and become meta text
- [x] `_contact.scss`: rows with a 28px coral disc and a white line
      icon. If the markup has no icons, add inline SVG icons with
      `aria-hidden`, and mirror that in the editor (Phase 6). The
      email stays a link and stays the same text
- [x] `_about.scss`, `_cv-entries.scss`: titles, meta, lists per the
      type rules; entries divided by space or rules
- [x] `_panel.scss`, `_overlay.scss`: cream, flat, same column and
      type rules as the page
- [x] `_topnav.scss`, `_rail.scss`, `_progress.scss`: blue labels;
      coral for active and hover, always paired with a second cue
      (underline, weight, a shape)
- [x] `_skip-link.scss`, selection colour
- [x] `exe/img/logo.svg`: the new palette values
- [x] Search `src/styles/` for `gradient`, `box-shadow`,
      `text-shadow`, `backdrop-filter`, `filter:`, `blur`, `outline`
      on sections, `text-align: center`, `justify`. Remove what the
      brief forbids
- [x] Search for hex and `rgb(` literals outside the token files;
      there should be none

### Phase 6 — markup and the editor

The editor at `/dev/` reads and writes `exe/index.html`, so markup is
not free to change.

- [x] Before touching markup, read `REQUIRED_SELECTORS` in
      `src/editor/constants.ts` and the views in
      `src/editor/views/`. Every selector in that list must still
      match
- [x] Any change to case card markup also goes into
      `src/editor/templates/projectCardHtml.ts`, with its test. Same
      for any other template the editor writes (contact rows, CV
      entries)
- [x] Prefer grid placement, pseudo-elements and existing hooks over
      new elements
- [x] `src/styles/preview.scss`: the in-editor preview matches the
      site, Archivo included
- [x] Editor UI in `src/styles/editor/`: the palette, the button and
      link styles, no shadows. Inputs keep a visible boundary of 3:1
      or better; that is a rule line, not a card. UI text in the
      body font, display type on headings only

### Phase 7 — dark mode (optional in the brief)

- [ ] Only if Joep says yes (open items). One
      `prefers-color-scheme: dark` block that reassigns the tokens
      (`#14181F`, `#4D66FF`, coral unchanged, `#F3EDE0`), plus
      `color-scheme: light dark`. Muted and rule colours for dark
      are not given; derive them from the dark text colour and
      measure them

### Phase 8 — verify

- [x] Measure contrast, do not estimate: text, muted and primary on
      bg at 4.5:1 or better; coral on bg and white on coral only on
      shapes, icons and large or bold type
- [x] Heading order unchanged: one h1, h2 per section, h3 for items
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:rust`
- [x] `pnpm smoke`. It includes the axe contrast check, and
      `src/smoke/site.smoke.ts` asserts on link colour; if the
      rename breaks an assertion, fix the assertion to the new
      design, do not bend the design to the test
- [x] Look at it in a browser at 320, 412, 820 and 1280px: every
      section, an open case panel, the CV panel, the editor and its
      publish dialog. No horizontal scroll, no clipped display type,
      no shape over text
- [x] Reduced motion: no slide-in, no drift, no transitions. Forced
      colours still usable
- [x] Go down the "Don'ts" list once more against the result
- [x] Do not recapture `src/smoke/baseline/` and do not commit; both
      wait for Joep's sign-off

### Rules of the repo

- SCSS partials with `@use`, 79 columns, 4 spaces. Stylelint and
  Prettier must pass
- TypeScript: one symbol per file, file name equals symbol name
- No new dependencies
- Leave the root `index.html` and `dev/index.html` alone; they are
  the pre-migration copies

### Open, needs Joep `[you]`

None of these block the session; each has a default.

- [ ] **Pointer effects**: shapes that dodge the pointer, tilting
      case cards, magnetic hover. Default: kept, toned down. Say so
      if "minimal motion" means they should go; that also removes
      Rust and TypeScript, not just styles
- [ ] **Dark mode**: default is to leave it out
- [ ] **Hero**: the brief puts a name and a portrait there; the site
      has "Design for everyone." and no portrait. Default: keep the
      current content. Say so if the hero should become your name
      with a photo
- [ ] **Display font**: Archivo is the free option. If you own
      Monument Extended or Druk Wide, put the files in `exe/` and
      say so

## Round 4 — more shapes through the site

Asked for on 2026-11-14: a few more abstract shapes down the page, not
only in the hero and contact. Same language as round 3: flat accent
forms, sizes from tokens, never behind text, at most two per screen
height. No editor changes: every group is a direct child of a fixed
section, outside the case markup the editor writes.

- [x] The rule over each section head works as a ground line. Shapes
      stand on it, in the empty gap the previous section leaves
      above it, so they clear text at every width
- [x] Work: a dot and a bar on the rule, the bar running off the
      right edge
- [x] About: a half disc (dome) on the rule, at the column's left
      end
- [x] Work, wide screens only: a quarter disc in the right margin
      halfway down the cases, shown only where the margin is wide
      enough for it
- [x] Content in every section sits above the shapes (`z-index`),
      not just in intro and contact
- [x] Tokens for the new sizes, smaller on phones; drift stays under
      `--shape-overhang` for shapes that bleed off the edge
- [x] Check 320, 390, 1000, 1440px; lint, tests, smoke

### More (asked for on 2026-11-14)

- [x] Contact: three dots, large to small, on the rule at the
      column's right end
- [x] Work margin, wide screens: a column of three small dots near
      the top of the cases and a half disc bleeding off the right
      edge near the bottom, around the quarter disc halfway
- [x] About margin, wide screens: a ring, halfway down
- [x] The margin shapes share one class, hidden below the width
      where the margin has room; rename `.cases-shapes`
- [x] Still two per screen height at most; check 390, 1000, 1440,
      1920px; lint, tests, smoke

---

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
      247 characters; Vercel's limit is 256. Vercel sets `CARGO_HOME`,
      so the commands find cargo through it, not `$HOME/.cargo`. `[you]`
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
- [x] Smoke, editor: `/dev/` opens without a password; it is only
      asked for when publishing
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

- [x] **About section runs off the screen on phones** (WCAG 1.4.10).
      `.about-grid` stays two columns at every width, so at 320–412px
      the skills text is cut off with no way to scroll to it. Collapse
      to one column below `$md` in `_about.scss` `[Sonnet]`
- [x] **"Get in touch" is off-screen on phones.** `.hero-gradient`
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

- [x] Targets to at least 24px high: `.panel-nav button` (15px),
      `.rail-item` (20px), `.contact-link` (23px). They pass WCAG 2.5.8
      only through the spacing exception `[Sonnet]`
- [x] The top bar is see-through and sits over scrolling text below
      `$lg`, so the logo and link are briefly unreadable. Give it a
      background there, or let it scroll away `[Opus]`
- [x] Forced colours: the rail's inactive lines vanish because they are
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
