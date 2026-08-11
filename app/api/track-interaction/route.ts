import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

        const {
            song,
            project,
            action,
            service,
            page,
            userAgent,
            referrer,
            source,
            medium,
            campaign,
        } = body;

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

        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor
            ? forwardedFor.split(",")[0].trim()
            : request.headers.get("x-real-ip");

        const sessionId = request.headers.get("cookie") || null;
        const geo = getGeoDetails(request, ip);

        // Forward to Django so it gets saved
        const djangoResponse = await fetch(
            `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/music/track-interaction/`,
            {
                method: "POST",
                headers: getDjangoHeaders(geo),
                body: JSON.stringify({
                    ...body,
                    sessionId,
                }),
            }
        );

        const djangoText = await djangoResponse.text();

        if (!djangoResponse.ok) {
            console.error("Django tracking failed", djangoText);
            return NextResponse.json(
                {
                    error: "Failed to save interaction in Django",
                    details: djangoText,
                },
                { status: djangoResponse.status }
            );
        }

        // const now = new Date().toISOString();
        //
        // const subject =
        //     action === "service_click"
        //         ? `[FATE Tracking] ${song} → ${service ?? "unknown"}`
        //         : action === "preview_play"
        //             ? `[FATE Tracking] Preview played → ${song}`
        //             : action === "lyrics_review"
        //                 ? `[FATE Tracking] Lyrics expanded → ${song}`
        //                 : `[FATE Tracking] Song page visited → ${song}`;
        //
        // const html = `
        //   <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        //     <h2>New interaction</h2>
        //     <p><strong>Song:</strong> ${song}</p>
        //     <p><strong>Action:</strong> ${action}</p>
        //     <p><strong>Service:</strong> ${service ?? "N/A"}</p>
        //     <p><strong>Page:</strong> ${page ?? "N/A"}</p>
        //     <p><strong>Referrer:</strong> ${referrer ?? "N/A"}</p>
        //     <p><strong>Country:</strong> ${country}</p>
        //     <p><strong>Time:</strong> ${now}</p>
        //     <p><strong>User Agent:</strong> ${userAgent ?? "N/A"}</p>
        //     <p><strong>IP:</strong> ${ip ?? "N/A"}</p>
        //   </div>
        // `;
        //
        // const resendResult = await resend.emails.send({
        //     from: process.env.TRACKING_FROM_EMAIL!,
        //     to: process.env.TRACKING_TO_EMAIL!,
        //     subject,
        //     html,
        // });
        //
        // if (resendResult.error) {
        //     console.error("Resend error", resendResult.error);
        // }

        return NextResponse.json({
            ok: true,
            debug: {
                song,
                project,
                action,
                service,
                ip,
                geo,
                djangoResponse: djangoText,
            },
        });
    } catch (error) {
        console.error("Unhandled track interaction error", error);
        return NextResponse.json(
            {
                error: "Unhandled server error",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
