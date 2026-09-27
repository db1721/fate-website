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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Song Lyrics

Add `lyricsUrl` to any track in `app/config/artists/buried-in-ruin.ts` (Buried In Ruin)
or `app/config/fate-info.jsx` (FATE). Each track has a `lyricsUrl` field ready to fill in:

```ts
lyricsUrl: "https://app.evolveelevatemedia.com/music/lyrics/created-a-monster",
```

The song page fetches and displays the lyrics inline, with no external lyrics link.
Supported sources are public Evolve & Elevate lyrics pages (a `section` whose
`aria-label` ends in ` lyrics`) and HTTPS plain-text URLs served as `text/plain`.
Line breaks and blank lines between verses are preserved. Fetched HTML is never
rendered as markup.

In production, the source and song page are cached for one hour and revalidated
on subsequent visits, so source edits appear without a new deployment (not
necessarily at exactly one hour). Adding or changing a URL in the track config
still requires deploying the site.

Local lyric text files are no longer used. An empty `lyricsUrl` or a failed source
hides the lyrics section without breaking playback. Created A Monster is already
configured; fill in the other songs' URLs when their public lyrics pages are ready.

Run the lyrics importer tests with Node 22.18+:

```bash
node --test tests/lyrics.test.mjs
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
