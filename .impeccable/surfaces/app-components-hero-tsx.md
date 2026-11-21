---
version: 1
slug: "app-components-hero-tsx"
primary_target: "app/components/hero.tsx"
related_targets: ["app/components/audio-track.tsx"]
---

# Artist home heroes

Scope: `app/components/hero.tsx`, both artist home routes and the hero appearance of `AudioTrack`.
Mode: Experience with a direct listening action.
Build path: code-led implementation of the direction explicitly selected by the user; no new concept round.

## Direction contract

THESIS: Give the artists' own material the foreground. F.A.T.E. leads with the real portrait and metallic mark; Buried In Ruin leads with the current release and its artwork. Replace the floating player-card composition.

OWN-WORLD: Charcoal, silver, and amber for F.A.T.E.; carbon, bone, and restrained scarlet for Buried In Ruin. Crisp rectangular playback controls, clean typography, real timing, deliberate image crops, and visible focus.

STORY: Recognize the artist, see the current song, play it here, then explore lyrics, streaming, or the catalog. Keep live catalog selection, preview offsets, and audio coordination.

FIRST VIEWPORT: A clear portrait on F.A.T.E.'s right with the mark and featured song at left. Buried In Ruin's artwork occupies the right and its large song title anchors the left; the existing artist mark is smaller. A shared listening rail sits immediately below. Mobile retains imagery and 44px controls.

FORM: User-selected local hero redesign; artist-led F.A.T.E., release-led Buried In Ruin. No concept roll applies to this precisely scoped, confirmed request.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Implementation status

The selected direction is implemented. Production build, TypeScript, targeted lint, and 19 focused tests pass. See `.impeccable/review/hero-validation.md` for evidence and the unrelated baseline test failure.

Visual finish remains open: the independent finish reviewer returned `recapture` because saved desktop and genuine mobile screenshots are missing. Desktop renders were inspected, but phone resizing did not take effect and Computer Use stopped further browser work when it could not establish Chrome's URL for safety. Resume capture verification when browser access is available; do not reopen the approved art direction.
