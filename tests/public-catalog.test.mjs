import assert from "node:assert/strict";
import { test } from "node:test";
import { applyPublicCatalog, fetchArtistCatalog, isCatalogSongReleased, isFutureCatalogRelease, musicReleaseDateIso, parseMusicReleaseDate } from "../lib/public-catalog.ts";
import { clampAudioPreviewStart } from "../lib/audio-preview.ts";
import { getCurrentFeaturedTrack } from "../app/config/artists/featured-track.ts";
import { musicFeatureDateIso } from "../lib/music-calendar.ts";

const sourceUrl = "https://app.evolveelevatemedia.com/api/music/public-catalog/owner/artist-1";
const artist = {
    id: "fate", name: "F.A.T.E.", fullName: "Fight Against the Enemy", seo: { image: "/brand.png" },
    catalogRequired: true,
    hero: { description: "Keep editorial copy" },
    albums: [{ id: "local", title: "Album", tracks: [{ title: "Song", audioSrc: "/old.mp3", featured: true, previewStartLabel: "Chorus" }] }],
    featuredTracks: [{ title: "Song", audioSrc: "/old.mp3", coverSrc: "/old.jpg", subtitle: "Editorial", featureDate: "2020-01-01" }],
    catalogEditorial: {
        albums: [{ albumTitle: "Album", tagline: "Editorial album tagline", description: "Editorial album description", highlightSongSlug: "exact-publisher-slug" }],
        features: [{ songSlug: "exact-publisher-slug", subtitle: "Editorial", description: "Editorial feature description" }],
    },
};
function feed() {
    return {
        schemaVersion: 1, artist: { id: "artist-1", name: "App Artist" },
        albums: [{ id: "album-1", title: "Album", description: "  App album description.\n\nA second paragraph.  ", releaseDate: "2020-01-02", coverUrl: "https://assets.example.com/cover.jpg", sortOrder: 0 }],
        songs: [{ slug: "exact-publisher-slug", songId: "song-1", title: "Song", artistId: "artist-1", artist: "App Artist", albumId: "album-1", featureDate: "2020-02-01", trackNumber: 4, sortOrder: 0, lyrics: "First line\nSecond line", behindTheMusic: "  A true story.  ", mainAudioUrl: "/api/music/public-audio/by-id/owner/song-1", previewStartSeconds: 17.5, serviceLinks: [{ service: "apple_music", label: "Listen", url: "https://music.apple.com/song" }] }],
    };
}

function setNodeEnv(t, value) {
    const previous = process.env.NODE_ENV;
    if (value === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = value;
    t.after(() => {
        if (previous === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = previous;
    });
}

test("renamed artist catalog aliases preserve tracks and feature selection without rewriting IDs", () => {
    const payload = feed();
    const canonicalId = "artist-architect-of-fate-b6af26b5be";
    const catalogSlug = "artist-buried-in-ruin-b6af26b5be";
    payload.artist = { id: canonicalId, name: "Buried In Ruin", catalogSlug };
    payload.songs[0].artistId = canonicalId;
    const url = (id) => `https://app.evolveelevatemedia.com/api/music/public-catalog/1/${id}`;
    const oldResult = applyPublicCatalog(artist, payload, url(canonicalId));
    const newResult = applyPublicCatalog(artist, payload, url(catalogSlug));
    assert.deepEqual(newResult.albums, oldResult.albums);
    assert.deepEqual(newResult.featuredTracks, oldResult.featuredTracks);
    assert.throws(() => applyPublicCatalog(artist, payload, url("different-artist")), /does not match/);
});

test("maps app data and exact slug while preserving branding and editorial choices", () => {
    const result = applyPublicCatalog(artist, feed(), sourceUrl);
    const song = result.albums[0].tracks[0];
    assert.equal(result.name, "F.A.T.E.");
    assert.equal(result.hero.description, "Keep editorial copy");
    assert.equal(song.publicSlug, "exact-publisher-slug");
    assert.equal(song.publicArtistName, "App Artist");
    assert.equal(song.releaseDate, "2020-01-02");
    assert.equal(song.featureDate, "2020-02-01");
    assert.equal(song.audioSrc, "https://app.evolveelevatemedia.com/api/music/public-audio/by-id/owner/song-1");
    assert.equal(song.previewStartTime, 17.5);
    assert.equal(song.trackNumber, 4);
    assert.equal(song.behindTheMusic, "A true story.");
    assert.equal(song.lyrics, "First line\nSecond line");
    assert.deepEqual(song.songServiceLinks, [{ url: "https://music.apple.com/song", network: "apple", tooltip: "Listen" }]);
    assert.equal(result.featuredTracks[0].audioSrc, song.audioSrc);
    assert.equal(result.featuredTracks[0].songSlug, song.publicSlug);
    assert.equal(result.featuredTracks[0].subtitle, "Editorial");
    assert.equal(result.featuredTracks[0].featureDate, "2020-02-01");
    assert.equal(result.featuredTracks[0].description, "Editorial feature description");
    assert.equal(result.albums[0].tagline, "Editorial album tagline");
    assert.equal(result.albums[0].description, "App album description.\n\nA second paragraph.");
    assert.equal(result.albums[0].highlightTrack, song.title);
    assert.equal(artist.albums[0].tracks[0].audioSrc, "/old.mp3", "does not mutate static config");
});

test("FATE and Buried In Ruin independently take album descriptions from the app", () => {
    for (const id of ["fate", "buried-in-ruin"]) {
        const data = feed();
        const description = `${id}: first paragraph.\n\nSecond paragraph.`;
        data.albums[0].description = `  ${description}  `;
        data.albums.push({ ...data.albums[0], id: "album-2", title: "Second album", description: "A different album description.", sortOrder: 1 });
        data.songs.push({ ...data.songs[0], songId: "song-2", slug: "second-song", albumId: "album-2", sortOrder: 1 });
        const initial = applyPublicCatalog({ ...artist, id }, data, sourceUrl);
        assert.equal(initial.albums[0].description, description);
        assert.equal(initial.albums[1].description, "A different album description.");
        data.albums[0].description = `Updated ${id} album description.`;
        const updated = applyPublicCatalog(initial, data, sourceUrl);
        assert.equal(updated.albums[0].description, `Updated ${id} album description.`);
        assert.equal(updated.albums[1].description, "A different album description.");
        assert.equal(initial.albums[0].description, description, "does not mutate earlier catalog data");
    }
});

test("blank, missing or malformed album descriptions never restore stale local or editorial text", () => {
    for (const id of ["fate", "buried-in-ruin"]) {
        for (const catalogRequired of [true, false]) {
            const initial = applyPublicCatalog({ ...artist, id, catalogRequired }, feed(), sourceUrl);
            for (const description of [undefined, null, "", "  \n\t ", 123, false, [], {}, "x".repeat(10_001)]) {
                const data = feed();
                if (description === undefined) delete data.albums[0].description;
                else data.albums[0].description = description;
                const result = applyPublicCatalog(initial, data, sourceUrl);
                assert.equal(result.catalogStatus, "ready");
                assert.equal(result.albums[0].tracks.length, 1, "optional bad copy must not remove valid songs");
                assert.equal(result.albums[0].description, undefined, `${id}, required=${catalogRequired}: ${typeof description}`);
                assert.equal(result.albums[0].tagline, "Editorial album tagline", "other editorial choices are preserved");
                assert.equal(result.featuredTracks[0].description, "Editorial feature description");
            }
        }
    }
});

test("album descriptions remain plain text and accept the API's maximum length", () => {
    const data = feed();
    data.albums[0].description = "<script>alert('text only')</script>\n\nA paragraph & more.";
    assert.equal(applyPublicCatalog(artist, data, sourceUrl).albums[0].description, data.albums[0].description);
    data.albums[0].description = "x".repeat(10_000);
    assert.equal(applyPublicCatalog(artist, data, sourceUrl).albums[0].description.length, 10_000);
});

test("both artist catalogs accept automatic main audio without a per-song audio publishing flag", () => {
    for (const id of ["fate", "buried-in-ruin"]) {
        for (const publicAudioEnabled of [undefined, false, true]) {
            const data = feed();
            data.songs[0].publicAudioEnabled = publicAudioEnabled;
            const result = applyPublicCatalog({ ...artist, id }, data, sourceUrl, new Date("2026-10-12T16:00:00Z"));
            const song = result.albums[0].tracks[0];
            assert.equal(song.releaseDate, "2020-01-02", "the album release date is inherited");
            assert.equal(song.audioSrc, "https://app.evolveelevatemedia.com/api/music/public-audio/by-id/owner/song-1");
            assert.equal(result.featuredTracks[0].audioSrc, song.audioSrc, `${id}: legacy flag ${publicAudioEnabled}`);
        }
    }
});

test("automatic audio in a future release feed waits for the inherited release date before featuring", () => {
    const data = feed();
    data.songs[0].publicAudioEnabled = false;
    data.albums[0].releaseDate = "2026-10-13";
    const beforeRelease = new Date("2026-10-13T03:59:59Z");
    const upcoming = applyPublicCatalog(artist, data, sourceUrl, beforeRelease);
    const song = upcoming.albums[0].tracks[0];
    assert.ok(song.audioSrc, "the public API may already contain audio; the website owns release visibility");
    assert.equal(song.releaseDate, "2026-10-13");
    assert.equal(isCatalogSongReleased(song.releaseDate, beforeRelease), false);
    assert.deepEqual(upcoming.featuredTracks, []);
    const released = applyPublicCatalog(artist, data, sourceUrl, new Date("2026-10-13T04:00:00Z"));
    assert.equal(released.featuredTracks[0].audioSrc, song.audioSrc);
});

test("required catalogs without a configured URL fail closed instead of reviving local songs", async (t) => {
    t.mock.method(console, "error", () => {});
    for (const configuredUrl of [undefined, "", "  "]) {
        const result = await fetchArtistCatalog({ ...artist, catalogRequired: true }, configuredUrl, () => assert.fail("No fetch expected"));
        assert.equal(result.catalogStatus, "unavailable");
        assert.deepEqual(result.albums, []);
        assert.deepEqual(result.featuredTracks, []);
        assert.equal(result.hero.description, artist.hero.description);
    }
});

test("only explicit editorial slug and album-title keys survive, never duplicated local catalog fields", () => {
    const stale = structuredClone(artist);
    stale.albums[0] = {
        id: "local", title: "Album", releaseDate: "1990-01-01", coverSrc: "/stale-cover.jpg",
        tagline: "Stale tagline", description: "Stale album description", highlightTrack: "Song",
        tracks: [{ title: "Song", publicSlug: "exact-publisher-slug", audioSrc: "/old.mp3", previewStartTime: 999, previewStartLabel: "Old preview", featured: true, releaseDate: "1990-01-01", lyrics: "Private old lyrics", storyBehindTheLyrics: "Private old story", songServiceLinks: [{ url: "https://stale.example/link" }] }],
    };
    stale.featuredTracks[0].description = "Stale feature description";
    const data = feed();
    data.songs[0].title = "Current app title";
    data.songs[0].coverUrl = "https://assets.example.com/current-song.jpg";
    const result = applyPublicCatalog(stale, data, sourceUrl);
    const song = result.albums[0].tracks[0];
    assert.equal(song.title, "Current app title");
    assert.equal(song.previewStartTime, 17.5);
    assert.equal(song.previewStartLabel, undefined);
    assert.equal(song.releaseDate, "2020-01-02");
    assert.equal(result.albums[0].highlightTrack, "Current app title", "editorial highlight follows exact app slug even when its title changes");
    assert.equal(result.featuredTracks[0].title, song.title);
    assert.equal(result.featuredTracks[0].coverSrc, song.songImg);
    assert.equal(result.featuredTracks[0].previewStartTime, song.previewStartTime);
    for (const staleValue of ["/old.mp3", "/stale-cover.jpg", "Private old lyrics", "Private old story", "stale.example", "Old preview", "Stale tagline", "Stale album description", "Stale feature description"]) {
        assert.equal(JSON.stringify({ albums: result.albums, featuredTracks: result.featuredTracks }).includes(staleValue), false, staleValue);
    }
});

test("editorial features and highlights do not silently match a different song by its display title", () => {
    const data = feed();
    data.songs[0].slug = "replacement-song";
    const result = applyPublicCatalog(artist, data, sourceUrl);
    assert.equal(result.albums[0].highlightTrack, undefined);
    assert.equal(result.featuredTracks.length, 1, "a public playable replacement can still be automatically featured");
    assert.equal(result.featuredTracks[0].songSlug, "replacement-song");
    assert.equal(result.featuredTracks[0].subtitle, "Album");
    assert.equal(result.featuredTracks[0].description, undefined);
    assert.equal(result.featuredTracks[0].featureDate, "2020-02-01");
});

test("features the newest eligible feature date, not the newest release date", () => {
    const data = feed();
    data.songs = [
        { ...data.songs[0], songId: "old", slug: "old", title: "Newer release", releaseDate: "2026-10-11", featureDate: "2026-10-01", sortOrder: 1 },
        { ...data.songs[0], songId: "latest", slug: "latest", title: "Newest feature", releaseDate: "2020-01-01", featureDate: "2026-10-11", sortOrder: 2, previewStartSeconds: 42, coverUrl: "https://assets.example.com/newest.jpg", mainAudioUrl: "https://app.example.com/audio/latest" },
        { ...data.songs[0], songId: "no-audio", slug: "no-audio", title: "No public audio", releaseDate: "2026-10-12", featureDate: "2026-10-12", mainAudioUrl: undefined, sortOrder: 0 },
        { ...data.songs[0], songId: "future", slug: "future", title: "Future release", releaseDate: "2099-01-01", featureDate: "2026-10-12", sortOrder: 3 },
        { ...data.songs[0], songId: "undated", slug: "undated", title: "Undated release", albumId: undefined, releaseDate: undefined, featureDate: "2026-10-12", sortOrder: 4 },
        { ...data.songs[0], songId: "future-feature", slug: "future-feature", title: "Future feature", featureDate: "2026-10-13", sortOrder: 5 },
    ];
    const result = applyPublicCatalog(artist, data, sourceUrl, new Date("2026-10-12T16:00:00Z"));
    assert.equal(result.featuredTracks.length, 1);
    const expected = {
        songSlug: "latest", title: "Newest feature", subtitle: "Album", featureDate: "2026-10-11",
        audioSrc: "https://app.example.com/audio/latest", coverSrc: "https://assets.example.com/newest.jpg", previewStartTime: 42,
    };
    for (const [key, value] of Object.entries(expected)) assert.equal(result.featuredTracks[0][key], value, key);
    assert.deepEqual(result.albums.flatMap((album) => album.tracks).filter((track) => track.featured).map((track) => track.publicSlug), ["latest"]);
});

test("future features activate at New York midnight, including future release eligibility", () => {
    const data = feed();
    data.songs.push({ ...data.songs[0], songId: "scheduled", slug: "scheduled", featureDate: "2026-10-13", releaseDate: "2026-10-13", sortOrder: 1 });
    assert.equal(applyPublicCatalog(artist, data, sourceUrl, new Date("2026-10-13T03:59:59Z")).featuredTracks[0].songSlug, "exact-publisher-slug");
    assert.equal(applyPublicCatalog(artist, data, sourceUrl, new Date("2026-10-13T04:00:00Z")).featuredTracks[0].songSlug, "scheduled");
    data.songs[1].featureDate = "2026-12-01";
    data.songs[1].releaseDate = "2026-10-13";
    assert.equal(applyPublicCatalog(artist, data, sourceUrl, new Date("2026-12-01T04:59:59Z")).featuredTracks[0].songSlug, "exact-publisher-slug");
    assert.equal(applyPublicCatalog(artist, data, sourceUrl, new Date("2026-12-01T05:00:00Z")).featuredTracks[0].songSlug, "scheduled");
});

test("clearing feature dates and blank, invalid or all-future dates leave no featured hero", () => {
    const initial = applyPublicCatalog(artist, feed(), sourceUrl);
    assert.equal(initial.featuredTracks.length, 1);
    const legacyEditorial = { ...initial, catalogEditorial: { ...initial.catalogEditorial, features: [{ ...initial.catalogEditorial.features[0], featureDate: "2020-01-01" }] } };
    for (const featureDate of [undefined, null, "", "  ", "2026-02-30", "2025-02-29", "2026-13-01", "0000-01-01", "10/12/2026", "2026-10-12T00:00:00Z", "2026-10-13", 20261012]) {
        const data = feed();
        data.songs[0].featureDate = featureDate;
        const result = applyPublicCatalog(legacyEditorial, data, sourceUrl, new Date("2026-10-12T16:00:00Z"));
        assert.equal(result.albums[0].tracks.length, 1, "bad optional scheduling must not remove valid songs");
        assert.deepEqual(result.featuredTracks, [], String(featureDate));
        assert.equal(result.albums[0].tracks[0].featured, false);
    }
    assert.equal(musicFeatureDateIso("2024-02-29"), "2024-02-29");
    assert.equal(musicFeatureDateIso("2026-02-29"), undefined);
});

test("equal feature dates preserve feed sort order then original feed order across albums", () => {
    const data = feed();
    data.albums.push({ ...data.albums[0], id: "album-2", title: "Second album", sortOrder: 1 });
    data.songs.push({ ...data.songs[0], songId: "first-feature", slug: "first-feature", albumId: "album-2", sortOrder: -1 });
    const now = new Date("2026-10-12T16:00:00Z");
    assert.equal(applyPublicCatalog(artist, data, sourceUrl, now).featuredTracks[0].songSlug, "first-feature");
    data.songs[1].sortOrder = 0;
    assert.equal(applyPublicCatalog(artist, data, sourceUrl, now).featuredTracks[0].songSlug, "exact-publisher-slug");
});

test("FATE and Buried In Ruin schedule independently without sharing current or future choices", () => {
    const fateFeed = feed();
    const buriedFeed = feed();
    buriedFeed.artist = { id: "buried-artist", name: "Buried In Ruin" };
    buriedFeed.songs = [
        { ...buriedFeed.songs[0], artistId: "buried-artist", songId: "buried-current", slug: "buried-current", featureDate: "2026-10-11" },
        { ...buriedFeed.songs[0], artistId: "buried-artist", songId: "buried-next", slug: "buried-next", featureDate: "2026-10-13", sortOrder: 1 },
    ];
    const now = new Date("2026-10-12T16:00:00Z");
    const fate = applyPublicCatalog(artist, fateFeed, sourceUrl, now);
    const buried = applyPublicCatalog({ ...artist, id: "buried-in-ruin", name: "Buried In Ruin" }, buriedFeed, sourceUrl.replace("artist-1", "buried-artist"), now);
    assert.equal(fate.featuredTracks[0].songSlug, "exact-publisher-slug");
    assert.equal(buried.featuredTracks[0].songSlug, "buried-current");
    buriedFeed.songs[0].featureDate = undefined;
    assert.deepEqual(applyPublicCatalog({ ...artist, id: "buried-in-ruin" }, buriedFeed, sourceUrl.replace("artist-1", "buried-artist"), now).featuredTracks, []);
    assert.equal(applyPublicCatalog(artist, fateFeed, sourceUrl, now).featuredTracks[0].songSlug, "exact-publisher-slug");
});

test("the hero selector never falls back to future, blank, invalid or roll-over feature dates", () => {
    const now = new Date("2026-10-13T03:59:59Z");
    const past = { title: "Past", featureDate: "2026-10-01" };
    const today = { title: "Today", featureDate: "2026-10-12" };
    const future = { title: "Future", featureDate: "2026-10-13" };
    assert.equal(getCurrentFeaturedTrack([future, past, today], now), today);
    assert.equal(getCurrentFeaturedTrack([future], now), null);
    assert.equal(getCurrentFeaturedTrack([future], new Date("2026-10-13T04:00:00Z")), future);
    assert.equal(getCurrentFeaturedTrack([today, { ...today, title: "Tie" }], now), today);
    for (const featureDate of [undefined, "", "2026-02-30", "10/12/2026", "not-a-date"]) assert.equal(getCurrentFeaturedTrack([{ featureDate }], now), null);
    assert.equal(getCurrentFeaturedTrack([], now), null);
});

test("removing or unpublishing an editorial feature cannot restore its old audio or story", () => {
    const initial = applyPublicCatalog(artist, feed(), sourceUrl);
    assert.equal(initial.featuredTracks.length, 1);
    const data = feed();
    data.songs = [];
    const revoked = applyPublicCatalog(initial, data, sourceUrl);
    assert.deepEqual(revoked.albums, []);
    assert.deepEqual(revoked.featuredTracks, []);
    const republished = feed();
    delete republished.songs[0].mainAudioUrl;
    delete republished.songs[0].behindTheMusic;
    const noAudio = applyPublicCatalog(initial, republished, sourceUrl);
    assert.deepEqual(noAudio.featuredTracks, []);
    assert.equal(noAudio.albums[0].tracks[0].audioSrc, "");
    assert.equal(noAudio.albums[0].tracks[0].behindTheMusic, undefined);
});

test("empty feed removes all static albums and featured audio", () => {
    const data = feed(); data.albums = []; data.songs = [];
    const result = applyPublicCatalog(artist, data, sourceUrl);
    assert.deepEqual(result.albums, []);
    assert.deepEqual(result.featuredTracks, []);
    assert.equal(result.catalogStatus, "ready");
});

test("missing published audio never falls back to local files", () => {
    const data = feed(); delete data.songs[0].mainAudioUrl; data.songs[0].behindTheMusic = "  ";
    const result = applyPublicCatalog(artist, data, sourceUrl);
    assert.equal(result.albums[0].tracks[0].audioSrc, "");
    assert.equal(result.albums[0].tracks[0].behindTheMusic, undefined);
    assert.deepEqual(result.featuredTracks, []);
    assert.equal(isCatalogSongReleased(undefined), false);
    assert.equal(isCatalogSongReleased("not-a-date"), false);
});

test("future release uses song override before featured visibility", () => {
    const data = feed(); data.songs[0].releaseDate = "2099-02-01";
    const result = applyPublicCatalog(artist, data, sourceUrl, new Date("2026-10-12T12:00:00"));
    assert.equal(result.albums[0].tracks[0].releaseDate, "2099-02-01");
    assert.deepEqual(result.featuredTracks, []);
    assert.equal(isFutureCatalogRelease("2026-10-13", new Date("2026-10-12T12:00:00")), true);
    assert.equal(isFutureCatalogRelease("2026-10-12", new Date("2026-10-12T12:00:00")), false);
});

test("undated catalog songs do not enter featured playback", () => {
    const data = feed(); delete data.albums[0].releaseDate;
    const result = applyPublicCatalog(artist, data, sourceUrl);
    assert.equal(result.albums[0].tracks[0].releaseDate, undefined);
    assert.deepEqual(result.featuredTracks, []);
});

test("rejects duplicate slugs, wrong artist, broken references and invalid dates", () => {
    const mutations = [
        (data) => { data.songs.push({ ...data.songs[0], songId: "other" }); },
        (data) => { data.artist.id = "wrong"; },
        (data) => { data.songs[0].artistId = "wrong"; },
        (data) => { data.songs[0].albumId = "missing"; },
        (data) => { data.songs[0].releaseDate = "2026-02-30"; },
        (data) => { data.songs[0].slug = "../private"; },
        (data) => { data.schemaVersion = 9; },
    ];
    for (const mutate of mutations) {
        const data = feed(); mutate(data);
        assert.throws(() => applyPublicCatalog(artist, data, sourceUrl));
    }
});

test("omits unsafe media and links, preserves text as text, handles singles", () => {
    const data = feed();
    data.albums = []; delete data.songs[0].albumId;
    data.songs[0].mainAudioUrl = "javascript:alert(1)";
    data.songs[0].coverUrl = "http://example.com/cover.jpg";
    data.songs[0].behindTheMusic = "<script>not markup</script>";
    data.songs[0].previewStartSeconds = -10;
    data.songs[0].serviceLinks.push({ service: "bad", url: "javascript:alert(1)" });
    const result = applyPublicCatalog(artist, data, sourceUrl);
    assert.equal(result.albums[0].title, "Singles");
    const song = result.albums[0].tracks[0];
    assert.equal(song.audioSrc, "");
    assert.equal(song.songImg, "/brand.png");
    assert.equal(song.previewStartTime, 0);
    assert.equal(song.behindTheMusic, "<script>not markup</script>");
    assert.equal(song.songServiceLinks.length, 1);
});

test("honors catalog ordering instead of stale local track order", () => {
    const data = feed();
    data.songs.push({ ...data.songs[0], songId: "song-2", slug: "another", title: "Another", sortOrder: -1 });
    const result = applyPublicCatalog(artist, data, sourceUrl);
    assert.deepEqual(result.albums[0].tracks.map((song) => song.title), ["Another", "Song"]);
});

test("unconfigured keeps static site, configured requests are uncached and bounded", async () => {
    const optionalArtist = { ...artist, catalogRequired: false };
    assert.equal(await fetchArtistCatalog(optionalArtist, "", () => assert.fail("No fetch expected")), optionalArtist);
    const result = await fetchArtistCatalog(artist, sourceUrl, async (url, options) => {
        assert.equal(url, sourceUrl);
        assert.equal(options.cache, "no-store");
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        return Response.json(feed());
    });
    assert.equal(result.catalogStatus, "ready");
});

test("development accepts exact loopback feeds and their same-origin public audio", async (t) => {
    setNodeEnv(t, "development");
    for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
        const localUrl = `http://${host}:3000/api/music/public-catalog/owner/artist-1`;
        for (const audioUrl of ["/api/music/public-audio/by-id/owner/song-1", `http://${host}:3000/api/music/public-audio/by-id/owner/song-1`]) {
            const data = feed();
            data.songs[0].mainAudioUrl = audioUrl;
            const result = await fetchArtistCatalog(artist, localUrl, async (url, options) => {
                assert.equal(url, localUrl);
                assert.equal(options.redirect, "error", "the local feed cannot redirect to another endpoint");
                return Response.json(data);
            });
            assert.equal(result.catalogStatus, "ready");
            assert.equal(result.albums[0].tracks[0].audioSrc, `http://${host}:3000/api/music/public-audio/by-id/owner/song-1`);
            assert.equal(result.featuredTracks.length, 1);
        }
    }
});

test("development HTTP audio stays on the configured local origin and never relaxes artwork or service URLs", (t) => {
    setNodeEnv(t, "development");
    const localUrl = "http://localhost:3000/api/music/public-catalog/owner/artist-1";
    for (const audioUrl of ["http://example.com/audio", "http://127.0.0.1:3000/audio", "http://localhost:3001/audio", "http://localhost.example.com:3000/audio", "http://user:password@localhost:3000/audio", "javascript:alert(1)"]) {
        const data = feed();
        data.songs[0].mainAudioUrl = audioUrl;
        const song = applyPublicCatalog(artist, data, localUrl).albums[0].tracks[0];
        assert.equal(song.audioSrc, "", audioUrl);
    }
    const data = feed();
    data.albums[0].coverUrl = "http://localhost:3000/album.jpg";
    data.songs[0].coverUrl = "http://localhost:3000/song.jpg";
    data.songs[0].serviceLinks.push({ service: "local", url: "http://localhost:3000/listen" });
    const result = applyPublicCatalog(artist, data, localUrl);
    assert.equal(result.albums[0].coverSrc, "/brand.png");
    assert.equal(result.albums[0].tracks[0].songImg, "/brand.png");
    assert.equal(result.albums[0].tracks[0].songServiceLinks.length, 1);
    for (const invalidSource of ["http://localhost:3000/api/private/owner/artist-1", "http://user:password@localhost:3000/api/music/public-catalog/owner/artist-1"]) {
        assert.equal(applyPublicCatalog(artist, data, invalidSource).albums[0].tracks[0].audioSrc, "");
    }
});

test("HTTP feeds and audio remain unavailable outside development", async (t) => {
    setNodeEnv(t, undefined);
    t.mock.method(console, "error", () => {});
    for (const environment of [undefined, "test", "production"]) {
        if (environment === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = environment;
        for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
            const localUrl = `http://${host}:3000/api/music/public-catalog/owner/artist-1`;
            const result = await fetchArtistCatalog(artist, localUrl, () => assert.fail("No HTTP fetch allowed"));
            assert.equal(result.catalogStatus, "unavailable");
            assert.equal(applyPublicCatalog(artist, feed(), localUrl).albums[0].tracks[0].audioSrc, "");
        }
    }
});

test("development rejects non-loopback HTTP, credentials and non-catalog paths", async (t) => {
    setNodeEnv(t, "development");
    t.mock.method(console, "error", () => {});
    const invalidUrls = [
        "http://example.com/api/music/public-catalog/owner/artist-1",
        "http://localhost.example.com/api/music/public-catalog/owner/artist-1",
        "http://192.168.1.2/api/music/public-catalog/owner/artist-1",
        "http://user:password@localhost:3000/api/music/public-catalog/owner/artist-1",
        "http://localhost:3000/api/music/public-songs/owner/song",
        "http://localhost:3000/api/private/owner/artist-1",
        "http://localhost:3000/api/music/public-catalog/owner/artist-1/extra",
    ];
    for (const url of invalidUrls) {
        const result = await fetchArtistCatalog(artist, url, () => assert.fail(`No fetch allowed: ${url}`));
        assert.equal(result.catalogStatus, "unavailable", url);
    }
    const redirected = await fetchArtistCatalog(artist, "http://localhost:3000/api/music/public-catalog/owner/artist-1", async (_url, options) => {
        assert.equal(options.redirect, "error");
        return new Response(null, { status: 302, headers: { Location: "http://example.com/catalog" } });
    });
    assert.equal(redirected.catalogStatus, "unavailable");
});

test("outage, invalid config and malformed feed fail closed", async (t) => {
    t.mock.method(console, "error", () => {});
    const responses = [() => new Response("Unavailable", { status: 503 }), () => Response.json({}), () => { throw new Error("Offline"); }];
    for (const response of responses) {
        const result = await fetchArtistCatalog(artist, sourceUrl, async () => response());
        assert.equal(result.catalogStatus, "unavailable");
        assert.deepEqual(result.albums, []);
        assert.deepEqual(result.featuredTracks, []);
    }
    const result = await fetchArtistCatalog(artist, "http://example.com/unsafe", () => assert.fail("No fetch expected"));
    assert.equal(result.catalogStatus, "unavailable");
});

test("preview start clamps corrupt and outdated values", () => {
    assert.equal(clampAudioPreviewStart(17.5, 100), 17.5);
    assert.equal(clampAudioPreviewStart(300, 100), 99.9);
    assert.equal(clampAudioPreviewStart(-2, 100), 0);
    assert.equal(clampAudioPreviewStart(Infinity, 100), 0);
    assert.equal(clampAudioPreviewStart(undefined, 100), 0);
});

test("canonical camelCase streaming services use the site's icon networks", () => {
    const data = feed();
    data.songs[0].serviceLinks = ["appleMusic", "amazonMusic", "youtubeMusic", "iTunes"].map((service) => ({ service, url: `https://example.com/${service}` }));
    assert.deepEqual(applyPublicCatalog(artist, data, sourceUrl).albums[0].tracks[0].songServiceLinks.map((link) => link.network), ["apple", "amazon", "youtube-music", "apple"]);
});

test("date-only release neither displays nor becomes playable a day early in New York", () => {
    const beforeLocalMidnight = new Date("2026-10-13T00:30:00Z");
    assert.equal(isFutureCatalogRelease("2026-10-13", beforeLocalMidnight), true);
    assert.equal(isFutureCatalogRelease("10/13/2026", beforeLocalMidnight), true);
    assert.equal(isFutureCatalogRelease("2026-10-13", new Date("2026-10-13T04:00:00Z")), false);
    assert.equal(musicReleaseDateIso("10/13/2026"), "2026-10-13");
    assert.equal(parseMusicReleaseDate("2026-10-13").toLocaleDateString("en-US", { timeZone: "UTC" }), "10/13/2026");
    assert.equal(parseMusicReleaseDate("2026-02-30"), null);
});
