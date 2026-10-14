import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as artwork from "../lib/artwork-palette.ts";

const fallback = { primary: "#ff3300", secondary: "#ff9999", dark: "#080808" };
const swatch = (hex, population = 100) => ({ hex, population });

test("the gradient uses actual artwork colors instead of the artist theme", () => {
    const palette = artwork.paletteFromSwatches({
        Vibrant: swatch("#306090"), Muted: swatch("#90a0b0"), DarkMuted: swatch("#102030"),
    }, fallback);
    assert.deepEqual(palette, { primary: "#306090", secondary: "#90a0b0", dark: "#04090d" });
    const background = artwork.artworkBackground(palette);
    assert.match(background, /rgba\(48, 96, 144, 0.42\)/);
    assert.match(background, /rgba\(144, 160, 176, 0.36\)/);
    assert.match(background, /linear-gradient\(180deg, #04090d/);
});

test("monochrome artwork ignores synthesized colors and never borrows the artist accent", () => {
    assert.deepEqual(artwork.paletteFromSwatches({
        Vibrant: swatch("#ff0000", 0), Muted: swatch("#888888"),
    }, fallback), { primary: "#888888", secondary: "#888888", dark: "#262626" });
});

test("missing or invalid swatches retain a real fallback gradient", () => {
    for (const swatches of [{}, { Vibrant: null }, { Vibrant: swatch("not-a-color") }]) {
        assert.equal(artwork.paletteFromSwatches(swatches, fallback), fallback);
        assert.equal((artwork.artworkBackground(fallback).match(/linear-gradient/g) ?? []).length, 3);
    }
    assert.equal(artwork.artworkColor("#abc", 0.5), "rgba(170, 187, 204, 0.5)");
});

test("very bright covers still produce a dark readable base", () => {
    const palette = artwork.paletteFromSwatches({ LightMuted: swatch("#ffffff") }, fallback);
    assert.equal(palette.dark, "#474747");
});

function makeHook() {
    const source = readFileSync(new URL("../lib/use-artwork-palette.ts", import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    const requests = [];
    let state = null;
    let dependencies;
    let cleanup;
    runInNewContext(compiled, {
        exports,
        require(name) {
            if (name === "./artwork-palette") return artwork;
            if (name === "react") return {
                useState: () => [state, (value) => { state = value; }],
                useEffect(effect, deps) {
                    if (dependencies && deps.every((value, index) => value === dependencies[index])) return;
                    cleanup?.();
                    dependencies = deps;
                    cleanup = effect();
                },
            };
            if (name === "next/image") return {
                getImageProps(props) {
                    assert.equal(props.width, 96);
                    assert.equal(props.height, 96);
                    return { props: { src: `/_next/image?url=${encodeURIComponent(props.src)}&w=256&q=75` } };
                },
            };
            if (name === "node-vibrant/browser") return {
                Vibrant: { from: (src) => ({ getPalette: () => new Promise((resolve, reject) => {
                    requests.push({ src, resolve, reject });
                }) }) },
            };
            throw new Error(`Unexpected import: ${name}`);
        },
    });
    return { render: (src) => exports.useArtworkPalette(src, fallback), requests, unmount: () => cleanup?.() };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test("remote artwork is sampled through the small same-origin image URL", async () => {
    const hook = makeHook();
    const src = "https://images.example.com/album.png";
    assert.equal(hook.render(src), fallback);
    await flush();
    assert.equal(hook.requests[0].src, `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`);
    hook.requests[0].resolve({ Vibrant: swatch("#336699") });
    await flush();
    assert.equal(hook.render(src).primary, "#336699");
});

test("switching artwork resets the palette and ignores late results from the previous song", async () => {
    const hook = makeHook();
    hook.render("/first.jpg");
    await flush();
    hook.render("/second.jpg");
    await flush();
    hook.requests[1].resolve({ Vibrant: swatch("#993333") });
    await flush();
    hook.requests[0].resolve({ Vibrant: swatch("#336699") });
    await flush();
    assert.equal(hook.render("/second.jpg").primary, "#993333");
    assert.equal(hook.render("/third.jpg"), fallback);
    hook.unmount();
});

test("failed extraction or an unmounted page keeps the safe fallback", async () => {
    for (const unmount of [false, true]) {
        const hook = makeHook();
        hook.render("/cover.jpg");
        await flush();
        if (unmount) {
            hook.unmount();
            hook.requests[0].resolve({ Vibrant: swatch("#336699") });
        } else {
            hook.requests[0].reject(new Error("Image unavailable"));
        }
        await flush();
        assert.equal(hook.render("/cover.jpg"), fallback);
    }
});

test("the song page paints its gradient on the main surface, not behind it", () => {
    const source = readFileSync(new URL("../app/components/music-landing-page.tsx", import.meta.url), "utf8");
    assert.match(source, /backgroundImage: artworkBackground\(palette\)/);
    assert.match(source, /relative isolate min-h-screen/);
    assert.match(source, /useArtworkPalette\(imageSrc/);
    assert.doesNotMatch(source, /-z-\d|grayscale/);
});
