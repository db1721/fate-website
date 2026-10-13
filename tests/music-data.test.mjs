import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as publicCatalog from "../lib/public-catalog.ts";

const SITE_URL = "https://fate.example.com";
const sourceUrl = "https://app.example.com/api/music/public-catalog/42/artist-fate";
const NOW = "2026-10-12T16:00:00.000Z";
const absoluteUrl = (path = "") => new URL(path || "/", SITE_URL).href;
const getArtistSongPath = (artist, slug) => `${artist.musicPathPrefix}/${slug}`;
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function loadModule(path, imports, now = NOW) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    class FixedDate extends Date {
        constructor(...args) { super(...(args.length ? args : [now])); }
        static now() { return new Date(now).getTime(); }
    }
    const exports = {};
    runInNewContext(compiled, {
        exports, URL, Date: FixedDate,
        require(name) {
            if (Object.hasOwn(imports, name)) return imports[name];
            throw new Error(`Unexpected test import: ${name}`);
        },
    });
    return exports;
}

function makeTrack(overrides = {}) {
    return {
        title: "A Different Display Title", publicSlug: "publisher-chosen-slug", publicSongId: "song-1",
        publicArtistName: "Published Artist", audioSrc: "https://app.example.com/api/music/public-audio/by-id/42/song-1",
        lyrics: "First lyric\nSecond lyric", behindTheMusic: "How the song was written.", previewStartTime: 17.5,
        songServiceLinks: [{ network: "spotify", tooltip: "Listen", url: "https://open.spotify.com/track/one" }],
        ...overrides,
    };
}

function makeAlbum(tracks, overrides = {}) {
    return {
        id: "album-1", title: "Published Album", year: 2020, releaseDate: "2020-01-02",
        coverSrc: "https://images.example.com/album.jpg", tracks, ...overrides,
    };
}

/** @returns {import("../app/config/artists/types.ts").ArtistConfig} */
function makeArtist(albums = [makeAlbum([makeTrack()])], overrides = {}) {
    return {
        id: "fate", routeSlug: "fate", homePath: "/", musicPathPrefix: "/music",
        name: "F.A.T.E.", fullName: "Fight Against the Enemy", logo: "/logo.png", logoAlt: "FATE",
        hero: { eyebrow: "Music", description: "Brand copy", secondaryCta: "Listen", noFeatureTitle: "Soon", noFeatureDescription: "More music soon" },
        about: { title: "About", intro: "About FATE", paragraphs: ["Editorial biography"] },
        musicSection: { eyebrow: "Music", title: "Albums", description: "Our music", emptyTitle: "Soon", emptyDescription: "Check back" },
        connect: { title: "Connect", description: "Find us", emptyDescription: "More soon" },
        seo: { title: "FATE", description: "Official FATE music", keywords: ["FATE"], genres: ["Rock"], image: "/brand.jpg" },
        theme: { background: "#000", backgroundAlt: "#111", surface: "#222", border: "#333", accent: "#aaa", accentBright: "#fff", accentSoft: "#999", text: "#fff", textMuted: "#ddd", buttonText: "#000", heroGlow: "#444", secondaryGlow: "#555" },
        featuredTracks: [], socialLinks: [{ network: "spotify", tooltip: "Artist", url: "https://open.spotify.com/artist/fate" }],
        albums, pressPosts: [], ...overrides,
    };
}

function loadMusicData(artists, now = NOW) {
    return loadModule("../app/config/music-data.ts", {
        "@/app/config/artists": { ARTISTS: artists, getArtistSongPath },
        "@/app/config/site": { CONTACT_EMAIL: "contact@example.com", SITE_URL, absoluteUrl },
        "@/lib/utils": { slugify },
        "@/lib/public-catalog": publicCatalog,
    }, now);
}

const jsonValue = (value) => JSON.parse(JSON.stringify(value));

test("album players start at zero while featured players retain the saved preview time", () => {
    for (const [component, expectedStart] of [["discography", "0"], ["hero", "featuredTrack.previewStartTime"]]) {
        const source = readFileSync(new URL(`../app/components/${component}.tsx`, import.meta.url), "utf8");
        const file = ts.createSourceFile(`${component}.tsx`, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const players = [];
        function visit(node) {
            if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(file) === "AudioTrack") {
                players.push(node);
            }
            ts.forEachChild(node, visit);
        }
        visit(file);
        assert.ok(players.length > 0, `${component} renders an audio player`);
        for (const player of players) {
            const start = player.attributes.properties.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === "previewStartTime");
            assert.equal(start?.initializer?.expression?.getText(file), expectedStart, `${component} playback start`);
        }
    }
});

function makeFeed() {
    return {
        schemaVersion: 1, artist: { id: "artist-fate", name: "Published Artist" },
        albums: [{ id: "album-1", title: "Published Album", releaseDate: "2020-01-02", coverUrl: "https://images.example.com/album.jpg", sortOrder: 0 }],
        songs: [{
            slug: "publisher-chosen-slug", songId: "song-1", title: "A Different Display Title",
            artistId: "artist-fate", artist: "Published Artist", albumId: "album-1", sortOrder: 0,
            lyrics: "First lyric\nSecond lyric", behindTheMusic: "  How the song was written.  ",
            mainAudioUrl: "/api/music/public-audio/by-id/42/song-1", previewStartSeconds: 17.5,
            serviceLinks: [{ service: "appleMusic", label: "Listen", url: "https://music.apple.com/song/one" }],
        }],
    };
}

test("actual song-page lookup honors the publisher slug exactly, without re-slugifying the title", () => {
    const artist = makeArtist();
    const music = loadMusicData([artist]);
    assert.equal(music.getTrackSlug(artist.albums[0].tracks[0]), "publisher-chosen-slug");
    assert.equal(music.getSongPageDataFromSlug(artist, "publisher-chosen-slug").title, "A Different Display Title");
    assert.equal(music.getSongPageDataFromSlug(artist, "a-different-display-title"), null);
    assert.equal(music.getSongPageDataFromSlug(artist, "Publisher-Chosen-Slug"), null);
    assert.equal(music.getSongPageDataFromSlug(artist, "missing"), null);
});

test("song release date takes precedence and blank or absent song dates inherit the album", () => {
    const artist = makeArtist([makeAlbum([
        makeTrack({ publicSlug: "override", releaseDate: "2021-03-04" }),
        makeTrack({ publicSlug: "inherit" }),
        makeTrack({ publicSlug: "blank", releaseDate: "  " }),
    ])]);
    const music = loadMusicData([artist]);
    for (const [slug, expected] of [["override", "2021-03-04"], ["inherit", "2020-01-02"], ["blank", "2020-01-02"]]) {
        const page = music.getSongPageDataFromSlug(artist, slug);
        assert.equal(page.releaseDate, expected);
        assert.equal(page.releaseLabel, `Released ${expected}`);
        assert.equal(music.getPublicSongPages(artist).find((song) => song.slug === slug).lastModified.toISOString(), `${expected}T00:00:00.000Z`);
    }
    const futureAlbum = makeArtist([makeAlbum([makeTrack({ releaseDate: "2021-03-04" })], { releaseDate: "2099-01-01" })]);
    assert.equal(music.getSongPageDataFromSlug(futureAlbum, "publisher-chosen-slug").releaseDate, "2021-03-04");
});

test("future and undated feed songs cannot become public pages, sitemap entries, or structured-data recordings", () => {
    const released = makeTrack({ publicSlug: "released", releaseDate: "2020-01-01" });
    const future = makeTrack({ publicSlug: "future-song", title: "Future Song", releaseDate: "2099-01-01", featured: true, lyricsUrl: "https://lyrics.example/future" });
    const inheritedFuture = makeTrack({ publicSlug: "future-album", title: "Future Album Song" });
    const undated = makeTrack({ publicSlug: "undated", title: "Undated Song", featured: true });
    const invalidDate = makeTrack({ publicSlug: "invalid-date", title: "Invalid Date Song", releaseDate: "invalid" });
    const artist = makeArtist([
        makeAlbum([released, future, invalidDate]),
        makeAlbum([inheritedFuture], { id: "future-album", title: "Upcoming", releaseDate: "2099-02-01", year: 2099 }),
        makeAlbum([undated], { id: "undated-album", title: "TBD", releaseDate: undefined, year: 0 }),
    ]);
    const music = loadMusicData([artist]);
    for (const slug of ["future-song", "future-album", "undated", "invalid-date"]) assert.equal(music.getSongPageDataFromSlug(artist, slug), null, slug);
    assert.deepEqual([...music.getPublicSongPages(artist).map((page) => page.slug)], ["released"]);
    assert.deepEqual([...music.getPublicSongPages().map((page) => page.slug)], ["released"]);
    const data = music.getHomeStructuredData(artist);
    assert.deepEqual([...data.track.map((track) => track.name)], [released.title]);
    assert.deepEqual([...data.album.flatMap((album) => album.track).map((track) => track.name)], [released.title]);
    for (const title of [future.title, inheritedFuture.title, undated.title, invalidDate.title]) assert.equal(JSON.stringify(data).includes(title), false, title);
});

test("feed songs publish on their New York calendar release day, not the preceding UTC evening", () => {
    const artist = makeArtist([makeAlbum([makeTrack({ releaseDate: "2026-10-13" })])]);
    const beforeMidnight = loadMusicData([artist], "2026-10-13T00:30:00Z");
    assert.equal(beforeMidnight.getSongPageDataFromSlug(artist, "publisher-chosen-slug"), null);
    assert.equal(beforeMidnight.getPublicSongPages(artist).length, 0);
    const afterMidnight = loadMusicData([artist], "2026-10-13T04:00:00Z");
    assert.equal(afterMidnight.getSongPageDataFromSlug(artist, "publisher-chosen-slug").releaseDate, "2026-10-13");
    assert.equal(afterMidnight.getPublicSongPages(artist).length, 1);
});

test("released catalog tracks supply direct lyrics, public story, audio, preview, and streaming links to real song pages", () => {
    const artist = publicCatalog.applyPublicCatalog(makeArtist(), makeFeed(), sourceUrl, new Date(NOW));
    const music = loadMusicData([artist]);
    const page = music.getSongPageDataFromSlug(artist, "publisher-chosen-slug");
    assert.ok(page);
    assert.equal(page.artist, "Published Artist");
    assert.equal(page.artistFullName, "Published Artist");
    assert.equal(page.lyrics, "First lyric\nSecond lyric");
    assert.equal(page.behindTheMusic, "How the song was written.");
    assert.equal(page.previewUrl, "https://app.example.com/api/music/public-audio/by-id/42/song-1");
    assert.equal(page.previewStartTime, 17.5);
    assert.equal(page.lyricsUrl, undefined, "direct feed lyrics do not require a synthetic remote lyrics link");
    assert.equal(page.releaseDate, "2020-01-02");
    assert.deepEqual(jsonValue(page.songServiceLinks), [{ network: "apple", tooltip: "Listen", url: "https://music.apple.com/song/one" }]);
    const feed = makeFeed();
    feed.songs[0].serviceLinks = [];
    const withoutLinks = publicCatalog.applyPublicCatalog(makeArtist(), feed, sourceUrl, new Date(NOW));
    assert.ok(music.getSongPageDataFromSlug(withoutLinks, "publisher-chosen-slug"), "publicSongId grants eligibility without featured status or outbound links");
});

test("tracks removed from the feed never fall back to private or stale local song pages or structured data", () => {
    const stale = makeTrack({ publicSlug: "removed-private", title: "PRIVATE TRACK", audioSrc: "/old-private.mp3", featured: true });
    const base = makeArtist([makeAlbum([makeTrack(), stale])]);
    const artist = publicCatalog.applyPublicCatalog(base, makeFeed(), sourceUrl, new Date(NOW));
    const music = loadMusicData([artist]);
    assert.equal(music.getSongPageDataFromSlug(artist, "removed-private"), null);
    assert.deepEqual([...music.getPublicSongPages(artist).map((page) => page.slug)], ["publisher-chosen-slug"]);
    assert.equal(JSON.stringify(music.getHomeStructuredData(artist)).includes("PRIVATE TRACK"), false);
    assert.equal(JSON.stringify(music.getHomeStructuredData(artist)).includes("old-private.mp3"), false);
});

test("empty and unavailable catalogs remove every local public page without returning editorial tracks", () => {
    const base = makeArtist();
    const feed = makeFeed();
    feed.albums = [];
    feed.songs = [];
    const empty = publicCatalog.applyPublicCatalog(base, feed, sourceUrl, new Date(NOW));
    const unavailable = { ...base, catalogStatus: "unavailable", albums: [], featuredTracks: [] };
    const music = loadMusicData([empty, unavailable]);
    for (const artist of [empty, unavailable]) {
        assert.equal(music.getSongPageDataFromSlug(artist, "publisher-chosen-slug"), null);
        assert.equal(music.getPublicSongPages(artist).length, 0);
        const data = music.getHomeStructuredData(artist);
        assert.equal(data.track.length, 0);
        assert.equal(data.album.length, 0);
    }
    assert.equal(music.getPublicSongPages().length, 0);
});

test("hiding an album removes its songs, feature, pages and sitemap entries for both artists, and showing restores them", async () => {
    const initialArtists = [];
    const hiddenArtists = [];
    for (const id of ["fate", "buried-in-ruin"]) {
        const prefix = id === "fate" ? "" : "/buried-in-ruin";
        const base = makeArtist([], { id, catalogRequired: true, homePath: prefix || "/", musicPathPrefix: `${prefix}/music` });
        const published = makeFeed();
        published.artist.id = `artist-${id}`;
        published.songs[0].artistId = published.artist.id;
        published.songs[0].featureDate = "2026-10-01";
        published.albums.push({ ...published.albums[0], id: "album-2", title: "Still Public Album", sortOrder: 1 });
        published.songs.push({
            ...published.songs[0], songId: "song-2", slug: "still-public", title: "Still Public Song",
            albumId: "album-2", sortOrder: 1, featureDate: "2026-09-01",
            mainAudioUrl: "/api/music/public-audio/by-id/42/song-2",
        });
        const url = sourceUrl.replace("artist-fate", published.artist.id);
        const initial = publicCatalog.applyPublicCatalog(base, published, url, new Date(NOW));
        assert.equal(initial.featuredTracks[0].songSlug, "publisher-chosen-slug");
        initialArtists.push(initial);

        // The app API omits the entire hidden album and its songs; the site
        // must replace the previous feed instead of preserving stale entries.
        const hiddenFeed = { ...published, albums: [published.albums[1]], songs: [published.songs[1]] };
        const hidden = publicCatalog.applyPublicCatalog(initial, hiddenFeed, url, new Date(NOW));
        hiddenArtists.push(hidden);
        const music = loadMusicData([hidden]);
        assert.deepEqual(hidden.albums.map((album) => album.id), ["album-2"], `${id}: no hidden album or synthetic singles fallback`);
        assert.equal(hidden.featuredTracks[0].songSlug, "still-public", `${id}: feature is reselected from visible songs`);
        assert.equal(music.getSongPageDataFromSlug(hidden, "publisher-chosen-slug"), null);
        assert.deepEqual([...music.getPublicSongPages(hidden).map((page) => page.slug)], ["still-public"]);
        const structuredData = JSON.stringify(music.getHomeStructuredData(hidden));
        for (const removed of ["Published Album", "A Different Display Title", "publisher-chosen-slug", "/song-1"])
            assert.equal(structuredData.includes(removed), false, `${id}: ${removed} is not public structured data`);

        const restored = publicCatalog.applyPublicCatalog(hidden, published, url, new Date(NOW));
        assert.equal(restored.albums.length, 2);
        assert.equal(restored.featuredTracks[0].songSlug, "publisher-chosen-slug");
        assert.ok(music.getSongPageDataFromSlug(restored, "publisher-chosen-slug"));
    }

    const sitemap = loadModule("../app/sitemap.ts", {
        "@/app/config/artists": { ARTISTS: initialArtists, BURIED_IN_RUIN_ARTIST: initialArtists[1] },
        "@/app/config/music-data": loadMusicData(initialArtists),
        "@/app/config/site": { SITE_URL, absoluteUrl },
        "@/lib/public-catalog.server": { loadArtistCatalog: async (artist) => hiddenArtists.find((candidate) => candidate.id === artist.id) },
    });
    const entries = await sitemap.default();
    assert.deepEqual([...entries.map((entry) => entry.url)], [
        SITE_URL, `${SITE_URL}/buried-in-ruin`,
        `${SITE_URL}/music/still-public`, `${SITE_URL}/buried-in-ruin/music/still-public`,
    ]);
});

test("metadata and JSON-LD use exact public paths, plain publisher fields, and allowlisted media without private editor content", () => {
    const feed = makeFeed();
    feed.songs[0].title = 'A "Quoted" Song <Not HTML>';
    feed.songs[0].tabs = [{ type: "story", content: "PRIVATE STORY" }];
    feed.songs[0].sampleFiles = [{ fileUrl: "https://private.example/sample.mp3" }];
    feed.songs[0].editorPreferences = { selectedEditorTabId: "private-tab" };
    feed.songs[0].serviceLinks.push({ service: "unsafe", label: "Unsafe", url: "javascript:alert(1)" });
    const artist = publicCatalog.applyPublicCatalog(makeArtist(), feed, sourceUrl, new Date(NOW));
    const music = loadMusicData([artist]);
    const page = music.getSongPageDataFromSlug(artist, "publisher-chosen-slug");
    const metadata = music.generateSongMetadata(page);
    const canonical = `${SITE_URL}/music/publisher-chosen-slug`;
    assert.equal(metadata.title.absolute, 'A "Quoted" Song <Not HTML> by Published Artist');
    assert.equal(metadata.alternates.canonical, canonical);
    assert.equal(metadata.openGraph.url, canonical);
    assert.equal(metadata.openGraph.type, "music.song");
    assert.equal(metadata.openGraph.images[0].url, "https://images.example.com/album.jpg");
    assert.deepEqual(jsonValue(metadata.twitter.images), ["https://images.example.com/album.jpg"]);
    const data = jsonValue(music.getSongStructuredData(page));
    assert.equal(data["@type"], "MusicRecording");
    assert.equal(data["@id"], `${canonical}#recording`);
    assert.equal(data.name, feed.songs[0].title, "publisher text remains a plain string");
    assert.equal(data.url, canonical);
    assert.equal(data.datePublished, "2020-01-02");
    assert.equal(data.byArtist.name, "Published Artist");
    assert.equal(data.inAlbum.name, "Published Album");
    assert.deepEqual(data.audio, { "@type": "AudioObject", contentUrl: "https://app.example.com/api/music/public-audio/by-id/42/song-1" });
    assert.deepEqual(data.sameAs, ["https://music.apple.com/song/one"]);
    assert.deepEqual(data.mainEntityOfPage, { "@type": "WebPage", "@id": canonical });
    for (const privateValue of ["PRIVATE STORY", "sample.mp3", "private-tab", "javascript:"]) assert.equal(JSON.stringify({ metadata, data, page }).includes(privateValue), false);
    for (const excluded of ["lyrics", "behindTheMusic", "tabs", "sampleFiles", "editorPreferences"]) assert.equal(Object.hasOwn(data, excluded), false);
    const scriptText = JSON.stringify(data).replace(/</g, "\\u003c");
    assert.equal(scriptText.includes("<"), false);
    assert.equal(JSON.parse(scriptText).name, feed.songs[0].title);
});

test("no public audio produces no JSON-LD audio object and does not revive the repo recording", () => {
    const feed = makeFeed();
    delete feed.songs[0].mainAudioUrl;
    feed.songs[0].behindTheMusic = "  ";
    const base = makeArtist([makeAlbum([makeTrack({ audioSrc: "/private-local.mp3", previewSrc: "/private-preview.mp3" })])]);
    const artist = publicCatalog.applyPublicCatalog(base, feed, sourceUrl, new Date(NOW));
    const music = loadMusicData([artist]);
    const page = music.getSongPageDataFromSlug(artist, "publisher-chosen-slug");
    assert.equal(page.previewUrl, "");
    assert.equal(page.behindTheMusic, undefined);
    const data = jsonValue(music.getSongStructuredData(page));
    assert.equal(Object.hasOwn(data, "audio"), false);
    assert.equal(JSON.stringify(page).includes("private-local"), false);
    assert.equal(JSON.stringify(page).includes("private-preview"), false);
});

test("actual dynamic sitemap loads current artist catalogs and applies the song-page publication gate", async () => {
    const first = makeArtist();
    const second = makeArtist([], { id: "buried-in-ruin", routeSlug: "buried-in-ruin", homePath: "/buried-in-ruin", musicPathPrefix: "/buried-in-ruin/music" });
    const liveFirst = makeArtist([
        makeAlbum([
            makeTrack({ publicSlug: "live-released", releaseDate: "2021-02-03" }),
            makeTrack({ publicSlug: "live-future", releaseDate: "2099-01-01" }),
        ]),
        makeAlbum([makeTrack({ publicSlug: "live-undated" })], { id: "undated", releaseDate: undefined }),
    ]);
    const music = loadMusicData([first, second]);
    const loaded = [];
    const sitemap = loadModule("../app/sitemap.ts", {
        "@/app/config/artists": { ARTISTS: [first, second], BURIED_IN_RUIN_ARTIST: second },
        "@/app/config/music-data": music,
        "@/app/config/site": { SITE_URL, absoluteUrl },
        "@/lib/public-catalog.server": { loadArtistCatalog: async (artist) => { loaded.push(artist.id); return artist.id === "fate" ? liveFirst : second; } },
    });
    assert.equal(sitemap.dynamic, "force-dynamic");
    const entries = await sitemap.default();
    assert.deepEqual(loaded.sort(), ["buried-in-ruin", "fate"]);
    assert.deepEqual([...entries.map((entry) => entry.url)], [SITE_URL, `${SITE_URL}/buried-in-ruin`, `${SITE_URL}/music/live-released`]);
    assert.equal(entries[2].lastModified.toISOString(), "2021-02-03T00:00:00.000Z");
    assert.equal(entries[2].changeFrequency, "monthly");
    assert.equal(JSON.stringify(entries).includes("publisher-chosen-slug"), false, "stale imported ARTISTS are never the song source");
});

test("both real artist configurations require app feeds with no duplicated local album or featured-track catalog", () => {
    for (const [fileName, exportName] of [["fate.ts", "FATE_ARTIST"], ["buried-in-ruin.ts", "BURIED_IN_RUIN_ARTIST"]]) {
        const source = readFileSync(new URL(`../app/config/artists/${fileName}`, import.meta.url), "utf8");
        const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        const declaration = file.statements
            .filter(ts.isVariableStatement)
            .flatMap((statement) => [...statement.declarationList.declarations])
            .find((candidate) => ts.isIdentifier(candidate.name) && candidate.name.text === exportName);
        assert.ok(declaration && ts.isObjectLiteralExpression(declaration.initializer), `${exportName} has a concrete config`);
        const property = (name) => declaration.initializer.properties.find((node) => ts.isPropertyAssignment(node) && node.name.getText(file) === name)?.initializer;
        assert.equal(property("catalogRequired")?.kind, ts.SyntaxKind.TrueKeyword, `${exportName} must never fall back to repo song data`);
        for (const key of ["albums", "featuredTracks"]) {
            const value = property(key);
            assert.ok(value && ts.isArrayLiteralExpression(value), `${exportName}.${key} must not import a local song catalog`);
            assert.equal(value.elements.length, 0, `${exportName}.${key} must be populated only by the app feed`);
        }
        const editorial = property("catalogEditorial");
        assert.ok(editorial && ts.isObjectLiteralExpression(editorial), `${exportName} stores editorial choices separately`);
        const forbiddenCatalogFields = new Set(["audioSrc", "previewSrc", "coverSrc", "songImg", "lyrics", "lyricsUrl", "behindTheMusic", "releaseDate", "featureDate", "previewStartTime", "trackNumber", "songServiceLinks"]);
        function verifyEditorial(node) {
            if (ts.isPropertyAssignment(node)) assert.equal(forbiddenCatalogFields.has(node.name.getText(file)), false, `${exportName} editorial config duplicates ${node.name.getText(file)}`);
            ts.forEachChild(node, verifyEditorial);
        }
        verifyEditorial(editorial);
    }
});
