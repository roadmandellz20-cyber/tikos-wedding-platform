# Design system and quality bar

## Current direction

**Full-page bridal editorial under the YESLY by TIKOS lockup:** a composed invitation journey from the cinematic opening to clear guest tools. The page uses warm neutral surfaces, cocoa/near-black typography, Cormorant Garamond display type, Manrope utility text and selective Italianno lettering for names inside the sample invitation. The hero slideshow has four distinct garden and couple images and a static first-image fallback, uses six subtle motes, delays later-slide requests, and caps the hero image at 1600px. Three credited butterfly illustrations from a Vecteezy set are pre-rendered as wing and body sprites for the single canvas field; its small dust pool is fixed-size. The field runs across the page and pauses when the tab is hidden. Reduced motion shows static specimens and leaves the first hero photo in place. The fixed header stays above page layers at z-index 1000, becomes opaque after scrolling, and keeps the mobile menu readable on its dark panel.

The invitation collection is a responsive concave 3D ring of ten portrait cards. The active card begins `clamp(40px, 5vw, 72px)` below its heading; the next section has at least `clamp(56px, 8vw, 100px)` clearance. The stage clips horizontally only and reserves room for the reflection and shadow. Reflections are flipped card children, limited to the active design and two nearest cards on each side. Their image corners follow the card radius; a multi-stop alpha mask fades the reflection exactly to zero and softens both sides. Only the active and nearby design images load as the ring approaches the viewport. The arrows are centered after the reflection and before the readout. Cards animate with transform and opacity only; `will-change` is applied only during active motion, and the face uses layout/paint containment. Pointer drag, keyboard, arrows, trackpad and click controls remain available. Reduced motion settles immediately. Below-the-fold sections use `content-visibility: auto`; scroll reveals animate opacity and transform without blur filters.

The hero keeps the garden photographs warm with a uniform 32% cocoa wash and a stronger left gradient. Existing crop sampling across the original three slides measured at least 4.89:1 on the headline and 5.39:1 on the eyebrow, with the description above 9.80:1; the restored fourth slide uses the same overlay and should be included in the next visual contrast pass. The guest sample phone overlaps a celebration photograph and has three labeled callouts; its reply status is at least 12px. The guest sample is the only phone mockup and uses an original CSS/SVG flagship-style frame with titanium-like edges, side controls, a pill camera, highlights and subtle screen glare. All screen content is real HTML. The A + K sample invitation has layered paper, a fine frame and original botanical line art; Italianno is reserved for names, Cormorant for invitation copy and Manrope for utility labels. The considered-details section uses the existing bouquet photo and five numbered editorial rows instead of a second phone. Offer, process, details, FAQ and closing retain varied surfaces and image/card compositions. Public pricing is intentionally absent until confirmed.

## Current color and typography tokens

- Bone: `#F0E7E3`; light paper: `#F8F5F1`; ink: `#211D1A`.
- Warm taupe: `#AD9188`; cocoa: `#532C1C`; muted olive: `#504738`; dusty rose: `#AA7D78`; soft mist: `#D9DADD`.
- Display: Cormorant Garamond. Body/UI: Manrope. Invitation name accent only: Italianno.

These are working tokens, not yet a locked brand standard. Check local-language glyphs and hosting before production.

## Typography guardrails

- Find display faces that feel romantic and crafted, not a default wedding script.
- Keep body and navigation highly legible at phone sizes.
- Prefer a distinctive display face plus a calm, readable text family; use no more than two families unless a deliberate editorial use case justifies a third.
- Verify licenses, language glyph coverage, weight availability, and loading impact before adopting a font.
- Use script lettering sparingly in the invitation artwork only; do not use it for navigation, long text, or RSVP instructions.

## Color and imagery guardrails

- Build atmosphere with warm editorial photography, paper-like surfaces, negative space and restrained tonal overlays. Avoid stacked gradients and blur effects.
- Keep key text contrast at accessible levels and maintain a clear reading surface over images.
- Use imagery that feels relevant to Gambian and West African celebrations while allowing couples to choose different traditions and styles. Avoid treating one ceremony style as universal.
- Use only owned, commissioned, or properly licensed assets. Keep a source and license note with every external asset.
- Use distinct photography across separate sections so the same scene does not recur. Couple photography should include Black American couples while making room for Gambian and wider West African celebration contexts; do not treat any one ceremony style as universal.

## Motion guardrails

- Motion should create anticipation in the hero, then use light image and text reveals to pace the editorial scroll while leaving practical content easy to read.
- Use slow, restrained reveal / image movement and small invitation details; no endless competing effects or motion that blocks a CTA.
- Respect `prefers-reduced-motion`; keep the content visible without motion and preserve keyboard and touch use.
- Avoid layout shifts and keep the page responsive and light.
- Keep the fixed header opaque when scrolled; avoid backdrop filters and blur filters in scrolling content.
- Pause ambient motion when its visual section is offscreen. Cap canvas DPR at 1.5 and reuse a fixed particle pool.
- Use `content-visibility: auto` with intrinsic size estimates on long below-the-fold sections.

## Navigation and accessibility

- Keep the main navigation short and predictable.
- Use clear action labels that describe what happens.
- Preserve visible keyboard focus, semantic headings, alt text, usable contrast, and generous phone touch targets.
- Make RSVP feedback explicit and honest; demo interactions must be labeled as demos.

## Review standard

Review screenshots at desktop and narrow mobile widths. Check first-screen hierarchy, image crop, type scale, section pacing, menu use, RSVP and sharing affordances, reduced motion, and whether the offer is understandable without reading every section. Do not treat a build as finished based on code inspection alone.


The ambient butterflies use three cropped illustrations from Giuseppe Ramos’s Vecteezy watercolor butterfly set, tinted only by the art itself. Their wing halves and central body are pre-rendered once; nine fliers on desktop and five on mobile share one RAF and a capped dust pool. Species are shuffled independently of start position so colors do not form left, middle and right bands. The fliers keep flapping, steer with eased acceleration and heading, pick points anywhere in the viewport (including just beyond an edge), and repel one another with a positional correction that keeps at least 165px between desktop centers and 132px on mobile. The single viewport canvas continues across all page sections and pauses when the tab is hidden. Reduced motion shows static specimens only. The page footer links the required Vecteezy attribution.
