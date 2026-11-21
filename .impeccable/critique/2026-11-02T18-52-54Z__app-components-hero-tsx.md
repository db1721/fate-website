---
target: "F.A.T.E. and Buried In Ruin heroes: futuristic design without AI slop"
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Users\\danie\\CodeProjects\\fate-website\\app\\components\\hero.tsx"
target_fingerprint: "sha256:689d799960c70dfee4d880255eaf0cf6ae3a33bb53e05b6c0804f2973c29df69"
target_path: "C:\\Users\\danie\\CodeProjects\\fate-website\\app\\components\\hero.tsx"
timestamp: 2026-11-02T18-52-54Z
slug: app-components-hero-tsx
---
Method: dual-agent (A: /root/hero_design_review · B: /root/hero_evidence_review)

# F.A.T.E. and Buried In Ruin hero review

Reviewed the live desktop heroes at https://www.fatemusicofficial.com/ and https://www.fatemusicofficial.com/buried-in-ruin, together with their shared implementation in app/components/hero.tsx. No website source changes were made. Mobile observations are source-based: the browser's requested phone viewport did not take effect.

## Design specificity and overall impression

Both heroes have authentic artist assets inside a familiar marketing template: logo left, floating translucent player card right, radial glow, and pill buttons. The strongest improvement is to give the portrait, artwork, and music more authority while simplifying their surrounding interface. Future-facing character should come from precise composition, type, materials, and useful audio controls.

F.A.T.E. should move toward a precise studio aesthetic: charcoal, silver, a clearer portrait, and one amber accent. Buried In Ruin should move toward industrial minimalism: carbon black, bone white, restrained scarlet, and forcefully cropped release art. Preserve both existing marks and shared listening behavior, but vary composition as well as color.

## What works

- The existing metallic F.A.T.E. and gothic Buried In Ruin logos give each artist a recognizable identity.
- F.A.T.E.'s real portrait and Buried In Ruin's release art provide material specific to the projects.
- The concise artist switch and real preview controls are useful foundations.

## Priority issues

1. **[P1] Make the main Play action actually play.** The prominent Play link opens a song page, the card link opens the same page, and actual playback uses a separate 28px button. Use one substantial Play preview control connected to the player, a quieter Lyrics & streaming link, and a plain Explore music link. This removes an expectation mismatch and makes listening the next obvious action. Sources: hero.tsx:131, :204, :215. Suggested commands: $impeccable clarify, $impeccable shape.

2. **[P2] Replace the floating card with an integrated listening surface.** Remove the outer translucent card and broad shadow, reduce layered glow, and replace pill treatments with restrained rectangular controls. Place title, playback, duration, and scrubber on a slim rail aligned with the hero composition. Preserve useful controls. Sources: hero.tsx:42, :49, :176. Suggested commands: $impeccable distill, $impeccable layout.

3. **[P2] Give each artist a distinct image-led composition.** F.A.T.E.'s face is dimmed and obscured by the card; give the portrait a deliberate crop and a clear area around the face. Buried repeats its artwork as a background and thumbnail; use one dominant crop with quiet space around the gothic mark. Keep factual release data dynamic. Suggested commands: $impeccable shape, $impeccable layout.

4. **[P2] Simplify type, copy, and platform choices.** Use the existing artist marks with a clean sans serif for song titles, readable metadata, and monospace only for real time or release data. Remove Buried's fallback sentence, 'Hear the current featured preview,' or replace it with a song-specific line supplied through editorial data. Do not fill deliberately empty slots with slogans. F.A.T.E.'s seven streaming choices should move behind a quiet All platforms link or the track page; keep the grouped row where a platform selection is useful. Suggested commands: $impeccable typeset, $impeccable clarify.

5. **[P2] Improve readability, touch comfort, and recovery.** Buried's white text on the bright red main button measures 4.06:1 at 12px bold; darken that button red. Actual Play is 28×28px; use at least 44×44px touch areas. Retain purposeful mobile imagery rather than hiding the entire atmospheric image below 640px. Name the player with the song title and show loading/failure feedback. Failed playback is currently caught silently in source; no playback failure was induced during review. Suggested commands: $impeccable adapt, $impeccable harden.

## Design health

Nielsen heuristic scores, 0–4, scoped to the hero and adjacent listening controls. These scores are a review judgment, not an automated audit result.

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2 | Timing exists; loading/failure feedback is missing. |
| 2 | Match with real world | 3 | Play primarily navigates. |
| 3 | User control and freedom | 3 | User-initiated audio, pause, seek, normal navigation. |
| 4 | Consistency and standards | 3 | Coherent mechanics; identities differ mostly by color. |
| 5 | Error prevention | 2 | Ambiguous play/navigation distinction. |
| 6 | Recognition rather than recall | 3 | Grouped metadata; generic player name and many service icons. |
| 7 | Flexibility and efficiency | n/a | No expert workflow needed on this marketing hero. |
| 8 | Aesthetic and minimalist design | 2 | Repeated destinations and familiar decorative wrapper. |
| 9 | Error recognition and recovery | 1 | Failed play is silently caught in source. |
| 10 | Help and documentation | n/a | The music hero should explain itself. |
| **Total** | | **19/32** | **Acceptable foundation; substantial design opportunity.** |

## Cognitive load, emotional journey, and personas

Cognitive load is moderate. F.A.T.E. presents seven visibly grouped platform choices as well as multiple routes to the featured song. The problem is repeated decisions about listening. The artist marks create the opening emotional peak; decoding the listening controls interrupts momentum.

- First-time listeners: the largest Play promise leads to another page.
- Distracted mobile listeners: source hides the atmospheric image and retains a small actual Play target.
- Visitors with failed audio requests: source has no visible error or retry at the player.

## Minor observations

Both H1 accessible names repeat the artist name because sr-only text and logo alt duplicate it. Supporting gray metadata is visually subdued; its layered backgrounds were not assigned an unverified contrast ratio. The subtle grid is barely visible and contributes little identity. If adding motion, keep it brief and purposeful, support reduced motion, and animate audio indicators only during playback. Avoid decorative HUD data, invented telemetry, random glitching, and ambient particles. Use a real waveform only if derived from the audio; a simple scrubber already serves the task.

## Deterministic scan

The bundled CLI detector returned exit 0 and [] for app/components/hero.tsx: zero findings, no rule locations, and no false positives. This narrow result does not assess imported controls or rendered artist colors. Independent browser evidence found the play-label mismatch, small player targets, duplicated accessible headings, and Buried button contrast issue. No live detector overlay was injected because browser evaluation is read-only.

## Questions to consider

Should the next composition center the artist and portrait or make the current release a dominant record poster? Should the next deliverable compare two static hero concepts or implement the selected direction in the shared hero?
