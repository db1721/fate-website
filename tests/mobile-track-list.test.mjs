import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as publicCatalog from "../lib/public-catalog.ts";
import * as audioPreview from "../lib/audio-preview.ts";

function loadComponent(name, imports) {
    const source = readFileSync(new URL(`../app/components/${name}.tsx`, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.ReactJSX,
        },
    }).outputText;
    const exports = {};
    runInNewContext(compiled, {
        exports,
        require(name) {
            if (Object.hasOwn(imports, name)) return imports[name];
            if (name === "react") return React;
            if (name === "react/jsx-runtime") return jsxRuntime;
            throw new Error(`Unexpected test import: ${name}`);
        },
    });
    return exports;
}

function renderCatalog(albums, artistId = "fate", featuredAlbumId, desktop = false) {
    const images = [];
    const players = [];
    const buttons = new Map();
    const selectedTracks = [];
    function captureButtons(render) {
        return (type, props, key) => {
            if (type === "button" && props["aria-label"]) buttons.set(props["aria-label"], props);
            return render(type, props, key);
        };
    }
    const { AlbumsSection } = loadComponent("discography", {
        react: { ...React, useSyncExternalStore: () => desktop },
        "react-dom": { createPortal: () => assert.fail("A dock should not appear before track selection") },
        "react/jsx-runtime": { ...jsxRuntime, jsx: captureButtons(jsxRuntime.jsx), jsxs: captureButtons(jsxRuntime.jsxs) },
        "next/image": { default: (props) => { images.push(props); return null; } },
        "next/link": { default: (props) => React.createElement("a", props) },
        "lucide-react": Object.fromEntries(["Pause", "Play", "Star"].map((name) => [name, () => null])),
        "@/app/components/audio-track": { AudioTrack: (props) => { players.push(props); return null; } },
        "@/app/components/mobile-docked-player": { MobileDockedPlayer: () => null },
        "@/app/components/use-docked-playback": {
            useDockedPlayback: (project) => ({
                audioRef: { current: null },
                activeTrack: null,
                toggleTrack: (track) => selectedTracks.push({ project, ...track }),
            }),
        },
        "@/app/config/artists": { getArtistSongPath: (artist, slug) => `${artist.musicPathPrefix}/${slug}` },
        "@/app/config/music-data": { getTrackSlug: (track) => track.publicSlug },
        "@/lib/public-catalog": publicCatalog,
    });
    const html = renderToStaticMarkup(React.createElement(AlbumsSection, {
        artist: {
            id: artistId, musicPathPrefix: artistId === "fate" ? "/music" : "/buried-in-ruin/music", musicSection: { title: "Music" },
            albums,
        },
        featuredAlbumId,
    }));
    return { html, images, players, buttons, selectedTracks };
}

function renderAlbum(tracks, { releaseDate = "2020-01-01", artistId = "fate", desktop = false } = {}) {
    return renderCatalog([{ id: "album", title: "Album", coverSrc: "/album.jpg", releaseDate, tracks }], artistId, undefined, desktop);
}

const track = (overrides = {}) => ({
    title: "Song", publicSlug: "song", publicSongId: "song-id", audioSrc: "/song.mp3", ...overrides,
});

test("release choices display album names and select the featured album even when it is listed second", () => {
    const albums = [
        { id: "older", title: "First Album", tracks: [], coverSrc: "/first.jpg" },
        { id: "featured", title: "Current Album", tracks: [], coverSrc: "/current.jpg" },
    ];
    const { html, images } = renderCatalog(albums, "fate", "featured");
    assert.match(html, /aria-pressed="false"[^>]*>First Album<\/button>/);
    assert.match(html, /aria-pressed="true"[^>]*>Current Album<\/button>/);
    assert.equal(images[0].src, "/current.jpg");
    assert.equal(renderCatalog(albums).images[0].src, "/first.jpg");
});

test("album descriptions preserve paragraphs and emphasis while escaping publisher text", () => {
    const { html } = renderCatalog([{
        id: "described", title: "Album", coverSrc: "/cover.jpg", tracks: [],
        description: "First paragraph.\n\n*Second* <script>.",
    }]);
    assert.match(html, /<p class="[^"]*\bwhitespace-pre-line\b[^"]*\bbreak-words\b[^"]*">First paragraph\.\n\n<em[^>]*>Second<\/em> &lt;script&gt;\.<\/p>/);
});

test("the album date follows the title, and only the album highlight gets a star in the song list", () => {
    const album = {
        id: "album", title: "New Beginnings", coverSrc: "/cover.jpg", year: 2026, releaseDate: "2026-05-08",
        description: "Album notes.", highlightTrack: "Friends", highlightSongSlug: "friends",
        tracks: [
            track({ title: "Friends", publicSlug: "friends-live", publicSongId: "live", featured: true }),
            track({ title: "Friends", publicSlug: "friends", publicSongId: "single" }),
        ],
    };
    for (const desktop of [false, true]) {
        const { html } = renderCatalog([album], "fate", undefined, desktop);
        assert.match(html, /New Beginnings<\/h3><p[^>]*>[^<]*<time dateTime="2026-05-08">May 8, 2026<\/time>/i);
        assert.match(html, /href="\/music\/friends"[^>]*>Friends<span title="Featured song"/);
        assert.match(html, /href="\/music\/friends-live"[^>]*>Friends<\/a>/);
        assert.doesNotMatch(html, /Open Friends|Streaming platforms|Featured:|2 tracks/);
    }
    const yearOnly = renderCatalog([{ ...album, releaseDate: undefined }]).html;
    assert.match(yearOnly, /<time dateTime="2026">2026<\/time>/i);
    const undated = renderCatalog([{ ...album, releaseDate: undefined, year: 0 }]).html;
    assert.doesNotMatch(undated, /<time\b/);
});

test("mobile rows share an unloaded player and select each track with its public ID, audio and artwork", () => {
    for (const artistId of ["fate", "buried-in-ruin"]) {
        const { html, buttons, players, selectedTracks } = renderAlbum([
            track({ songImg: "/single.jpg", trackNumber: 7, previewStartTime: 30 }),
            track({ title: "Album track", publicSongId: "song-2", publicSlug: "album-track", audioSrc: "/other.mp3" }),
        ], { artistId });
        assert.equal(players.length, 0);
        assert.equal(html.match(/<audio\b/g)?.length, 1);
        assert.match(html, /<audio preload="none"><\/audio>/);
        assert.match(html, />07<\/span>/);
        const prefix = artistId === "fate" ? "/music" : "/buried-in-ruin/music";
        assert.ok(html.includes(`href="${prefix}/song"`));
        assert.ok(html.includes(`href="${prefix}/album-track"`));
        assert.deepEqual([...buttons.keys()], ["Play Song preview", "Play Album track preview"]);
        assert.deepEqual(selectedTracks, []);
        for (const button of buttons.values()) button.onClick({ currentTarget: {} });
        assert.deepEqual(selectedTracks, [
            { project: artistId, id: "song-id", title: "Song", src: "/song.mp3", coverSrc: "/single.jpg" },
            { project: artistId, id: "song-2", title: "Album track", src: "/other.mp3", coverSrc: "/album.jpg" },
        ]);
    }
});

test("both desktop discographies keep a named inline player for each playable track starting at zero", () => {
    for (const artistId of ["fate", "buried-in-ruin"]) {
        const { players, html, buttons } = renderAlbum([
            track({ previewStartTime: 30, trackNumber: 7 }),
            track({ title: "Second", publicSlug: "second", publicSongId: "other-id", audioSrc: "/other.mp3" }),
        ], { artistId, desktop: true });
        assert.deepEqual(players.map(({ id, trackTitle, src }) => [id, trackTitle, src]), [
            ["song-id", "Song", "/song.mp3"], ["other-id", "Second", "/other.mp3"],
        ]);
        for (const props of players) {
            assert.equal(props.previewStartTime, 0);
            assert.equal(props.projectId, artistId);
            assert.equal(typeof props.onPlay, "function");
            assert.equal(typeof props.onPause, "function");
        }
        assert.equal(buttons.size, 0);
        assert.match(html, />07<\/span>/);
    }
});

test("mobile and desktop withhold preview controls for unavailable tracks and link only released songs", () => {
    for (const desktop of [false, true]) {
        const { players, html, buttons } = renderAlbum([
            track({ title: "Future song", publicSlug: "future", releaseDate: "2999-01-01" }),
            track({ title: "Missing audio", publicSongId: "song-2", publicSlug: "missing-audio", audioSrc: "" }),
        ], { desktop });
        assert.equal(players.length, 0);
        assert.equal(buttons.size, 0);
        assert.match(html, /Future song/);
        assert.match(html, /Available/);
        assert.doesNotMatch(html, /href="\/music\/future"/);
        assert.match(html, /href="\/music\/missing-audio"/);
        assert.match(html, /Audio preview unavailable/);
        const tbd = renderAlbum([track()], { releaseDate: "", desktop });
        assert.equal(tbd.players.length, 0);
        assert.equal(tbd.buttons.size, 0);
        assert.match(tbd.html, /Release date TBD/);
        assert.doesNotMatch(tbd.html, /href="\/music\/song"/);
    }
});

test("players label the preview offset and withhold seek and timing until metadata arrives", () => {
    const { AudioTrack } = loadComponent("audio-track", {
        "lucide-react": { Play: () => null, Pause: () => null },
        "@/app/context/audio-manager": { useAudioManager: () => ({ registerAudio: () => () => {} }) },
        "@/lib/track-interaction": { trackInteraction: () => {} },
        "@/lib/audio-preview": audioPreview,
    });
    const standard = renderToStaticMarkup(React.createElement(AudioTrack, {
        id: "song", src: "/song.mp3", previewStartTime: 46,
    }));
    assert.doesNotMatch(standard, /audio-track--compact/);
    assert.match(standard, /Preview starts at 0:46/);
    const compact = renderToStaticMarkup(React.createElement(AudioTrack, {
        id: "song-id", src: "/song.mp3", compactOnMobile: true, trackTitle: "Song title",
    }));
    assert.match(compact, /audio-track--compact/);
    assert.match(compact, /aria-label="Play Song title"/);
    assert.match(compact, /aria-label="Seek Song title"/);
    assert.match(compact, /type="range"/);
    assert.match(compact, /<input\b[^>]*\bdisabled=""/);
    assert.doesNotMatch(compact, /0:00 of 0:00|0:00 \/ 0:00|Preview starts at/);
    assert.match(compact, /--audio-progress:0%/);
});
