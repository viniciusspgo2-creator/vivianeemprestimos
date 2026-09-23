import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });

  // Day boundaries in the site timezone (America/Sao_Paulo, UTC-3, no DST)
  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayStr = fmt.format(new Date());
  const startToday = new Date(`${todayStr}T00:00:00-03:00`).getTime();
  const startYesterday = startToday - 86400000;
  const start7 = new Date(startToday - 6 * 86400000);
  const start30 = new Date(startToday - 29 * 86400000);

  const [
    total,
    uniqueTotal,
    today,
    yesterday,
    last7,
    last30,
    dailyRaw,
    topPagesRaw,
    devices,
    referrers,
    browsers,
    recent,
  ] = await Promise.all([
    db.pageVisit.count(),
    db.pageVisit.groupBy({
      by: ["visitorId"],
      _count: { _all: true },
    }),
    db.pageVisit.count({ where: { createdAt: { gte: new Date(startToday) } } }),
    db.pageVisit.count({
      where: {
        createdAt: { gte: new Date(startYesterday), lt: new Date(startToday) },
      },
    }),
    db.pageVisit.count({ where: { createdAt: { gte: start7 } } }),
    db.pageVisit.count({ where: { createdAt: { gte: start30 } } }),
    db.pageVisit.findMany({
      where: { createdAt: { gte: start30 } },
      select: { createdAt: true },
    }),
    db.pageVisit.groupBy({
      by: ["path"],
      where: { createdAt: { gte: start30 } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    db.pageVisit.groupBy({
      by: ["device"],
      _count: { _all: true },
      orderBy: { _count: { device: "desc" } },
    }),
    db.pageVisit.groupBy({
      by: ["referrer"],
      where: { createdAt: { gte: start30 } },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 6,
    }),
    db.pageVisit.groupBy({
      by: ["browser"],
      _count: { _all: true },
      orderBy: { _count: { browser: "desc" } },
      take: 5,
    }),
    db.pageVisit.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        path: true,
        device: true,
        browser: true,
        referrer: true,
        createdAt: true,
      },
    }),
  ]);

  // Unique visitors in last 7/30 days
  const [unique7, unique30] = await Promise.all([
    db.pageVisit.groupBy({
      by: ["visitorId"],
      where: { createdAt: { gte: start7 } },
      _count: { _all: true },
    }),
    db.pageVisit.groupBy({
      by: ["visitorId"],
      where: { createdAt: { gte: start30 } },
      _count: { _all: true },
    }),
  ]);

  // Group by day in the site timezone (America/Sao_Paulo), filling empty days
  const counts = new Map<string, number>();
  for (const row of dailyRaw) {
    const day = fmt.format(row.createdAt);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  const [ty, tm, td] = todayStr.split("-").map(Number);
  const daily: { day: string; views: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = fmt.format(new Date(Date.UTC(ty, tm - 1, td - i, 12)));
    daily.push({ day, views: counts.get(day) ?? 0 });
  }

  return NextResponse.json({
    ok: true,
    stats: {
      total,
      uniqueTotal: uniqueTotal.length,
      today,
      yesterday,
      last7,
      last30,
      unique7: unique7.length,
      unique30: unique30.length,
      daily,
      topPages: topPagesRaw.map((p) => ({ path: p.path, views: p._count._all })),
      devices: devices.map((d) => ({
        device: d.device || "desktop",
        views: d._count._all,
      })),
      referrers: referrers.map((r) => ({
        referrer: r.referrer || "Direto",
        views: r._count._all,
      })),
      browsers: browsers.map((b) => ({
        browser: b.browser || "Outro",
        views: b._count._all,
      })),
      recent,
    },
  });
}
