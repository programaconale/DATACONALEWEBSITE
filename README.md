# Alejandro Marcano Van Grieken — Portfolio

A quiet, single-scroll portfolio: white, black and grays, one continuous surface.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no WebGL, no runtime third-party scripts.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-check + lint)
npm start          # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) at build time so Open Graph image URLs are absolute.

## Content

Every word comes from `resume.pdf` and lives in **`src/lib/data.ts`**: `PROFILE`, `NAV`, `SKILL_GROUPS`,
`EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`, `ACHIEVEMENTS`. Components only read from it.

Not in the résumé, so not on the site:

| Item | Status |
| --- | --- |
| GitHub / LinkedIn | Provided directly (not in the PDF): `PROFILE.github` / `PROFILE.linkedin`. |
| Community | Provided directly (not in the PDF): `COMMUNITY` (Volta Run Club, Active Mar Menor, Seijas Fit Box). |
| Certifications | `CERTIFICATIONS` is empty, so the section is not rendered and section numbers skip it. Add entries to bring it back. |
| Project repos | `PROJECTS[].github` is `null`. Add a URL to show "View on GitHub ↗". |

The **Work** panels are concrete deliverables named in the résumé's experience bullets (and the thesis). Each one is labelled with
its company. The mini interfaces beside them are grayscale sketches labelled "Illustrative UI", not screenshots.

The ID card's `ID No.` (`AMVG-2019`: initials and graduation year) and `Dept.` (current discipline) are derived from the résumé.

## Sections

| # | Section | Component | Signature motion |
| --- | --- | --- | --- |
| — | Hero | `hero/Hero.tsx` | Looping intro video multiplied into the paper, outlined ghost name, ▶/❚❚ sound button. Pauses below 35 % visibility. |
| 01 | About | `sections/About.tsx` | Lanyard ID card: damped pendulum driven by pointer velocity, idle sway, 3D flip (hover / tap / Enter). |
| 02 | Skills | `sections/Skills.tsx` | Periodic table with a diagonal wave reveal, family filter, sticky inspector with brand logos. |
| 03 | Work | `sections/Work.tsx` | Expanding accordion gallery with a clip-path wipe on the illustrative UI. It becomes a vertical accordion on mobile. |
| 04 | Community | `sections/Community.tsx` | Browser windows with real captures of the community sites: grayscale at rest, colour and a full-page scroll on hover (auto on touch). Rebuild captures with `node scripts/capture-community.cjs`. |
| — | Certifications | `sections/Certifications.tsx` | Ink-flood index (only rendered when data exists). |
| 05 | Experience | `sections/Experience.tsx` | Timeline spine drawn by scroll progress; stops light up as it reaches them. |
| 06 | Achievements | `sections/Achievements.tsx` | Pinned horizontal gallery, count-up numbers, the centre card lifts. |
| 07 | Contact | `sections/Contact.tsx` | Letters hop under the cursor, copy-email chip, spinning "say hello" badge, footer. |

Shared pieces: `Navigation.tsx` (glass pill, sliding ink indicator, progress bar, clip-path mobile menu), `ui/RevealObserver.tsx`
(`.rv` / `.rv-mask` reveals), `ui/SectionHead.tsx`, `ui/TechLogo.tsx` (`BRAND`, `CONCEPT`, `isBrand()`), `ui/MiniUI.tsx`.
Hooks live in `src/lib/hooks.ts` (`useInView`, `useScrollProgress`, `prefersReducedMotion`) and Lenis lives in `src/lib/scroll.tsx`
(`ScrollProvider`, `scrollToTarget`, `lockScroll`).

`prefers-reduced-motion` disables Lenis, the reveals, the pendulum, the count-ups and the pinning (Achievements becomes a plain
scroll row). The hero video doesn't autoplay; the ▶ button starts it.

## Rebuilding the hero video

Requirements: `ffmpeg` (libx264, libvpx-vp9, libopus), Python 3 with `numpy`. For WebP output: ffmpeg with libwebp, `cwebp`, or
`pip install pillow`.

```bash
python3 scripts/build-hero-assets.py                    # uses ./intro.mp4 (or .mov) and ./IMG_1237.JPG
python3 scripts/build-hero-assets.py --src my.mov --photo me.jpg --seconds 10 --fade 0.5
python3 scripts/build-hero-assets.py --crop 800:1000:560:80 --levels 0.9   # manual overrides
```

What it does:

1. **Detects the person.** It builds a dark-on-light mask against a per-row backdrop estimate, unions the box over frames, and
   crops head to toe, centred. The crop is scaled to 960 px tall and padded to 768×960.
2. **Whitens the backdrop.** `colorlevels` `imax` is measured from the backdrop, vignette included, and the crop edges are
   feathered into white, so `mix-blend-mode: multiply` makes the background vanish into the page.
3. **Makes the loop seamless.** The last 0.5 s is cross-faded into the first 0.5 s: `xfade` for the picture, and an equal-power,
   sample-accurate cross-fade in numpy for the audio. Nothing is stretched or retimed, so lips stay in sync.
4. **Exports:**
   - `public/hero/hero.webm` (VP9 CRF 36 + Opus 80k) and `hero.mp4` (H.264 CRF 24, slow, AAC 96k, +faststart).
   - `public/hero/poster.webp`.
   - `public/portrait-bust.webp` (480×600 head-to-shirt crop of the photo, or of the sharpest frame when no photo is given).
   - `public/og.jpg` (1200×630).

## Brand logos: credits and licences

Logos are trademarks of their owners and are used only to identify the technologies listed in the résumé.

- **Devicon** (`public/logos/*.svg`, "original" variants). MIT License, © 2015 konpa. See
  `public/logos/LICENSE-devicon.txt`. https://devicon.dev
- **Simple Icons** (`snowflake`, `googlebigquery`, `langchain`, `qlik`, `googleanalytics`, `airtable`, `framer`, `glide`, `n8n`).
  CC0 1.0. See `public/logos/LICENSE-simple-icons.md`. https://simpleicons.org. Paths are filled with each brand's official
  colour.
- No freely licensed logo was available for Microsoft Fabric, DBT, OpenAI, Power BI, Tableau, Looker Studio, JasperReports and
  FlutterFlow. Those tiles show their periodic symbol in a neutral outline instead of an imitation logo.
- Concept icons (ETL, Data Warehouse, LLMs, Agile, Embeddings, trophy and similar) are original thin-line SVGs in `TechLogo.tsx`.

## Fonts

Self-hosted from `src/fonts` via `next/font/local`, all under the SIL Open Font License 1.1:

- Inter Tight (variable): display and body.
- Instrument Serif (regular and italic): one accent word per heading.
- JetBrains Mono (variable): labels, indices and numbers.
