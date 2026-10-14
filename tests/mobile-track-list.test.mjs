import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as publicCatalog from "../lib/public-catalog.ts";

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
            if (name === "react") return React;
            if (name === "react/jsx-runtime") return jsxRuntime;
            if (Object.hasOwn(imports, name)) return imports[name];
            throw new Error(`Unexpected test import: ${name}`);
        },
    });
    return exports;
}

function renderAlbum(tracks, releaseDate = "2020-01-01", artistId = "fate") {
    const images = [];
    const players = [];
    const { AlbumsSection } = loadComponent("discography", {
        "next/image": { default: (props) => { images.push(props); return null; } },
        "next/link": { default: (props) => React.createElement("a", props) },
        "lucide-react": Object.fromEntries(["CalendarDays", "ChevronLeft", "ChevronRight", "Disc3", "Star"].map((name) => [name, () => null])),
        "@/app/components/audio-track": { AudioTrack: (props) => { players.push(props); return null; } },
        "@/app/config/artists": { getArtistSongPath: (artist, slug) => `${artist.musicPathPrefix}/${slug}` },
        "@/app/config/music-data": { getTrackSlug: (track) => track.publicSlug },
        "@/lib/public-catalog": publicCatalog,
    });
    const html = renderToStaticMarkup(React.createElement(AlbumsSection, {
        artist: {
            id: artistId, musicPathPrefix: "/music", musicSection: { title: "Music" },
            albums: [{ id: "album", title: "Album", coverSrc: "/album.jpg", releaseDate, tracks }],
        },
    }));
    return { html, images, players };
}

const track = (overrides = {}) => ({
    title: "Song", publicSlug: "song", publicSongId: "song-id", audioSrc: "/song.mp3", ...overrides,
});

test("mobile track artwork prefers the single cover and falls back to the album cover", () => {
    const { images } = renderAlbum([track({ songImg: "/single.jpg" }), track({ title: "Album track", publicSongId: "song-2" })]);
    const thumbnails = images.filter((image) => image.sizes === "64px");
    assert.deepEqual(thumbnails.map((image) => image.src), ["/single.jpg", "/album.jpg"]);
    assert.ok(thumbnails.every((image) => image.alt === "" && image.fill));
});

test("both artists use named compact players without changing their playback start or identity", () => {
    for (const artistId of ["fate", "buried-in-ruin"]) {
        const { players, html } = renderAlbum([track({ previewStartTime: 30, trackNumber: 7 })], undefined, artistId);
        assert.equal(players.length, 1);
        assert.equal(players[0].compactOnMobile, true);
        assert.equal(players[0].trackTitle, "Song");
        assert.equal(players[0].previewStartTime, 0);
        assert.equal(players[0].id, "song-id");
        assert.equal(players[0].projectId, artistId);
        assert.equal(typeof players[0].onPlay, "function");
        assert.equal(typeof players[0].onPause, "function");
        assert.match(html, />07<\/span>/);
    }
});

test("compact lists still withhold unreleased audio and keep unavailable tracks visible", () => {
    const { players, html, images } = renderAlbum([
        track({ title: "Future song", releaseDate: "2999-01-01" }),
        track({ title: "Missing audio", publicSongId: "song-2", audioSrc: "" }),
    ]);
    assert.equal(players.length, 0);
    assert.equal(images.filter((image) => image.sizes === "64px").length, 2);
    assert.match(html, /Future song/);
    assert.match(html, /Available/);
    assert.match(html, /Audio preview unavailable/);
    const tbd = renderAlbum([track()], "");
    assert.equal(tbd.players.length, 0);
    assert.match(tbd.html, /Release date TBD/);
});

test("compact player is opt-in and retains named, keyboard-accessible seek controls", () => {
    const { AudioTrack } = loadComponent("audio-track", {
        "lucide-react": { Play: () => null, Pause: () => null },
        "@/app/context/audio-manager": { useAudioManager: () => ({ registerAudio: () => () => {} }) },
        "@/lib/track-interaction": { trackInteraction: () => {} },
        "@/lib/audio-preview": { clampAudioPreviewStart: () => 0 },
    });
    const standard = renderToStaticMarkup(React.createElement(AudioTrack, { id: "song", src: "/song.mp3" }));
    assert.doesNotMatch(standard, /audio-track--compact/);
    const compact = renderToStaticMarkup(React.createElement(AudioTrack, {
        id: "song-id", src: "/song.mp3", compactOnMobile: true, trackTitle: "Song title",
    }));
    assert.match(compact, /audio-track--compact/);
    assert.match(compact, /aria-label="Play Song title"/);
    assert.match(compact, /aria-label="Seek Song title"/);
    assert.match(compact, /type="range"/);
    assert.match(compact, /aria-valuetext="0:00 of 0:00"/);
    assert.match(compact, /--audio-progress:0%/);
});
