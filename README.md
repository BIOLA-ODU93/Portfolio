# Abiola Oduyemi — Portfolio

A one-page editorial portfolio built with [Astro](https://astro.build). It outputs fast static HTML and uses almost no JavaScript.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production files → dist/
```

## Edit your content

**All text lives in one file: [`src/content/site.ts`](src/content/site.ts).** You shouldn't need to touch the components.

- Text in `[square brackets]` is a **placeholder**. It shows on the page with a dashed outline. Replace the text, remove the brackets, and the outline goes away.
- Wrap a word in `*asterisks*` to set it in the italic serif accent, for example `'to the *screen*.'`
- **Projects:** add, remove or reorder entries in `work.projects`. `outcomes: []` hides the Outcomes row, so only add real results. `liveUrl: ''` hides the "Visit live site" button.
- **Images:** put files in `public/images/work/` and set `src: '/images/work/my-image.jpg'`. With an empty `src`, a labelled frame shows the recommended export size:
  - `wide` → 2400 × 1500 (16:10) · `tall` → 1600 × 2000 (4:5) · `square` → 1800 × 1800 (1:1)
- **Social links:** set each `href`. Links with no URL are flagged while editing and hidden in the production build.
- **CV:** put a PDF in `public/` and set `contact.cv: '/your-cv.pdf'`.

## The atlas (hero)

The hero is a 3D map you move through by scrolling: **About me → Graphic works → Brand identities → UI & web**.

- Copy for each stop (title, kicker, text, button) is in `atlas` in `site.ts`.
- **Projects show up on the map automatically.** Each project's `category` (`graphics`, `identity` or `ui`) puts it in a district. It takes the next free poster, mark or screen there, gets a pin that links to its case study, and the first image in its `media` appears on that prop.
- Each district has 4–5 prop slots. To add more, add entries to `props` in `src/components/Atlas.astro`, where the district positions, camera angles and placeholder art live.
- Your portrait (`about.portrait.src`) also appears on the About plaza.
- With "reduce motion" switched on, the camera cuts between locations instead of gliding.

## Structure

```
src/
  content/site.ts        ← all copy, projects, links
  components/            ← one component per section + small helpers
    Header.astro         fixed header + full-screen chapter menu
    Atlas.astro          01 Opening — scroll-driven 3D map
    About.astro          02 About me + five-year timeline
    Work.astro           03 Project index + case studies
    ProjectCase.astro    one case study (reused per project)
    Media.astro          image or labelled placeholder
    Process.astro        04 How I work
    Next.astro           05 What's next
    Contact.astro        06 Contact + footer
  styles/global.css      design tokens (colour, type, spacing)
  scripts/main.ts        menu, scroll reveals, journey progress
  scripts/atlas.ts       the atlas camera
```

## Design tokens

Everything is defined at the top of `src/styles/global.css`.

**Colour: cool and quiet**

| Token | Value | Use |
| --- | --- | --- |
| `--night` | `#0c1014` | dark sections, text |
| `--fog` | `#e8ecee` | light sections |
| `--mist` | `#c5d2db` | closing section |
| `--accent` | `#9fbfd4` | glacier blue: pins, active states on dark |
| `--accent-ink` | `#34566e` | accent for text on light (passes AA) |

**Type: a fluid modular scale**

- `--fs-n1` … `--fs-7` follow a ratio of 1.2 at 320px that grows to 1.333 at 1600px, with a base of 16px → 18px. Every size scales smoothly between those widths.
- Components only use the **role tokens**: `--type-label`, `--type-small`, `--type-body`, `--type-lede`, `--type-h4`, `--type-h3`, `--type-h2`, `--type-display` and `--type-hero`.
- To retune the whole site, change a role (for example, point `--type-h2` at `--fs-5`). To change the overall contrast between small and large text, change the scale itself.

Fonts: **Cormorant Garamond** (display) and **Inter** (text), both from Google Fonts.

## Accessibility & motion

- Skip link, semantic landmarks, one `h1`, and an ordered heading structure.
- Visible focus rings on every interactive element. The menu is a native `<dialog>`, so it traps focus and closes with Esc.
- `prefers-reduced-motion` turns off the route drawing, reveals and pulses. Everything stays visible.
- The page works without JavaScript. JS only adds enhancements.

## Deploy

Before deploying, set `site` in `astro.config.mjs` to your domain. Then deploy the `dist/` folder to Netlify, Vercel, Cloudflare Pages or GitHub Pages. Each detects Astro automatically.
