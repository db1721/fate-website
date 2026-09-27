import assert from "node:assert/strict";
import { test } from "node:test";
import { extractLyrics, loadLyricsFromUrl } from "../lib/lyrics.server.ts";

const sourceUrl = "https://app.evolveelevatemedia.com/music/lyrics/example";
const html = `
    <nav>Navigation must not be imported</nav>
    <section aria-label="Example lyrics">
        <p>Rock &amp; roll</p>
        <p>Don&#8217;t give up<br>Stand tall</p>
        <p>&nbsp;</p>
        <p><strong>Chorus</strong></p>
        <script>unwantedScript()</script>
        <style>.unwanted { color: red; }</style>
    </section>
    <footer>Footer must not be imported</footer>
`;
const expected = "Rock & roll\nDon\u2019t give up\nStand tall\n\nChorus";

test("extracts only lyric text, decoding entities and preserving verses", () => {
    assert.equal(extractLyrics(html, "text/html; charset=utf-8"), expected);
});

test("extracts lyrics from streamed HTML even inside a hidden segment", () => {
    assert.equal(extractLyrics(`<div hidden>${html}</div>`, "text/html"), expected);
});

test("accepts a plain-text source without interpreting HTML characters", () => {
    assert.equal(extractLyrics("  Line one\n\n<Line two> & three\n", "text/plain"), "Line one\n\n<Line two> & three");
});

test("rejects missing or empty lyrics and unsupported response types", () => {
    assert.throws(() => extractLyrics("<main>Sign in</main>", "text/html"), /not found/);
    assert.throws(() => extractLyrics('<section aria-label="Example lyrics"><p>&nbsp;</p></section>', "text/html"), /empty/);
    assert.throws(() => extractLyrics('{"message":"error"}', "application/json"), /Unsupported/);
});

test("fetches the configured URL with hourly revalidation and a timeout", async (t) => {
    t.mock.method(globalThis, "fetch", async (url, options) => {
        assert.equal(url, sourceUrl);
        assert.equal(options.next.revalidate, 3600);
        assert.ok(options.signal instanceof AbortSignal);
        return new Response(html, { headers: { "content-type": "text/html" } });
    });

    assert.equal(await loadLyricsFromUrl(sourceUrl), expected);
});

test("does not fetch when no URL is configured", async (t) => {
    const fetchMock = t.mock.method(globalThis, "fetch", () => assert.fail("Unexpected request"));
    assert.equal(await loadLyricsFromUrl(), "");
    assert.equal(fetchMock.mock.callCount(), 0);
});

test("rejects invalid or non-HTTPS URLs without fetching", async (t) => {
    t.mock.method(console, "error", () => {});
    const fetchMock = t.mock.method(globalThis, "fetch", () => assert.fail("Unexpected request"));
    for (const url of ["invalid", "file:///private.txt", "http://example.com/lyrics.txt"]) {
        assert.equal(await loadLyricsFromUrl(url), "");
    }
    assert.equal(fetchMock.mock.callCount(), 0);
});

test("returns an empty result on HTTP errors without breaking the song page", async (t) => {
    t.mock.method(console, "error", () => {});
    t.mock.method(globalThis, "fetch", async () => new Response("Not found", { status: 404 }));
    assert.equal(await loadLyricsFromUrl(sourceUrl), "");
});

test("returns an empty result on network errors or timeouts", async (t) => {
    t.mock.method(console, "error", () => {});
    t.mock.method(globalThis, "fetch", async () => { throw new DOMException("Timed out", "TimeoutError"); });
    assert.equal(await loadLyricsFromUrl(sourceUrl), "");
});

test("does not display an unrelated HTML page as lyrics", async (t) => {
    t.mock.method(console, "error", () => {});
    t.mock.method(globalThis, "fetch", async () => new Response("<h1>Sign in</h1>", { headers: { "content-type": "text/html" } }));
    assert.equal(await loadLyricsFromUrl(sourceUrl), "");
});
