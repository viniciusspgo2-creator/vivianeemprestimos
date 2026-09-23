import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEYS,
  type SiteSettings,
} from "@/lib/site-config";

type Cache = { value: SiteSettings | null; ts: number };
const g = globalThis as unknown as { __settingsCache?: Cache };
const TTL = 5_000; // 5s — keeps admin edits near-instant without hammering the database

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const cached = g.__settingsCache;
  if (cached && cached.value && Date.now() - cached.ts < TTL) return cached.value;

  try {
    const rows = await db.siteSetting.findMany();
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const value = { ...DEFAULT_SETTINGS };
    for (const key of SETTINGS_KEYS) {
      const v = map.get(key);
      if (v !== undefined && v !== "") value[key] = v;
      // allow explicitly clearing banners/analytics
      if (v === "" && key in DEFAULT_SETTINGS) {
        (value as Record<string, string>)[key] = "";
      }
    }
    g.__settingsCache = { value, ts: Date.now() };
    return value;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
});

export async function saveSettings(patch: Record<string, string>) {
  const entries = Object.entries(patch).filter(([key]) =>
    (SETTINGS_KEYS as string[]).includes(key)
  );
  for (const [key, value] of entries) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  g.__settingsCache = { value: null, ts: 0 };
}

/** Fallback canonical base URL when the admin hasn't set the domain yet */
export function siteUrl(settings: SiteSettings): string {
  if (settings.seoSiteUrl) return settings.seoSiteUrl.replace(/\/+$/, "");
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000";
}
