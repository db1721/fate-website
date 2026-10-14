import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadModule(path, globals, imports) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    runInNewContext(compiled, {
        exports, URL, URLSearchParams, Error, AbortSignal,
        require(name) {
            if (Object.hasOwn(imports, name)) return imports[name];
            throw new Error(`Unexpected import: ${name}`);
        },
        ...globals,
    });
    return exports;
}

const event = { song: "fight-against-the-enemy-ugly", project: "fate", action: "lyrics_review" };

function makeClient(response, meta = () => {}) {
    const calls = [];
    const errors = [];
    const client = loadModule("../lib/track-interaction.ts", {
        window: { location: { pathname: `/music/${event.song}`, search: "?utm_source=test&utm_medium=link&utm_campaign=regression" } },
        navigator: { userAgent: "Test browser" },
        document: { referrer: "https://example.com" },
        fetch: async (...args) => { calls.push(args); return response(); },
        console: { error: (...args) => errors.push(args), log: () => assert.fail("Do not log failed requests as successful") },
    }, { "@/lib/meta-pixel": { trackMetaInteraction: meta } });
    return { ...client, calls, errors };
}

test("Ugly lyrics and service clicks preserve the exact song slug and attribution", async () => {
    const client = makeClient(() => Response.json({ ok: true }));
    for (const action of ["lyrics_review", "service_click"]) {
        const payload = { ...event, action, ...(action === "service_click" ? { service: "spotify" } : {}) };
        assert.equal(await client.trackInteraction(payload), true);
        const [url, options] = client.calls.at(-1);
        assert.equal(url, "/api/track-interaction/");
        assert.equal(options.keepalive, true);
        const body = JSON.parse(options.body);
        assert.equal(body.song, event.song);
        assert.equal(body.action, action);
        assert.equal(body.service, payload.service);
        assert.equal(body.source, "test");
        assert.equal(body.page, `/music/${event.song}`);
    }
    assert.equal(client.errors.length, 0);
});

test("HTTP, transport, and invalid acknowledgements are never reported as success", async () => {
    for (const response of [
        () => Response.json({ error: "fetch failed" }, { status: 500 }),
        () => { throw new Error("Network unavailable"); },
        () => Response.json({ ok: false }),
        () => new Response("Not a tracking response"),
    ]) {
        const client = makeClient(response);
        assert.equal(await client.trackInteraction(event), false);
        assert.equal(client.errors.length, 1);
        assert.equal(client.errors[0][0], "Tracking request failed");
        assert.equal(client.calls.length, 1, "do not duplicate emails by blindly retrying");
    }
});

test("a failing Meta pixel cannot block Django tracking", async () => {
    const client = makeClient(() => Response.json({ ok: true }), () => { throw new Error("Pixel failed"); });
    assert.equal(await client.trackInteraction(event), true);
    assert.equal(client.calls.length, 1);
    assert.equal(client.errors[0][0], "Meta tracking error");
});

function makeRoute({ base = "https://api.example.com/", fetch = async () => Response.json({ id: 123 }, { status: 201 }) } = {}) {
    const calls = [];
    const errors = [];
    const route = loadModule("../app/api/track-interaction/route.ts", {
        process: { env: { NEXT_PUBLIC_DJANGO_API_URL: base } },
        fetch: async (...args) => { calls.push(args); return fetch(...args); },
        console: { error: (...args) => errors.push(args) },
    }, { "next/server": { NextResponse: { json: (data, init) => Response.json(data, init) } } });
    const request = (body = event) => new Request("https://site.example/api/track-interaction", {
        method: "POST", body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", "Cookie": "private=session", "x-vercel-ip-country": "US", "x-vercel-ip-city": "New%20York" },
    });
    return { ...route, calls, errors, request };
}

test("Django receives exact event data and geo, without requiring Resend or forwarding cookies", async () => {
    const route = makeRoute();
    assert.deepEqual(await (await route.POST(route.request())).json(), { ok: true });
    const [url, options] = route.calls[0];
    assert.equal(url.href, "https://api.example.com/api/music/track-interaction/");
    assert.deepEqual(JSON.parse(options.body), event);
    assert.equal(options.headers["X-App-Country"], "US");
    assert.equal(options.headers["X-App-City"], "New York");
    assert.equal(options.headers.Cookie, undefined);
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.redirect, "error");
});

test("missing or invalid backend configuration fails clearly without a network call", async () => {
    for (const base of ["", "not-a-url", "ftp://example.com", "https://user:secret@example.com"]) {
        const route = makeRoute({ base });
        const response = await route.POST(route.request());
        assert.equal(response.status, 503);
        assert.equal(route.calls.length, 0);
    }
});

test("unreachable or rejected Django requests return failure without leaking backend details", async () => {
    for (const fetch of [
        async () => { throw new Error("ENOTFOUND retired-backend.example.com"); },
        async () => Response.json({ details: "private SMTP diagnostic" }, { status: 500 }),
    ]) {
        const route = makeRoute({ fetch });
        const response = await route.POST(route.request());
        assert.equal(response.status, 502);
        assert.equal((await response.json()).ok, false);
        assert.equal(route.calls.length, 1);
        assert.equal(route.errors.length, 1);
    }
});

test("empty and malformed events do not reach Django or trigger emails", async () => {
    const route = makeRoute();
    for (const body of [null, {}, { song: event.song }]) {
        assert.equal((await route.POST(route.request(body))).status, 400);
    }
    const malformed = new Request("https://site.example/api/track-interaction", { method: "POST", body: "{" });
    assert.equal((await route.POST(malformed)).status, 400);
    assert.equal(route.calls.length, 0);
});
