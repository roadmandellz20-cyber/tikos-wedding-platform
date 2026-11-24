# Work log and handoff

## Current checkpoint — 2026-11-24

### What is built

- The one-page launch concept is in `site/index.html` and mirrored with its compiled carousel assets to the Codex output at `outputs/yesly-celebrate/`.
- The page is branded YESLY by TIKOS and focused on the Celebrate release: wedding invitation, mobile guest page, RSVP, WhatsApp sharing, print options, optional add-ons, and a small Yesly Events pilot mention.
- The page has a full-bleed editorial opening with an ambient three-image slideshow and SVG butterfly field, a 10-card edge-to-edge concave invitation ring, guest-page preview, offer cards, process, details, FAQ and closing invitation CTA; responsive layouts, scroll image/text reveals, and reduced-motion handling.
- The RSVP buttons are local demo interactions. WhatsApp opens a sample message only; it does not yet attach a real published invitation URL or send guest data.
- The latest responsive review covers 1440px, 1024px, 768px and 390px. The ring card now starts 72px below its desktop heading and 40px below its mobile heading; mobile neighbors have 30px visible separation. The site header and mobile menu stay above the ring, and anchors land below the header. The current source and compiled delivery copies match. Safari review of SVG wing perspective and physical phone touch testing remain open.

### What changed in this handoff

- Created the project desk with a product guide, design-system guide, research and decision folders, and a change-log workflow.
- The design system records the latest working font and color direction as provisional, not final.

### Start here next

1. Read `README.md`, `PRODUCT_GUIDE.md`, and `DESIGN_SYSTEM.md` before editing.
2. Review reduced-motion behavior and Safari's 3D wing rendering; repeat touch scrolling/dragging on a physical phone when available.
3. Replace placeholder photography and names only when rights-cleared/approved materials are available.
4. Keep the project desk current after every edit and append a dated work entry.

### Known follow-ups

- Validate the font stack and support for intended local languages in actual guest-facing text.
- Replace generic sample imagery with appropriately sourced, rights-cleared imagery that reflects the audience without narrowing the product to one wedding tradition.
- Replace illustrative sample names, date, venue, and sample-share text with real product behavior when available.
- Add real pricing / inquiry path only after the business confirms public rates and contact details.
- Keep future marketplace, legal, health, counseling, and booking features out of launch claims.

#### 2026-11-24 — Narrow phone and language glyph review

- Reviewed the live page at 360px and 390px in Chromium. The hero heading, body copy, primary action, and navigation fit at 360px; the guest preview and offer cards stack cleanly at 390px. The invitation ring keeps the active card prominent and clips the side cards inside its stage. No user-facing horizontal overflow was found.
- Checked representative Gambian Latin characters (`Ɓ Ɗ Ƴ Ŋ ɲ`, `ɓ ɗ ƴ ŋ ɲ`) and accented Latin text in Cormorant Garamond, Manrope, and Italianno using the loaded Google Fonts in Chromium. The samples rendered in the browser. This is a font rendering check only; approved language strings and translations are still needed before launch.
- Checked the carousel's Next control at phone width; it advanced the readout from “The Garden” to “First Light”. Reloaded the current preview and confirmed no console errors. The earlier 404 belonged to an unrelated page visited before the project preview.
- Confirmed `site/index.html`, `site/arc-carousel.js`, and `site/arc-carousel.css` match the three files in the Codex delivery copy. No page or build files needed changes; screenshots and checks used the current generated assets.
- Follow-up: reduced-motion review, Safari 3D wing review, and physical phone touch testing remain open.

#### 2026-11-24 — Ring spacing, navigation and page performance

- Restructured the invitation ring into normal flow below its heading. The active card edge is now exactly `clamp(40px, 5vw, 72px)` after the heading/navigation block; section padding keeps at least `clamp(56px, 8vw, 100px)` after the readout. The current card dimensions are preserved. Neighbor checks at widths 360, 390, 441, 480 and 640px ranged from 18px to 85px apart.
- Isolated the ring stacking context and raised the fixed header to z-index 1000. After scroll, its surface is fully opaque. The mobile header stays fixed, the dropdown keeps light text on the dark panel, its button is 44px square, and anchor checks landed at y=88px on desktop and y=70px on mobile.
- Removed blur filters from scroll reveals and the carousel cards, removed header backdrop blur, reduced card shadows, limited carousel image requests to 700px at q=76, and kept `will-change` on the active card only. Added layout/paint containment on card surfaces. The stage animation updates transform and opacity only.
- Consolidated butterfly/dust animation into one shared frame loop with a 1.5 DPR canvas cap, a reusable 48-particle desktop / 24-particle mobile pool, four butterflies on desktop / two on phones, and no geometry reads inside the loop. It pauses when the document is hidden or both the hero and ring are offscreen. The hero now has six motes, a static first-image HTML fallback, eager first slide and lazy later slides; the unused preload is removed. Guest and closing photos use smaller, lower-quality requests. Long lower sections use `content-visibility: auto` and intrinsic size estimates.
- Added `npm start` and `site/start-site.command`; both rebuild and serve at `http://localhost:8000`, open the browser, and support Ctrl-C to stop. Tested both launch paths, the local page title, and HTTP 200 for the page. When JavaScript is blocked, the static hero image loads and the ten-card HTML fallback remains available; all ten fallback images loaded after scrolling to the ring.
- Rebuilt with `npm run build` and synced `site/index.html`, `site/arc-carousel.js`, and `site/arc-carousel.css` to `/Users/david/Documents/Codex/2026-11-24/so/outputs/yesly-celebrate/`.
- Review screenshots at 1440, 1024, 768 and 390px, plus desktop/mobile ring, 640px breakpoint and mobile menu captures, are in `review/2026-11-24/after/`; baseline screenshots and Lighthouse JSON are in `review/2026-11-24/before/`. Under Chrome DevTools Protocol CPU throttling at 4×, a 3.5-second foreground frame sample at 1440px improved from 8.9 to 59.4 fps. Lighthouse Performance increased from 31 to 76; First Contentful Paint changed from 4.3s to 2.8s, Largest Contentful Paint from 5.9s to 5.0s, Total Blocking Time from 6,490ms to 110ms, and CLS remained 0. Lighthouse used the same local URL and Lighthouse 12.8.2 for both runs. These measurements are desktop-Chrome lab results; frame cadence varies with background system load, and the FPS figure is not a physical-phone guarantee.
- Follow-up: review Safari's 3D wing perspective and test touch scrolling/dragging on a physical phone.

#### 2026-11-24 — Ring reflections, hero contrast and guest page

- Updated `site/src/InvitationArc.jsx` and `site/src/tailwind.css`: the ring stage now clips only horizontally and computes its height from the active card, reflection and reserved tail. The active image and two nearest cards on each side receive a 38% vertically flipped reflection on desktop and a shorter 30% reflection on mobile. The lower-edge highlight, 6px reflection gap, mask fade, card containment and transform/opacity carousel loop remain in place; only the active card gets `will-change`.
- Updated `site/index.html`: added a uniform 32% cocoa hero wash with a stronger left gradient. Pixel sampling on the three slide crops at 1440px found conservative white contrast ratios of 5.39:1 or better for the eyebrow, 4.89:1 or better for the headline, and 9.80:1 or better for the description. The description is 15px on desktop and 14px on mobile.
- Rebuilt the guest preview as a phone-shaped sample over the celebration photograph. Added date/venue, RSVP and WhatsApp callouts; kept “Sample interaction · your reply is not sent” at 12px minimum. Staggered the offer cards, added a full-width process image band using an existing registered photo, and gave the details and FAQ rows distinct paper surfaces. Increased desktop body copy in these sections to 12px. Fixed mobile process-row spacing after the screenshot review showed heading/description overlap.
- Updated `DESIGN_SYSTEM.md` and `ASSET_REGISTER.md`, and recorded the layout and contrast choices in `decisions/2026-11-24-ring-reflection-guest-page-and-hero.md`.
- Rebuilt with `npm run build` and synced `site/index.html`, `site/arc-carousel.js`, and `site/arc-carousel.css` to `/Users/david/Documents/Codex/2026-11-24/so/outputs/yesly-celebrate/`; byte comparisons confirmed all three delivery copies match.
- Chrome geometry and screenshots cover 1440, 1024, 768 and 390px in `review/2026-11-24/ring-reflections/`. Card-to-heading gaps measured 72, 51, 40 and 40px; arrow clearance below the fixed nav was 135, 106, 92 and 77px. Reflection bottoms retained 38px of stage clearance and 58px before the readout; the next section begins 100, 82, 61 and 56px after the readout. At 390px, neighboring cards stayed 30px apart. Scrolled header checks showed fixed position, z-index 1000 and a solid paper background; the mobile menu stayed white on dark taupe, kept a 44px button, and its offer anchor landed below the 70px header.
- With Chrome CPU throttling set to 4×, one carousel advance during a 3.5-second frame sample measured 60.0fps (16.7ms median, 17.3ms 95th-percentile frame interval, no intervals over 24ms). The active image and its reflection both loaded at 700px. Browser console review reported no errors.
- Follow-up: repeat the touch-scroll/drag and Safari 3D review on a physical device/browser when available.


#### 2026-11-24 — Resilient invitation ring and page-wide butterflies

- Fixed the carousel mount mismatch: the build entry now mounts the butterfly field to an existing `#butterfly-field-root` outside the hero. The former hero-only mount was removed.
- Reworked `site/src/ButterflyField.jsx` as a fixed full-viewport field with six butterflies on desktop / three on phones, eased random waypoint steering that avoids the visible hero headline and actions where practical, varied depth and flap speeds, glide holds, and a capped single canvas of warm, additive dust particles. It pauses when the document is hidden and disappears for reduced motion. Pointer input remains available to the page beneath it.
- Hardened `site/src/InvitationArc.jsx`: all ten existing images now use eager loading and async decoding, card backgrounds remain visible behind image loads, cards are larger above 640px, and phone sizes/spacing keep the center card dominant with the neighbors peeking and separated. Updated `site/src/tailwind.css` to preserve 3D clipping with `overflow: clip`, reserve section height, and add the viewport butterfly/dust styling.
- Added a static titled list of all ten designs inside `#invitation-carousel` in `site/index.html`, raised mobile body copy to 16px and utility labels to 12px, gave sample feedback the same readable size, increased the hero headline line height, and reserved mount height to reduce layout shift. No contact details were available to create an honest inquiry destination, so existing offer links remain.
- Built with `npm ci && npm run build`; synced `site/index.html`, `site/arc-carousel.js`, and `site/arc-carousel.css` to `outputs/yesly-celebrate/`. The same image assets remain in use, so `ASSET_REGISTER.md` did not change.
- Review: screenshots at 1440, 1024, 768, 390, and 360px showed ten loaded card photos, a dominant active card, separated mobile neighbors, and no horizontal overflow. Both arrows measure 44 × 44px; the Next button changed the readout from design 01 to design 02. A controlled Chromium pass used `prefers-reduced-motion: reduce` at 390px; the butterfly field is hidden and no console/page errors were captured. Earlier errors in the interactive browser came from the missing root before the fix.
- Open: save a short desktop and 390px screen recording (no recording API was available in the browser control; QuickTime did not get past its open-file panel), and repeat touch scrolling/dragging and Safari 3D checks on a physical device/browser. The inquiry CTA still needs a real approved WhatsApp number or form URL.

### Work entries

#### 2026-11-24 — Ambient hero slideshow and butterfly field

- Replaced the single CSS-drifting hero image with three overlapping, absolute garden images. Added a 7.5-second cycle, 2.5-second opacity crossfade, ten-second slide-specific Ken Burns drift, and page/tab visibility pausing. Slide 1 is preloaded and eager; only the next image receives a source at a time. Responsive 600 / 900 / 1400 / 1800px Unsplash candidates at q=80 keep the phone request smaller.
- Added `site/src/ButterflyField.jsx` with six independent SVG butterflies. Each has separate hinged wing groups, 3D rotateY flapping and varied drift; CSS hides the last two on mobile. Added a single warm radial leak and ten restrained dust motes. The bottom-up scrim remains below the butterflies, and the hero copy sits above them.
- Added `site/src/HeroSlideshow.jsx`; the existing React + Tailwind build mounts both hero components with the carousel. Removed the old flat butterfly SVG and its flight/fold/dust keyframes. No other page section was edited.
- Verified three Unsplash image pages, creators, and Unsplash License status; checked all requested CDN widths returned HTTP 200. Updated `ASSET_REGISTER.md`, `DESIGN_SYSTEM.md`, this README, and `decisions/2026-11-24-hero-atmosphere-and-slideshow.md`.
- Review: browser screenshots at 1440px and 390px; slide 1 and the forest garden slide were reviewed at desktop, and the Nairobi garden portrait was reviewed at phone width. Copy remained legible on the reviewed crops, transitions overlapped without a blank frame, and browser console logs were clean. `prefers-reduced-motion` was false in the preview browser; the OS control could not be operated during review, so a reduced-motion visual pass and a Safari SVG 3D check remain open.
- Rebuilt with `npm run build` and synced `site/index.html`, `site/arc-carousel.js`, and `site/arc-carousel.css` to `outputs/yesly-celebrate/`.

#### 2026-11-24 — Concave 3D invitation ring

- Replaced the convex semi-circle motion with a continuous-position 3D cylinder in `site/src/InvitationArc.jsx`. Cards follow the requested translateX / positive-Z / rotateY geometry around an implied camera inside the ring; the YESLY colors, existing ten designs and titles, and established typography remain in use.
- Added pointer-captured 1:1 dragging, velocity sampled over the last ~100ms, capped inertia, spring settling, looped card angles, fading outer cards, horizontal trackpad wheel, previous/next controls, focused Left/Right keys, and click-to-center / click-selected-to-offer behavior. Reduced motion skips inertia and settles immediately.
- Added `decisions/2026-11-24-concave-ring-carousel.md`; replaced the arc description in `DESIGN_SYSTEM.md`, updated the component reference in this README, and renamed the unchanged invitation-image placements in `ASSET_REGISTER.md` from arc to ring cards.
- Rebuilt with `npm ci && npm run build` and synced `site/index.html`, `site/arc-carousel.js`, and `site/arc-carousel.css` to `outputs/yesly-celebrate/`.
- Review: browser screenshot at approximately 977px wide showed the inner-camera perspective, edge card angle, cropped outer cards, collection controls and readout; one controlled Chromium screenshot at 1440px loaded with no console or page errors. The accessible tree showed ten cards with only the selected card link tabbable. Full visual review at 1024 / 768 / 390px, a phone touch-scroll pass, reduced-motion interaction pass, and hands-on trackpad / drag frame-rate review remain open because the controlled preview session did not complete those viewport and gesture scenarios.

#### 2026-11-24 — Semi-circle invitation carousel

- Rebuilt the former scroll wheel in `site/index.html` as a compact, edge-to-edge arc showcase with a 160vw circle, ten invitation-style cards, the active card centered at 12 o’clock, upright counter-rotation, and 700ms easing.
- Added previous/next circular controls, one-card steps, horizontal pointer swipe, resize-based radius recalculation, active scale/opacity, and keyboard-reachable active-card links. Respects reduced-motion settings.
- Kept wedding-specific titles and “Wedding invitation design” metadata instead of fake retail prices; confirmed pricing is not public in `PRODUCT_GUIDE.md`. Card links lead to the existing offer section.
- Added three additional placeholder Unsplash photos and recorded them in `ASSET_REGISTER.md`. Creator-level attribution and audience fit still need review before production.
- Updated `DESIGN_SYSTEM.md`; the geometry is adapted to the current self-contained landing page so this focused revision does not introduce a new framework/runtime dependency.
- Review: desktop screenshot shows the active design at 12 o’clock and three cards visible along the arc. Tested the next arrow and a horizontal drag; each advances one design and the selected title/index updates. Mobile visual review, reduced-motion check, and the resized-radius check remain open.

#### 2026-11-24 — Brand, cinematic venue and first gallery pass

- Corrected the brand lockup across the site and product guide to **YESLY by TIKOS**.
- Replaced the previous butterfly with a fine-line wing drawing and restrained dust trail.
- Replaced the static photo mosaic with an initial seven-frame scroll-driven gallery; the follow-up arc redesign below supersedes that interaction.
- Changed the hero to a licensed garden ceremony photograph by Jonathan Borba, with a slow pan/zoom and cinematic grade instead of an autoplay video. Added its creator/source in `ASSET_REGISTER.md`.
- Added `research/full-redesign-references.md` notes on the user's framed-photo reference and `decisions/2026-11-24-cinematic-wheel-and-brand.md`; updated the design guide and asset register.
- Review: desktop preview checked after spacing refinements. The arrow control was due for rework in the follow-up arc redesign. Mobile and reduced-motion visual checks remain open. The venue image is a slow-animated still, not a video.

#### 2026-11-24 — Complete editorial interface redesign

- Replaced the prior full-page component styling and blue-hour treatment in `site/index.html` with a new editorial design across all sections: full-bleed opening, story/photo chapters, guest-page preview, offering, process, service details, FAQ, and closing invitation CTA.
- Added a new typography system: Cormorant Garamond display, Manrope utility text, and Italianno script accent inside the sample invitation. Updated the palette to warm bone, taupe, cocoa, near-black and dusty rose based on the supplied references.
- Added staged hero entrance, scroll-triggered text/photo reveals, small butterfly/dust motion, image hover treatment, mobile menu, and reduced-motion behavior.
- Added `research/full-redesign-references.md` and `decisions/2026-11-24-full-editorial-redesign.md`; revised `DESIGN_SYSTEM.md` and `README.md` so the project desk reflects the page-wide direction and current asset guidance.
- Added `ASSET_REGISTER.md` with exact image IDs, font sources, license notes and production follow-ups.
- Synced the canonical page to `/Users/david/Documents/Codex/2026-11-24/so/outputs/yesly-celebrate/index.html`.
- Review: browser accessibility tree covers all primary sections and preview controls; desktop screenshot reviewed at top and full-page length; Google Fonts stylesheet request returned successfully. Mobile visual review, contrast checks at production image crops, local-language glyph review, and final image rights/audience approval remain open.

#### 2026-11-24 — Blue-hour editorial landing page revision

- Added `research/awards-motion-and-story.md` covering CSSDA wedding invitation examples, the supplied Peno Lab reference, and pacing/accessibility lessons.
- Added `research/pinterest-type-color.md` with the reviewed Pinterest links, type cues, licensing caveats, and palette principles.
- Added `decisions/2026-11-24-blue-hour-editorial.md` to record the chosen direction before applying it.
- Updated `DESIGN_SYSTEM.md` and `site/index.html`: replaced the inherited green/wine palette and Instrument Serif/DM Sans pairing with plum dusk, paper, Bodoni Moda, and Manrope; refined the hero photo/invitation composition and entrance timing; kept reduced-motion behavior and clear page actions.
- Synced the reviewed source to `/Users/david/Documents/Codex/2026-11-24/so/outputs/yesly-celebrate/index.html`.
- Review: local desktop preview after the entrance sequence showed the two-line headline, invitation artwork, RSVP cue, navigation, and call to action clearly. Confirmed the Google Fonts stylesheet URL returns successfully. Narrow-mobile visual and local-language glyph review remain follow-ups.

#### 2026-11-24 — Project desk created

- Added `README.md`, `PRODUCT_GUIDE.md`, `DESIGN_SYSTEM.md`, `WORK_LOG.md`, plus `research/` and `decisions/` folders.
- Copied the existing reviewed static page into canonical `site/index.html`.


#### 2026-11-24 — Lightweight ring reflections, phone renders and performance investigation

- Reworked `site/src/tailwind.css` reflections: removed `mask-image`, clipped the fade to the same rounded image shape, used a simple taupe-to-transparent overlay, and kept reflections on the active plus two nearest designs on each side. The existing flipped image remains transform-only and follows its card in the ring.
- Moved the 44 × 44px previous/next controls below the stage and reflection. At 1440/1024/768/390px, active card → reflection gaps are 6/6/7/7px; reflection → arrows are 40/28/40/28px; arrows → readout are 24px. Outer cards retain viewport-edge bleed only.
- Added one reusable phone render, built from HTML, CSS and inline SVG, to the guest sample and details sample. The slim frame, camera pill, side controls, edge highlights, glare and shadow use no external asset or 3D library. Redesigned the A + K sample as framed paper with original botanical line art; Italianno is limited to the sample names, supporting copy uses Cormorant, utility text uses Manrope, and both RSVP targets are at least 44px. Sample name/date/venue and reply notes remain visible at 12px.
- Isolated each effect behind the developer-only `?yeslyPerf=1&fx=off-butterflies,off-dust,off-slideshow,off-reflections,off-ring3d,off-reveals` query. Reduced the moving field to one butterfly and an 8/12-particle pool (phone/desktop), removed the hero image filter, delayed slide two's first request to 8 seconds, capped hero imagery at 1600px, and loads only the active and nearest carousel images as the ring approaches.
- Compared the unchanged delivery copy at `localhost:8001` with the edited page at `localhost:8000` in isolated headed Chrome at 1440px, 4× CPU, and a six-second full-page scripted scroll. Two paired readings were 33.0/33.8fps and 16.5/32.7fps before/after. Raw event totals in the first pair were JS 12,382/11,864ms, Layout 1,411/1,113ms and Paint 25.9/44.1ms; those trace-category totals can overlap. The second before/after pair included 35/3 long tasks over 50ms (177.5/64.5ms maximum). The readings show inconsistent but improved samples, and do not establish steady 60fps or the no-long-task target.
- Individual six-second effect-off reads (one sequential run each) were: baseline 47.5fps; off butterflies 59.5; off dust 51.7; off slideshow 60.2; off reflections 29.5; off ring 3D 60.2; off reveals 53.2. They varied with remote-image timing and Chrome load (for example, one reflection-off run was worse), so the per-effect readings are directional and not a reliable cost ranking. Butterfly, slideshow and 3D-ring paths had the clearest frame-rate gains when disabled.
- A fresh first-load network capture after 5 seconds and before scrolling transferred 1.08MB total, including 635KB of images. Lighthouse 13.6 performance readings were 56, 78 and 81 across repeated local runs (LCP 4.2–5.0s; TBT 20–1,250ms; CLS 0); the 85-point goal was not met and the machine/network variance was substantial. Chrome tracing was captured through the Performance tracing protocol; the DevTools FPS meter, Paint flashing and Layers panel were not available in the controlled browser, so those visual diagnostics remain open.
- Captured Chrome screenshots for the hero, ring, guest phone and details phone at 1440, 1024, 768 and 390px in `review/2026-11-24/premium-phone/`. At 390px, the fixed header measured z-index 1000, the open dark menu used white text and the button was 44 × 44px; the Offer anchor landed at y=70px.
- Updated `DESIGN_SYSTEM.md` and `ASSET_REGISTER.md`; this phone render uses original inline art and adds no third-party asset. Decision rationale is recorded in `decisions/2026-11-24-lightweight-phone-render-and-performance.md`. Rebuilt with `npm run build` and synced `site/index.html`, `site/arc-carousel.js` and `site/arc-carousel.css` to `/Users/david/Documents/Codex/2026-11-24/so/outputs/yesly-celebrate/`; `cmp` confirmed all three copies match.
- Follow-up: get a controlled 4× DevTools UI trace with FPS meter, Paint flashing and Layers visible; retest multiple runs with a stable network, and continue tuning if a steady 60fps and Lighthouse 85 are required.

#### 2026-11-24 — One guest phone, original canvas butterflies, and smooth ring dragging

- Removed the considered-details phone and its unused mockup styles. Kept the guest-experience phone and redesigned the details section with the retained copy, one already-registered bouquet image and five generous numbered rows.
- Rebuilt butterflies as a single canvas layer: four original species with pre-rendered wing and body sprites, nine desktop/five mobile instances, velocity-led smooth heading, steering, speed-aware flapping, periodic glides and a reusable 40/18-particle pool. One RAF pauses when the tab is hidden or hero/ring are both offscreen; reduced-motion gets a few still illustrations. No external illustration was added.
- Updated ring transforms to follow the pointer continuously without transition and to release into sampled inertia and a critically damped settle. The five nearest reflections now use a multi-stop vertical alpha fade to zero and horizontal edge fade inside the rounded card shape. Adjusted the desktop stage so controls follow the reflection without consuming excess blank space.
- Before/after 4× CPU scripted full-page Chrome scroll: 60.2fps baseline; after sprite and dust optimization, 60.2fps and 59.8fps on two runs (60.0 average). Both final traces recorded zero tasks over 50ms. Earlier noisy runs during image loading were 55–58.2fps with a single long task; optimization removed the repeated butterfly body-path drawing and reduced dust churn. JS/layout trace event totals overlap and are not summed as wall time.
- Reviewed the ring at 1440, 1024, 768 and 390px; reviewed details at all four widths. Saved hero, ring and details captures under `review/2026-11-24/one-phone-flight/screenshots/`. Captured a browser-only swipe/flight screen recording at `review/2026-11-24/one-phone-flight/card-swipe-and-butterfly-flight.mov`. Chrome Performance tracing covered a hard flick and slow drag (`gesture-trace.json`); it reported no task over 50ms. Full Chrome DevTools UI Layers/Paint Flashing and Lighthouse were not used for this follow-up.
- Rebuilt with `npm run build`. Final source and delivery copies are synced after the review captures.
- Decision record: `decisions/2026-11-24-one-phone-steered-butterflies-and-physical-ring.md`.

#### 2026-11-24 — Vecteezy butterfly artwork and wider spacing

- Replaced the hand-authored butterfly shapes with three front-view cutouts from the supplied Vecteezy butterfly set by Giuseppe Ramos. Converted the user-provided JPEG preview to transparent, compact sprites; esbuild embeds them in the carousel bundle so the field adds no extra image requests.
- Updated the flight field to start butterflies on separated grid positions, pick targets with neighbor clearance, and steer away from nearby butterflies. Their wings now keep flapping continuously whenever motion is active; hidden/offscreen pausing and reduced-motion still artwork remain in place.
- Added the required visible footer attribution and source link. Recorded the asset URL, creator, Free Vector attribution status and license-info PDF location in `ASSET_REGISTER.md`; raw EPS/JPEG are not copied to the delivery folder.
- After the sprite replacement, a six-second full-page Chrome scroll at 4× CPU measured 59.8fps and 60.2fps (60.0 average), with zero tasks over 50ms in either run. Updated hero, ring and details screenshots at 1440, 1024, 768 and 390px.
- Decision record: `decisions/2026-11-24-vecteezy-butterflies-and-flight-spacing.md`.

#### 2026-11-24 — Mixed butterfly species and smoother flight

- Shuffled species assignment independently of the separated starting grid, removing the pink/rose, orange/red and blue left-to-right grouping. Each flier can select points throughout the viewport and occasional waypoints just outside an edge, so page scrolling reveals continuing flight rather than fixed color zones.
- Softened steering acceleration, heading response and banking to ease turns; maintained neighbor repulsion and continuous wing flapping. The field runs across all page sections and still pauses when the tab is hidden.
- Ran a six-second full-page Chrome scroll with 4× CPU throttling: 60.2fps over 361 frames, no tasks over 50ms. The immediately previous optimized read was 60.0fps average (59.8/60.2); this run shows no measurable drop.
- Refreshed responsive ring captures at 1440, 1024, 768 and 390px and recorded `butterfly-mixed-flight.mov` in the review folder.
- Decision record: `decisions/2026-11-24-mixed-butterfly-flight.md`.

#### 2026-11-24 — Distinct photography and Black American couples

- Replaced the white-couple photographs in the hero, invitation gallery, guest sample and offer imagery with distinct Unsplash photos whose listings identify Black couples in the United States. Updated alt text to describe the photos accurately.
- Removed cross-section photo reuse: each visible photo placement now has a distinct Unsplash ID. The first hero image remains repeated only in its same-slide static fallback/srcset for no-JavaScript support. Removed the repeated process-band photograph and kept its cocoa gradient.
- Replaced repeated offer and details images with separate stationery and ring still lifes. Recorded source links, image IDs and Unsplash license information in `ASSET_REGISTER.md`; added a photography-variety representation guardrail in `DESIGN_SYSTEM.md`.
- Reviewed the supplied Vecteezy smartphone EPS and its certificate. The listing identifies it as Editorial Use Only, so it was not embedded in the promotional page without a commercial-use license. The existing original titanium-tone HTML/CSS phone remains; a license or a commercial-use replacement asset is needed to use that specific artwork.
- Fixed a stale butterfly visibility reference found in the browser preview and added a post-steering spacing correction. The canvas now keeps fliers at least 132px apart on mobile and 165px on desktop while animating through all sections.
- Verification: confirmed there are no repeated photo IDs across distinct page placements; the first-slide fallback uses the same source intentionally. A six-second Chrome full-page scroll at 4× CPU measured 60.3fps over 362 frames, with no tasks over 50ms. Refreshed hero, ring and details screenshots at 1440, 1024, 768 and 390px; browser console had no errors after the fix.
- Rebuilt with `npm run build` and synced the compiled page files to the delivery folder.
- Decision record: `decisions/2026-11-24-distinct-imagery-black-american-couples.md`.

#### 2026-11-24 — Restore the earlier hero couple
- Restored Dwayne Joe's Nairobi garden-couple photograph as a fourth slideshow image, after the current three slides, so the existing hero imagery remains intact.
- The image is requested lazily by the existing slideshow flow and is unique to the hero. The first-slide static fallback remains unchanged.
- Updated `ASSET_REGISTER.md` with the image source/license and clarified that the restored slide should be included in the next contrast pass in `DESIGN_SYSTEM.md`.
- Rebuilt the page and synchronized `index.html`, `arc-carousel.js`, and `arc-carousel.css` to the delivery folder.

#### 2026-11-24 — Add Vercel deployment instructions
- Added a README guide for connecting the full project repository to Vercel, including the repository root, `npm ci`, `npm run build`, `site` output directory, and custom-domain follow-up.
- Clarified that the landing page deploys as a static site and does not require environment variables or a server runtime.
- Review: checked the documented settings against the current package scripts and site output path; no production deployment was initiated.
