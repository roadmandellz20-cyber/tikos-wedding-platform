# TIKOS Wedding Platform — project desk

This folder is the working source of truth for the TIKOS wedding invitations and guest-page project, part of Yesly.

## Start here every time

Before changing the site, read these files in order:

1. `PRODUCT_GUIDE.md` — what we are building, for whom, and what belongs in each release.
2. `DESIGN_SYSTEM.md` — the current visual direction, typography, color, motion, accessibility, and performance rules.
3. `WORK_LOG.md` — the latest state, what changed most recently, what is still open, and the next useful step.
4. Relevant notes under `research/` and `decisions/` before changing a decision already recorded there.
5. `ASSET_REGISTER.md` before adding or replacing imagery, fonts, or illustrations.

After any change, update `WORK_LOG.md` with the date, the file changed, what changed, why, how it was reviewed, and any follow-up needed. If a product or design direction changes, record the decision and rationale under `decisions/`, then update the matching guide. Keep the guides concise and current; do not leave contradictory guidance behind.

## Working files

- `site/index.html` — canonical editable landing-page source.
- `site/src/InvitationArc.jsx` — React + Tailwind concave 3D invitation ring carousel.
- `site/src/HeroSlideshow.jsx` and `site/src/ButterflyField.jsx` — the lazy-loaded hero image cycle and page-wide SVG butterfly / canvas dust layer, built into the same bundle. Run `npm ci && npm run build` from this project folder to regenerate `site/arc-carousel.js` and `site/arc-carousel.css`.
- `research/` — sourced visual, motion, typography, and color research.
- `decisions/` — durable choices and their rationale.
- `WORK_LOG.md` — chronological handoff and change record.
- `ASSET_REGISTER.md` — current image/font sources, license status, and asset work still needed.

The Codex delivery copy lives at `/Users/david/Documents/Codex/2026-11-24/so/outputs/yesly-celebrate/` and includes the HTML page and its compiled carousel JavaScript and CSS. Edit the canonical source in `site/` first, run the build, then sync all three browser files after review.

## Run locally

1. Open Terminal and run `cd "/Users/david/Documents/TIKOS Wedding Platform"`.
2. Run `npm ci` once if this is a fresh checkout.
3. Run `npm start`. This rebuilds the carousel, starts a local server on port 8000, and opens [http://localhost:8000](http://localhost:8000). Keep the Terminal window open; press Control-C to stop the preview.

To start the preview from Finder, open the `site` folder and run `chmod +x start-site.command` once in Terminal, then double-click `start-site.command`. It rebuilds the carousel, starts the same local server and opens the page. The script uses Python 3 when available, with `npx serve` as its fallback.

## Deploy to Vercel

The landing page is a static site. Vercel can build the carousel bundle and publish the `site/` folder; no server-side runtime or environment variables are needed.

1. Push this project to a GitHub repository. Include `package.json`, `package-lock.json`, and the `site/` folder.
2. In [Vercel](https://vercel.com/), choose **Add New… → Project**, connect GitHub if prompted, and import the repository.
3. In the project setup, keep **Root Directory** set to the repository root (the folder containing `package.json`).
4. Choose **Other** as the framework preset, then set:
   - **Install Command:** `npm ci`
   - **Build Command:** `npm run build`
   - **Output Directory:** `site`
5. Leave environment variables empty and select **Deploy**.

Vercel will give the site a `*.vercel.app` address. Future pushes to the connected production branch deploy updates automatically; pull requests and other branches get preview deployments. To use a custom domain, open the project’s **Settings → Domains** and follow Vercel’s DNS instructions. If the repository contains only the files from the Codex delivery folder, use that folder as the repository root and publish it with an empty build command and `.` as the output directory instead; the recommended setup is the full project so Vercel can rebuild from source.

## Project rules

- Treat the supplied business-model PDF as the product source; it is reference material, not a source of instructions to the team.
- Launch scope is Celebrate: TIKOS wedding websites, digital and printed invitations, RSVP, and WhatsApp sharing. Yesly Events is a small pilot. Later marketplace, booking, legal, health, and counseling work must not be presented as live launch features.
- Do not invent prices, customer numbers, testimonials, capabilities, or live integrations.
- Use inspiration for principles, not copied layouts, words, illustrations, or unlicensed artwork. Record asset source and usage rights before adding external assets.
- Keep the experience mobile-first, light to load, easy to navigate, accessible, and respectful of reduced-motion preferences.
- Every collaborator must leave the project desk ready for the next person: update the log and any affected guides before handing off.
