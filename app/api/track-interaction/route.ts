import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type InteractionBody = {
    song: string;
    action: "service_click" | "preview_play" | "lyrics_review" | "song_page_visited";
    service?: string;
    page?: string;
    userAgent?: string;
    referrer?: string;
    source?: string;
    medium?: string;
    campaign?: string;
};

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

        let country = request.headers.get("x-vercel-ip-country");

        if (!country && ip) {
            try {
                const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
                const geoText = await geoRes.text();

                if (geoRes.ok) {
                    const geo = JSON.parse(geoText);
                    country = geo.country_name || geo.country || null;
                } else {
                    console.error("Geo lookup HTTP error", {
                        status: geoRes.status,
                        body: geoText,
                    });
                }
            } catch (error) {
                console.error("Geo lookup failed", error);
            }
        }

        if (!country) {
            country = "unknown";
        }

        // Forward to Django so it gets saved
        const djangoResponse = await fetch(
            `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/music/track-interaction/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-App-Country": country,
                },
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

        const now = new Date().toISOString();

        const subject =
            action === "service_click"
                ? `[FATE Tracking] ${song} → ${service ?? "unknown"}`
                : action === "preview_play"
                    ? `[FATE Tracking] Preview played → ${song}`
                    : action === "lyrics_review"
                        ? `[FATE Tracking] Lyrics expanded → ${song}`
                        : `[FATE Tracking] Song page visited → ${song}`;

        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>New interaction</h2>
            <p><strong>Song:</strong> ${song}</p>
            <p><strong>Action:</strong> ${action}</p>
            <p><strong>Service:</strong> ${service ?? "N/A"}</p>
            <p><strong>Page:</strong> ${page ?? "N/A"}</p>
            <p><strong>Referrer:</strong> ${referrer ?? "N/A"}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Time:</strong> ${now}</p>
            <p><strong>User Agent:</strong> ${userAgent ?? "N/A"}</p>
            <p><strong>IP:</strong> ${ip ?? "N/A"}</p>
          </div>
        `;

        const resendResult = await resend.emails.send({
            from: process.env.TRACKING_FROM_EMAIL!,
            to: process.env.TRACKING_TO_EMAIL!,
            subject,
            html,
        });

        if (resendResult.error) {
            console.error("Resend error", resendResult.error);
        }

        return NextResponse.json({
            ok: true,
            debug: {
                song,
                action,
                service,
                ip,
                country,
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