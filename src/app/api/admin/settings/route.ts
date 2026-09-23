import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const patch: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string") patch[k] = v;
  }
  await saveSettings(patch);
  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}
