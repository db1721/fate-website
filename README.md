This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3010](http://localhost:3010) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Evolve & Elevate public catalog

FATE and Buried In Ruin both use Evolve & Elevate as their song-data source. The repository no longer contains a second song catalog or bundled song audio/cover copies. In the app, expand **Automatic artist sync** in a song's sharing panel and copy **Artist catalog feed URL** for each artist. The readable catalog alias follows the current artist name; the feed retains its stable artist ID and includes `artist.catalogSlug` when the alias differs. Existing ID-based feed links continue to work. Configure the corresponding server-only environment variables:

```dotenv
MUSIC_CATALOG_FATE_URL=https://app.evolveelevatemedia.com/api/music/public-catalog/OWNER_ID/FATE_ARTIST_ID
MUSIC_CATALOG_BURIED_IN_RUIN_URL=https://app.evolveelevatemedia.com/api/music/public-catalog/OWNER_ID/BURIED_ARTIST_ID
```

The IDs above are placeholders; use the copied links rather than guessing IDs. Add development settings to `.env.development.local` and production settings to the FATE hosting environment, then redeploy once. They are public feed URLs, not credentials. Do not use `NEXT_PUBLIC_` variables. **Both URLs must be configured before deploying this migration.** A missing URL shows an unavailable catalog; there is no static-song fallback. `.env.example` lists the required settings without inventing account or artist IDs.

When both apps run locally, a copied `http://localhost:3000/api/music/public-catalog/...` feed can be used in `.env.development.local`. HTTP is accepted only with `NODE_ENV=development` and an exact loopback hostname (`localhost`, `127.0.0.1`, or `[::1]`). Local public audio must use the same origin as that feed; artwork and streaming links still require HTTPS. Feed redirects are rejected. Test and production builds always require HTTPS, so localhost settings cannot accidentally become a deployed music source. A localhost link is reachable only from the computer running the app; production needs the deployed app's HTTPS feed URLs.

The editable-slug **Website song link** (`/api/music/public-songs/<ownerId>/<slug>`) provides one song's data. For automatic discovery of all current and future songs, this site uses the artist feed instead; do not paste a single-song URL into these catalog settings. The artist feed's internal ID may retain an old band-name spelling without changing the displayed artist name or the app's editable song URLs.

With a feed configured, the app supplies song titles, exact public slugs, artist names, albums and their descriptions, track order, artwork, release dates, optional feature dates, lyrics, streaming links, optional **Behind the Music** text, published main audio, and preview start times. The feed is authoritative for artist pages, discography, song pages, metadata, and the sitemap. New published songs no longer require per-song repository entries. Set a song or album release date in the app: undated catalog songs are labeled TBD and have no FATE song page, sitemap entry, or playable preview until dated.

Only website branding, bios, artist-level social links, press posts, and promotional copy stay local. `catalogEditorial` in each artist config contains album taglines/highlights and optional featured-song subtitles/descriptions, not album descriptions, song metadata, or feature scheduling dates. Album titles are lookup keys; feature copy/highlights use the exact public song slug. If the app slug changes, update an optional editorial key to keep that copy attached. It never selects which song is featured.

Edit **Album description** in the app's album details to update the release description on either artist's website. The optional `albums[].description` field in schema version 1 is plain text, up to 10,000 characters; paragraph breaks are preserved. Surround a phrase with single asterisks, such as `*Monster You Created*`, to display it in italics. Emphasis stays within a line; unmatched asterisks and other Markdown, including `**bold**`, remain plain text. HTML is displayed as text. Blank, missing, or malformed descriptions show no description and never restore hardcoded or previously loaded copy. Save in the app, then refresh the website to see the change; no website redeploy is required after this integration is deployed.

Set an optional **Feature date** on each song in the app. Each artist independently features the released, publicly playable song with the newest feature date on or before today in `America/New_York`. Future feature dates wait until local midnight on that date, independently of the release date; future-release, undated-release, and songs without main audio remain ineligible. Blank or invalid feature dates are ignored. Clearing the field removes a song from feature selection. If no song is eligible, the normal no-feature hero is shown—there is no newest-release or local-schedule fallback. Equal feature dates use catalog `sortOrder`, then original feed order. Title, artwork, audio, and preview timing always come from the app. Save changes in the app; the next website page request reads them without a redeploy. Already-open pages must be refreshed to update their feature.

Catalog requests are uncached (`no-store`) with an eight-second timeout and only deduplicated within a server render. An empty feed removes the catalog; failures show an unavailable catalog and do not fall back to old local songs or audio. Removed songs disappear on the next page request. Already-open browser pages can retain their current content until refreshed; audio access is still checked by the app's stable audio endpoint.

Song release dates override album dates. Future-dated songs keep their upcoming entries but do not have public song pages or playable previews on FATE until release. The shared server/browser release calendar uses `America/New_York`, configured by `MUSIC_RELEASE_TIME_ZONE` in `lib/public-catalog.ts`; date-only labels are never shifted to the previous day by the viewer's timezone. This is a FATE display rule, **not an embargo in the app**: a publicly shared song with a saved main recording and a song or inherited album release date automatically exposes main audio through the public API, even when that date is in the future. Keep the song's website sharing off if its audio must remain private until release.

There is no separate per-song main-audio publishing checkbox. For publicly shared songs, save the main recording and set a song or album release date; the app supplies `mainAudioUrl` automatically, and the website decides whether visitors can play it using the release date. A legacy `publicAudioEnabled` value is ignored. Missing audio never falls back to a repository MP3. The site uses stable public audio URLs, not expiring S3 URLs. Preview timing applies to song, discography, and featured players. Behind the Music is shown as an expandable, plain-text section only when nonblank text is supplied. Remote artwork uses HTTPS and is loaded directly by the browser.

Run all importer tests with Node 22.18+:

```bash
node --test tests/*.test.mjs
```

## Interaction Notifications

Song-page visits, lyric expansions, previews, and streaming/social clicks POST to
`/api/track-interaction/`, which forwards them to Django at
`NEXT_PUBLIC_DJANGO_API_URL/api/music/track-interaction/`. This setting is separate
from the public catalog URLs. The current deployed API origin is
`https://api.evolveelevatemedia.com`; local development can use a running Django
server at `http://127.0.0.1:8000`. Changing a Vercel environment variable requires
a new deployment before it affects the live site.

Django saves events and sends emails for `lyrics_review`, `service_click`,
`social_click`, and `preview_play`. Page visits are saved but do not send email.
Email transport and recipients are configured in Django, not in this site's old
Resend settings. A successful tracking response means Django acknowledged the
request, not proof of inbox delivery. Failed requests are logged as failures, with
no automatic retries that could duplicate notifications.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
