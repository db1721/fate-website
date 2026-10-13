import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadAudioManager() {
    const source = readFileSync(new URL("../app/context/audio-manager.tsx", import.meta.url), "utf8");
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
            if (name === "react") return {
                createContext: (value) => ({ Provider: "Provider", value }),
                useContext: (context) => context.value,
                useRef: (value) => ({ current: value }),
                useCallback: (callback) => callback,
                useMemo: (factory) => factory(),
            };
            if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }) };
            throw new Error(`Unexpected import: ${name}`);
        },
    });
    return exports;
}

function makeManager() {
    return loadAudioManager().AudioManagerProvider({ children: null }).props.value;
}

class FakeAudio extends EventTarget {
    paused = true;
    currentTime = 42;
    src = "/same-song.mp3";
    play() {
        this.paused = false;
        this.dispatchEvent(new Event("play"));
    }
    pause() {
        if (this.paused) return;
        this.paused = true;
        this.dispatchEvent(new Event("pause"));
    }
}

test("starting another song pauses the first and preserves its playback position", () => {
    const manager = makeManager();
    const first = new FakeAudio();
    const second = new FakeAudio();
    manager.registerAudio(first);
    manager.registerAudio(second);
    let pauses = 0;
    first.addEventListener("pause", () => pauses++);
    first.play();
    second.play();
    assert.equal(first.paused, true);
    assert.equal(second.paused, false);
    assert.equal(first.currentTime, 42);
    assert.equal(pauses, 1, "the previous player's UI receives a native pause event");
});

test("the hero and album copy of the same song are independent player instances", () => {
    const manager = makeManager();
    const hero = new FakeAudio();
    const album = new FakeAudio();
    manager.registerAudio(hero);
    manager.registerAudio(album);
    assert.equal(hero.src, album.src);
    hero.play();
    album.play();
    assert.equal(hero.paused, true);
    hero.play();
    assert.equal(album.paused, true);
    assert.equal(hero.paused, false);
});

test("rapid switches leave only the most recently started player running", () => {
    const manager = makeManager();
    const players = Array.from({ length: 3 }, () => new FakeAudio());
    players.forEach((player) => manager.registerAudio(player));
    for (const index of [0, 1, 2, 0, 2, 1]) {
        players[index].play();
        assert.deepEqual(players.filter((player) => !player.paused), [players[index]]);
    }
});

test("a queued play event from an already paused player cannot stop the new song", () => {
    const manager = makeManager();
    const first = new FakeAudio();
    const second = new FakeAudio();
    manager.registerAudio(first);
    manager.registerAudio(second);
    first.play();
    second.play();
    first.dispatchEvent(new Event("play"));
    assert.equal(first.paused, true);
    assert.equal(second.paused, false);
});

test("unmount cleanup stops playback and removes the old listener", () => {
    const manager = makeManager();
    const first = new FakeAudio();
    const second = new FakeAudio();
    const unregister = manager.registerAudio(first);
    manager.registerAudio(second);
    first.play();
    unregister();
    assert.equal(first.paused, true);
    second.play();
    first.play();
    assert.equal(second.paused, false, "the removed element no longer controls this manager");
    first.pause();
});

test("cleanup followed by re-registration works during React effect replay", () => {
    const manager = makeManager();
    const first = new FakeAudio();
    const second = new FakeAudio();
    manager.registerAudio(first)();
    manager.registerAudio(first);
    manager.registerAudio(second);
    first.play();
    second.play();
    assert.equal(first.paused, true);
    assert.equal(second.paused, false);
});

test("registering an already playing element also pauses existing playback", () => {
    const manager = makeManager();
    const first = new FakeAudio();
    const second = new FakeAudio();
    manager.registerAudio(first);
    first.play();
    second.play();
    manager.registerAudio(second);
    assert.equal(first.paused, true);
    assert.equal(second.paused, false);
});

test("using a player without the provider fails clearly instead of silently disabling coordination", () => {
    assert.throws(() => loadAudioManager().useAudioManager(), /within AudioManagerProvider/);
});

test("the root layout wraps every page in the shared audio provider", () => {
    const source = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
    const file = ts.createSourceFile("layout.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let wrapsChildren = false;
    function visit(node) {
        if (ts.isJsxElement(node) && node.openingElement.tagName.getText(file) === "AudioManagerProvider") {
            wrapsChildren = node.children.some((child) => ts.isJsxExpression(child) && child.expression?.getText(file) === "children");
        }
        ts.forEachChild(node, visit);
    }
    visit(file);
    assert.ok(wrapsChildren, "mount the provider above all song players");
});
