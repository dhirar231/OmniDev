# Omni Dev website

A static, responsive Astro website for Omni Dev: custom software for businesses and products for everyday users. All website source, dependencies, documentation, and build output live in this folder.

## Run locally

Use **Node.js 24 LTS** and npm.

```sh
cd OmniDev
npm ci
npm run dev
```

Open `http://localhost:4321`. No database or backend is needed.

```sh
npm run check       # Astro and TypeScript checks
npm run build       # Static output in dist/
npm run preview     # Serve the production build locally
npx playwright install chromium
npm test            # Browser interactions, responsive layout, axe accessibility
```

Tests use the built site, so build first. The default tests expect the unconfigured contact/download mode. Automated accessibility checks supplement, rather than replace, manual accessibility review.

## Configuration and launch details

Copy `.env.example` to `.env` or configure the equivalent build environment variables on your host:

| Variable               | Purpose                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`             | Final public HTTPS origin, e.g. your actual domain. Used for canonical URLs, Open Graph, sitemap, and robots.          |
| `PUBLIC_CONTACT_EMAIL` | Public business mailbox. Leave empty to use the explicitly labeled local brief-download mode. Never put a secret here. |

The reserved `https://omnidev.example` address is an intentional placeholder. Until replaced, the build has `noindex,nofollow` and a disallow-all robots file. A real `SITE_URL` enables indexing. Rebuild after configuration changes.

### Contact behavior

- With no public email configured, the form validates and downloads a text project brief. The page explicitly says it is **not sent**. This is usable preparation, not a simulated successful enquiry.
- With `PUBLIC_CONTACT_EMAIL`, the form prepares a `mailto:` draft in the visitor's email app. The visitor reviews and sends it. A direct email link is also shown. This needs a configured mail app; long messages can exceed mail-client URL limits, so the direct email link is a fallback.
- Form values are not sent to a server, saved to local storage, or tracked. Fonts are self-hosted. No external form service is required for the included workflow.
- If you want submissions delivered without a mail app, replace the submit handler in `src/scripts/main.ts` with a real backend/provider integration, add server-side validation and appropriate delivery/error states, and update the adjacent privacy copy. Keep provider secrets server-side. There is no preconfigured external endpoint.

### Content still needed

1. Final domain and public contact mailbox.
2. Confirm public distribution status and official links for **1% Better Daily** and **Facterly**. The website marks release/download information as unconfirmed.
3. Confirm product naming and which project summaries you want published. Business examples currently omit client and institution identities.
4. Optional company location, legal name, social profiles, and team information. No invented addresses, people, client endorsements, or metrics were added.
5. Confirm that the proposed collaboration process matches your business practice. It is an approach, not a claim about historical engagements or a support SLA.

See `docs/workspace-review.md` for source evidence, selection decisions, and limits of the review. That internal document is not copied into the built site.

## Deployment

The GitHub Pages deployment is at **https://dhirar231.github.io/OmniDev/**.

Pushing to `main` runs `.github/workflows/deploy.yml`, builds the site, and publishes `dist/` using GitHub Actions. The workflow sets `SITE_URL=https://dhirar231.github.io` and `BASE_PATH=/OmniDev`. Set the optional `PUBLIC_CONTACT_EMAIL` repository variable under Settings → Secrets and variables → Actions → Variables, then rerun the workflow to enable email drafts.

For other hosts, `BASE_PATH` defaults to `/`. Set it to the deployment subdirectory when needed. Canonical URLs, metadata, assets, and the sitemap account for this prefix.

For Netlify, Vercel, Cloudflare Pages, or another static host:

1. Set the project root to `OmniDev` (or the repository root if deploying this folder alone).
2. Set Node.js to 24 and build command to `npm run build`.
3. Set the output/publish directory to `dist`.
4. Configure `SITE_URL` and `PUBLIC_CONTACT_EMAIL` as build environment variables.
5. Deploy over HTTPS and verify canonical/social URLs and the contact workflow on the actual domain.

For a conventional web server, upload **only the contents of `dist/`** to its document root. No SPA fallback, server adapter, or runtime Node process is required. Do not upload the workspace, local `.env`, documentation, tests, or dependencies. The internal workspace review is excluded from Git to keep the public repository focused on the website.

## Structure and editing

```text
src/pages/index.astro        Main landing page and metadata
src/pages/robots.txt.ts      Build-time crawler policy
src/pages/sitemap.xml.ts     Build-time sitemap
src/components/              Logo, project cards, contact section
src/data/projects.ts        Selected work content
src/styles/global.css       Design tokens, components, responsive styles
src/scripts/main.ts         Menu, filter/history, contact behavior
public/                     Favicon and social sharing card
tests/                      Playwright + axe browser checks
docs/workspace-review.md     Internal evidence and editorial notes
```

The identity uses dark green ink, warm off-white, electric lime, self-hosted DM Sans/Manrope, and geometric visuals built in CSS/SVG. All application previews are clearly marked **illustrative concepts**; no private screenshots or code are published. The social card has an editable SVG source and a compatible 1200×630 PNG used in metadata.

Project details use native HTML disclosures. Core content and navigation remain available without JavaScript. Enhanced filters synchronize to the URL; a product anchor reveals its card even when a category filter previously hid it. Motion respects reduced-motion preferences. Browser tests cover 320, 390, 768, and 1440-pixel widths.

Font licenses are included in the installed `@fontsource-variable` packages (SIL Open Font License). Keep those licenses with any separately redistributed font assets.
