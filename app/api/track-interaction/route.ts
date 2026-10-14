import { NextResponse } from "next/server";

type InteractionBody = {
    song: string;
    project?: string;
    action: "service_click" | "social_click" | "preview_play" | "lyrics_review" | "song_page_visited";
    service?: string;
    page?: string;
    userAgent?: string;
    referrer?: string;
    source?: string;
    medium?: string;
    campaign?: string;
};

type GeoDetails = {
    ip: string | null;
    continent: string | null;
    country: string;
    region: string | null;
    city: string | null;
    latitude: string | null;
    longitude: string | null;
    timezone: string | null;
    postalCode: string | null;
    source: "vercel-headers" | "unavailable";
};

function readLocationHeader(request: Request, name: string) {
    const value = request.headers.get(name);
    if (!value) return null;

    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function getGeoDetails(request: Request, ip: string | null): GeoDetails {
    const continent = readLocationHeader(request, "x-vercel-ip-continent");
    const country = readLocationHeader(request, "x-vercel-ip-country");
    const region = readLocationHeader(request, "x-vercel-ip-country-region");
    const city = readLocationHeader(request, "x-vercel-ip-city");
    const latitude = readLocationHeader(request, "x-vercel-ip-latitude");
    const longitude = readLocationHeader(request, "x-vercel-ip-longitude");
    const timezone = readLocationHeader(request, "x-vercel-ip-timezone");
    const postalCode = readLocationHeader(request, "x-vercel-ip-postal-code");

    const hasVercelGeo = Boolean(
        continent ||
        country ||
        region ||
        city ||
        latitude ||
        longitude ||
        timezone ||
        postalCode
    );

    return {
        ip,
        continent,
        country: country ?? "unknown",
        region,
        city,
        latitude,
        longitude,
        timezone,
        postalCode,
        source: hasVercelGeo ? "vercel-headers" : "unavailable",
    };
}

function addHeader(headers: Record<string, string>, key: string, value: string | null) {
    if (value) {
        const safeValue = value.replace(/[\r\n]/g, " ").trim();
        headers[key] = /[^\x20-\x7E]/.test(safeValue)
            ? encodeURIComponent(safeValue)
            : safeValue;
    }
}

function getDjangoHeaders(geo: GeoDetails) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-App-Country": geo.country,
        "X-App-Geo-Source": geo.source,
    };

    addHeader(headers, "X-App-IP", geo.ip);
    addHeader(headers, "X-App-Continent", geo.continent);
    addHeader(headers, "X-App-Region", geo.region);
    addHeader(headers, "X-App-City", geo.city);
    addHeader(headers, "X-App-Latitude", geo.latitude);
    addHeader(headers, "X-App-Longitude", geo.longitude);
    addHeader(headers, "X-App-Timezone", geo.timezone);
    addHeader(headers, "X-App-Postal-Code", geo.postalCode);

    return headers;
}

export async function POST(request: Request) {
    try {
        let body: InteractionBody;

        try {
            body = (await request.json()) as InteractionBody;
        } catch (error) {
            console.error("Invalid JSON body", error);
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const { song, action } = body ?? {};

        if (!song || !action) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    details: {
                        song: !!song,
                        action: !!action,
                    },
                },
                { status: 400 }
            );
        }

        let trackingUrl: URL;
        try {
            const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL?.trim();
            if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_DJANGO_API_URL");
            trackingUrl = new URL(`${baseUrl.replace(/\/+$/, "")}/api/music/track-interaction/`);
            if (!["http:", "https:"].includes(trackingUrl.protocol) || trackingUrl.username || trackingUrl.password) {
                throw new Error("Invalid NEXT_PUBLIC_DJANGO_API_URL");
            }
        } catch (error) {
            console.error("Tracking backend is not configured", error);
            return NextResponse.json({ ok: false, error: "Tracking backend is not configured" }, { status: 503 });
        }

        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor
            ? forwardedFor.split(",")[0].trim()
            : request.headers.get("x-real-ip");

        const geo = getGeoDetails(request, ip);

        // Django saves the event and owns email delivery; do not send a duplicate here.
        const djangoResponse = await fetch(
            trackingUrl,
            {
                method: "POST",
                headers: getDjangoHeaders(geo),
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(15_000),
                redirect: "error",
            }
        );

        const djangoText = await djangoResponse.text();

        if (!djangoResponse.ok) {
            console.error("Django tracking failed", { song, action, status: djangoResponse.status, response: djangoText });
            return NextResponse.json(
                {
                    ok: false,
                    error: "The tracking backend could not complete the interaction",
                },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Tracking backend request failed", error);
        return NextResponse.json(
            {
                ok: false,
                error: "The tracking backend is unavailable",
            },
            { status: 502 }
        );
    }
}
