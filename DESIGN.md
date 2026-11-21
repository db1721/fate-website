---
name: "F.A.T.E. / Buried In Ruin — Hero Surfaces"
description: "Source-derived visual tokens for the artist home heroes and their playback rail only."
colors:
  fate-ground: "#101316"
  fate-foreground: "#eef0f1"
  fate-muted: "#b9c0c5"
  fate-line: "#383e43"
  fate-action: "#edb632"
  fate-action-text: "#14130f"
  ruin-ground: "#120e0e"
  ruin-foreground: "#f1ece4"
  ruin-muted: "#c8bcb7"
  ruin-line: "#4b3b38"
  ruin-action: "#b62430"
  ruin-action-text: "#fff5f1"
typography:
  release-display:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "clamp(3.25rem, 7.2vw, 6rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  release-title:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 3rem)"
    fontWeight: 550
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  body:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.95rem"
    lineHeight: 1.7
  release-subtitle:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.85rem"
    lineHeight: 1.6
  playback-label:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.85rem"
    fontWeight: 650
  rail-link:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.8rem"
  time:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.7rem"
rounded:
  control: "2px"
  seek-thumb: "1px"
spacing:
  tight: "0.5rem"
  control-gap: "0.75rem"
  text-gap: "1rem"
  rail-gap: "1.5rem"
  mobile-section-gap: "2rem"
components:
  play-fate:
    backgroundColor: "{colors.fate-action}"
    textColor: "{colors.fate-action-text}"
    typography: "{typography.playback-label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.125rem"
  play-fate-hover:
    backgroundColor: "{colors.fate-foreground}"
    textColor: "{colors.fate-ground}"
  play-ruin:
    backgroundColor: "{colors.ruin-action}"
    textColor: "{colors.ruin-action-text}"
    typography: "{typography.playback-label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.125rem"
  play-ruin-hover:
    backgroundColor: "{colors.ruin-foreground}"
    textColor: "{colors.ruin-ground}"
  hero-seek:
    backgroundColor: "transparent"
    rounded: "{rounded.control}"
    height: "44px"
  rail-link:
    typography: "{typography.rail-link}"
  playback-error:
    typography: "{typography.rail-link}"
---

# Design System: F.A.T.E. / Buried In Ruin — Hero Surfaces

## Overview

**Creative North Star: "Precise studio / restrained industrial"**

This record covers only the artist home heroes in app/components/hero.tsx and the hero appearance of AudioTrack. It captures the implemented precise studio character of F.A.T.E. and restrained industrial character of Buried In Ruin. It does not establish a replacement system for the header, catalog, song pages, default audio player, or other incumbent surfaces.

Real artist marks, the existing F.A.T.E. portrait, and authoritative published release art carry the identity. Flat playback controls and an integrated listening rail provide functional precision; image crops and ground-colored fades supply depth. This record is extracted from source and does not assert visual review signoff.

**Key Characteristics:**

- Two local artist palettes with shared functional roles.
- Authentic imagery and recognizable artist marks.
- Flat rectangular controls, visible focus, and real timing.

## Colors

F.A.T.E. uses charcoal, silver, and amber; Buried In Ruin uses carbon, bone, and scarlet. The frontmatter retains the exact local CSS values.

### Primary

- **Studio Amber** (`fate-action`): F.A.T.E. preview action, played seek segment, and text selection.
- **Restrained Scarlet** (`ruin-action`): the same functional roles for Buried In Ruin.

### Neutral

- **Charcoal / Carbon** (`fate-ground`, `ruin-ground`): hero and listening rail ground, with dark text on the hover action.
- **Silver / Bone** (`fate-foreground`, `ruin-foreground`): title, links, seek thumb, focus outline, and hover action fill.
- **Cool Silver / Dust** (`fate-muted`, `ruin-muted`): supporting copy, timestamps, and hovered links.
- **Graphite / Oxide Line** (`fate-line`, `ruin-line`): rail boundaries, unplayed seek segment, and resting link underline.
- **Ink / Pale Chalk** (`fate-action-text`, `ruin-action-text`): text and icons on each solid action fill.

**The Local Palette Rule.** Apply these palette roles only inside the hero and its playback rail. Preserve incumbent artist theme tokens and other surfaces outside this scope.

## Typography

**Display and Body Font:** Geist, inherited through the artist page's sans family.
**Timing Font:** Geist Mono, explicitly assigned to tabular timestamps.

Live release text uses clean variable sans typography. The artist names primarily use supplied image marks; the two additional local display fonts loaded by the application are not applied by these hero styles.

### Hierarchy

- **Release display:** Buried In Ruin's uppercase release title uses the `release-display` token, balanced wrapping, and a maximum measure of 12ch.
- **Release title:** F.A.T.E.'s release title uses `release-title`, balanced wrapping, and a maximum measure of 18ch.
- **Body:** description copy uses `body` at a maximum measure of 43ch; it is hidden in the mobile hero.
- **Release subtitle:** catalog context uses `release-subtitle`.
- **Playback label / rail link:** use their corresponding tokens without decorative type treatments.
- **Time:** uses `time` with tabular numerals and a minimum measure of 9.5ch.

At the mobile breakpoint, release display becomes clamp(3rem, 13vw, 4.5rem), release title becomes clamp(1.85rem, 7.5vw, 2.5rem), and rail links become 0.75rem. These are responsive overrides rather than a site-wide type ramp.

**The Artist Mark Rule.** Preserve the existing image logos as the artist identity; release titles remain live Geist text.

## Layout

The hero reserves the existing header offset (64px). Its stage and listening rail share a centered maximum width (1440px) and horizontal gutters of clamp(1.5rem, 5vw, 5rem). Desktop stage height is clamp(29rem, calc(100svh - 12rem), 44rem).

The scoped composition differs by artist: F.A.T.E. copy occupies 53% and its visual begins at 43%; Buried In Ruin copy occupies 58% and artwork begins at 38%. This records the two home heroes, not a reusable layout mandate for other pages.

The listening rail uses a two-column grid with flexible playback and content-sized navigation, a minimum height (8rem), and vertical padding (1.5rem). At widths up to 1023px it becomes one column. Without a featured track, playback and the release-detail link are absent; exploration navigation remains.

At widths up to 767px the stage has natural height, the visual occupies a fixed image area (25rem), and copy takes full width. F.A.T.E. content begins after 15rem of top padding; Buried In Ruin uses 18rem and places its smaller mark at the top. The rail uses 1rem vertical and 1.5rem horizontal padding, and the play action occupies full width above the timeline. These mobile rules are implemented in CSS; this documentation pass did not visually verify a mobile render.

## Elevation & Depth

These hero surfaces have no box shadows or backdrop blur. Full-bleed imagery, dark ground, and image fades provide depth; thin rail boundaries organize listening controls. F.A.T.E.'s portrait is grayscale with reduced brightness and modest contrast; Buried In Ruin's artwork retains subdued color. Image filtering is presentational and does not alter the source assets.

**The Flat Listening Rule.** Hero playback uses the page ground, border rules, and solid action color without a separate glass card or glow.

## Shapes

Playback controls are almost square, using the small control radius. The seek thumb is a narrow rectangle (9px by 15px) with the smaller thumb radius. The visual progress track is thin (3px), inside a full-height input target. Rail divisions and controls use a fine stroke (1px). There is no card silhouette around the player.

## Components

### Preview buttons

Solid and direct. The two palette variants share geometry: a minimum height (48px), minimum width (10.5rem), control-gap spacing, and the frontmatter padding. Hover swaps to the artist foreground fill and ground text. Keyboard focus uses a foreground outline (2px) with an offset (5px).

Play, pause, loading, and retry use text labels alongside inline vector play/pause icons (16px). Loading retains a cancel action and exposes its busy state. Color transitions last 160ms; reduced-motion preference removes them. No separate active transform is defined.

### Seek input and timing

The native range input uses a transparent background, a full-height target (44px), a colored played segment, and the artist line color for the remaining segment. The thumb uses foreground color. Focus matches the preview button. Before a duration is known, seeking is disabled at reduced opacity (0.55), and the duration text displays a dash placeholder. Timing reflects audio metadata and playback position rather than an invented duration.

### Listening navigation

Underlined text links use the foreground color and line-colored underline at rest. Hover changes text to muted color and uses the current text color for the underline. Links retain minimum height (44px), a text-to-icon gap, inline vector arrows (16px), and a foreground focus outline (2px) offset by 6px. Navigation wraps within the rail.

### Playback feedback

An audio failure creates an in-flow alert below the controls, spans the player grid, uses foreground text, and limits its measure to 65ch. The action becomes “Try preview again”; the message also points to Lyrics & streaming. This is inline recovery, without a dialog or toast.

### Imagery and identity

Reuse the existing F.A.T.E. portrait and both artist marks. Buried In Ruin uses the selected featured release's authoritative cover source. Desktop imagery is cover-cropped; F.A.T.E.'s crop anchors at 58% 32%, while Buried In Ruin centers. Preserve these as surface-specific image decisions. No raster asset was generated or edited for this implementation.

## Do's and Don'ts

### Do:

- **Do** preserve the existing portrait, artist marks, and catalog-owned release art.
- **Do** keep these tokens local to the hero and hero playback appearance.
- **Do** retain visible focus, text playback states, and full-height touch targets.
- **Do** preserve live track titles, timing, preview offsets, and coordinated playback.

### Don't:

- **Don't** apply this scoped redesign to the rest of the site without a separate request.
- **Don't** add a floating glass or glow player wrapper to these heroes.
- **Don't** replace authoritative release art with generated artwork.
- **Don't** promote hero-specific composition or identity text into a universal page template.

