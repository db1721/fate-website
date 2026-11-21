import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const jsx = (type, props) => ({ type, props });

function loadComponent(file, imports, globals = {}) {
    const source = readFileSync(new URL(`../app/components/${file}.tsx`, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const exports = {};
    runInNewContext(compiled, {
        exports, DOMException, ...globals,
        require(name) {
            if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
            if (name.endsWith(".module.css")) return { default: new Proxy({}, { get: (_, key) => key }) };
            if (Object.hasOwn(imports, name)) return imports[name];
            throw new Error(`Unexpected import: ${name}`);
        },
    });
    return exports;
}

function findAll(node, predicate) {
    if (!node || typeof node !== "object") return [];
    if (Array.isArray(node)) return node.flatMap((child) => findAll(child, predicate));
    return [...(predicate(node) ? [node] : []), ...findAll(node.props?.children, predicate)];
}

const Player = () => null;
const Link = () => null;
const Image = () => null;
const { HeroSection } = loadComponent("hero", {
    "next/image": { default: Image },
    "next/link": { default: Link },
    "lucide-react": { ArrowDown: () => null, ArrowUpRight: () => null },
    "@/app/components/audio-track": { AudioTrack: Player },
    "@/app/config/artists": { getArtistSongPath: (artist, slug) => `${artist.musicPathPrefix}/${slug}` },
    "@/lib/utils": { slugify: () => { throw new Error("Publisher slug should be preserved"); } },
});

function artist(id) {
    return {
        id, name: id === "fate" ? "F.A.T.E." : "Buried In Ruin", fullName: "Fight Against the Enemy",
        logo: "/logo.png", logoAlt: "Artist", musicPathPrefix: id === "fate" ? "/music" : "/buried-in-ruin/music",
        catalogStatus: "ready", hero: {
            image: id === "fate" ? "/portrait.jpg" : undefined, secondaryCta: "Explore the music",
            noFeatureTitle: "More music soon", noFeatureDescription: "Check back for the next release.",
        },
    };
}

const featuredTrack = {
    songSlug: "exact.Publisher_Slug", title: "Featured song", subtitle: "Published album",
    audioSrc: "https://audio.example/song", coverSrc: "https://images.example/cover.jpg", previewStartTime: 46,
};

test("both heroes keep the publisher's exact destination, audio and preview offset with one direct player", () => {
    for (const id of ["fate", "buried-in-ruin"]) {
        const config = artist(id);
        const tree = HeroSection({ artist: config, featuredTrack });
        const players = findAll(tree, (node) => node.type === Player);
        assert.equal(players.length, 1);
        assert.equal(players[0].props.src, featuredTrack.audioSrc);
        assert.equal(players[0].props.previewStartTime, 46);
        assert.equal(players[0].props.projectId, id);
        assert.equal(players[0].props.trackTitle, featuredTrack.title);
        assert.equal(players[0].props.appearance, "hero");
        const links = findAll(tree, (node) => node.type === Link);
        assert.equal(links.length, 1, "only the secondary lyrics/streaming action navigates");
        assert.equal(links[0].props.href, `${config.musicPathPrefix}/${featuredTrack.songSlug}`);
        const imagery = findAll(tree, (node) => node.type === Image && node.props.fill);
        assert.equal(imagery[0].props.src, id === "fate" ? "/portrait.jpg" : featuredTrack.coverSrc);
    }
});

test("missing features never invent audio or a song destination", () => {
    for (const id of ["fate", "buried-in-ruin"]) {
        const tree = HeroSection({ artist: artist(id), featuredTrack: null });
        assert.equal(findAll(tree, (node) => node.type === Player).length, 0);
        assert.equal(findAll(tree, (node) => node.type === Link).length, 0);
        assert.equal(findAll(tree, (node) => node.type === "a")[0].props.href, "#albums");
    }
});

function makePlayer() {
    const states = [];
    const refs = [];
    const effects = [];
    let stateIndex = 0;
    let refIndex = 0;
    let initial = true;
    const tracked = [];
    const react = {
        useState(value) {
            const index = stateIndex++;
            if (initial) states[index] = value;
            return [states[index], (next) => { states[index] = next; }];
        },
        useRef(value) {
            const index = refIndex++;
            if (initial) refs[index] = { current: value };
            return refs[index];
        },
        useEffect(callback) { if (initial) effects.push(callback); },
        useId: () => "audio-error",
    };
    const { AudioTrack } = loadComponent("audio-track", {
        react,
        "lucide-react": { Play: () => null, Pause: () => null },
        "@/app/context/audio-manager": { useAudioManager: () => ({ registerAudio: () => () => {} }) },
        "@/lib/track-interaction": { trackInteraction: (event) => tracked.push(event) },
        "@/lib/audio-preview": { clampAudioPreviewStart: (value, duration) => Math.min(value ?? 0, duration) },
    }, {
        window: { setInterval: () => 1, setTimeout: () => 1, clearInterval() {}, clearTimeout() {} },
    });
    const audio = new EventTarget();
    Object.assign(audio, {
        paused: true, currentTime: 0, duration: 200, readyState: 1, preload: "none", loads: 0, plays: 0,
        load() { this.loads++; },
        play() { this.plays++; return this.playResult?.() ?? Promise.resolve(); },
        pause() { this.paused = true; },
    });
    function render() {
        stateIndex = 0;
        refIndex = 0;
        return AudioTrack({ id: "song-feature", src: "/song.mp3", trackTitle: "Song", previewStartTime: 46, appearance: "hero" });
    }
    const first = render();
    findAll(first, (node) => node.type === "audio")[0].props.ref.current = audio;
    effects.forEach((effect) => effect());
    initial = false;
    return {
        audio, tracked, render,
        button: () => findAll(render(), (node) => node.type === "button")[0],
        media: () => findAll(render(), (node) => node.type === "audio")[0],
    };
}

test("hero preview plays in place and shows loading, pause and named seek controls", () => {
    const player = makePlayer();
    assert.equal(player.audio.currentTime, 46);
    assert.equal(findAll(player.render(), (node) => node.type === "input")[0].props["aria-label"], "Seek Song");
    player.button().props.onClick();
    assert.equal(player.audio.plays, 1);
    assert.equal(player.button().props["aria-busy"], true);
    player.audio.paused = false;
    player.media().props.onPlay({ currentTarget: player.audio });
    player.media().props.onPlaying();
    assert.equal(player.button().props["aria-label"], "Pause preview of Song");
    assert.equal(player.tracked.length, 1);
    player.button().props.onClick();
    player.media().props.onPause();
    assert.equal(player.audio.paused, true);
    assert.equal(player.button().props["aria-label"], "Play preview of Song");
});

test("a failed hero preview exposes recovery and retries the same recording", async () => {
    const player = makePlayer();
    player.audio.playResult = () => Promise.reject(new Error("Network failure"));
    player.button().props.onClick();
    await new Promise(setImmediate);
    const alerts = findAll(player.render(), (node) => node.props.role === "alert");
    assert.equal(alerts.length, 1);
    assert.equal(player.button().props["aria-describedby"], alerts[0].props.id);
    const previousLoads = player.audio.loads;
    player.audio.playResult = () => Promise.resolve();
    player.button().props.onClick();
    assert.equal(player.audio.loads, previousLoads + 1);
    assert.equal(player.audio.plays, 2);
    assert.equal(findAll(player.render(), (node) => node.props.role === "alert").length, 0);
});

test("canceling a pending preview ignores its late rejection", async () => {
    const player = makePlayer();
    let rejectPlay;
    player.audio.playResult = () => new Promise((_, reject) => { rejectPlay = reject; });
    player.button().props.onClick();
    assert.equal(player.button().props["aria-busy"], true);
    player.button().props.onClick();
    rejectPlay(new Error("Canceled request"));
    await new Promise(setImmediate);
    assert.equal(player.button().props["aria-busy"], undefined);
    assert.equal(findAll(player.render(), (node) => node.props.role === "alert").length, 0);
    assert.equal(player.tracked.length, 0);
});

test("replacing the recording clears obsolete playback and seek state", () => {
    const player = makePlayer();
    player.button().props.onClick();
    player.audio.paused = false;
    player.media().props.onPlay({ currentTarget: player.audio });
    player.media().props.onPlaying();
    player.media().props.onEmptied();
    const seek = findAll(player.render(), (node) => node.type === "input")[0];
    assert.equal(seek.props.value, 0);
    assert.equal(seek.props.disabled, true);
    assert.equal(player.button().props["aria-label"], "Play preview of Song");
});
