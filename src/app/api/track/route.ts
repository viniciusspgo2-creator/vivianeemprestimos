import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeVisit, cleanReferrer, isBot } from "@/lib/visits";

export const dynamic = "force-dynamic";

const WINDOW_MS = 1000 * 60 * 20; // dedupe same visitor+path inside 20 min

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      path?: string;
      referrer?: string;
    };

    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    // Never track admin/API internals
    if (
      path.startsWith("/admin") ||
      path.startsWith("/api") ||
      path === "/favicon.ico"
    ) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const userAgent = req.headers.get("user-agent") || "";
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true, bot: true });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";
    const meta = analyzeVisit(ip, userAgent);
    const referrer = cleanReferrer(body.referrer);

    // Dedupe: same visitor + same path within the window counts once
    const since = new Date(Date.now() - WINDOW_MS);
    const recent = await db.pageVisit.findFirst({
      where: {
        visitorId: meta.visitorId,
        path,
        createdAt: { gte: since },
      },
      select: { id: true },
    });
    if (recent) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    await db.pageVisit.create({
      data: {
        path,
        visitorId: meta.visitorId,
        referrer,
        device: meta.device,
        browser: meta.browser,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
