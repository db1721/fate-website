import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type InteractionBody = {
    song: string;
    action: "service_click" | "preview_play" | "lyrics_review";
    service?: string;
    page?: string;
    userAgent?: string;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as InteractionBody;

        if (!body.song || !body.action) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();

        const subject =
            body.action === "service_click"
                ? `[FATE Tracking] ${body.song} → ${body.service ?? "unknown"}`
                : body.action === "preview_play"
                    ? `[FATE Tracking] Preview played → ${body.song}`
                    : `[FATE Tracking] Lyrics expanded → ${body.song}`;

        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>New interaction</h2>
        <p><strong>Song:</strong> ${body.song}</p>
        <p><strong>Action:</strong> ${body.action}</p>
        <p><strong>Service:</strong> ${body.service ?? "N/A"}</p>
        <p><strong>Page:</strong> ${body.page ?? "N/A"}</p>
        <p><strong>Time:</strong> ${now}</p>
        <p><strong>User Agent:</strong> ${body.userAgent ?? "N/A"}</p>
      </div>
    `;

        const { error } = await resend.emails.send({
            from: process.env.TRACKING_FROM_EMAIL!,
            to: process.env.TRACKING_TO_EMAIL!,
            subject,
            html,
        });

        if (error) {
            console.error("RESEND ERROR:", error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to track interaction." },
            { status: 500 }
        );
    }
}