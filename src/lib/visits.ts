import "server-only";
import crypto from "crypto";

export type VisitMeta = {
  visitorId: string;
  device: "mobile" | "tablet" | "desktop";
  browser: string;
};

const BOT_PATTERN =
  /bot|crawler|spider|crawling|semrush|ahrefs|mj12|dotbot|petalbot|bingpreview|lighthouse|headless|curl|wget|python|java\/|okhttp|facebookexternalhit|slurp|duckduckbot|baiduspider|yandex/i;

export function isBot(userAgent: string): boolean {
  return BOT_PATTERN.test(userAgent);
}

export function analyzeVisit(
  ip: string,
  userAgent: string
): VisitMeta {
  // Anonymous stable visitor id — same ip+ua in the same day = same visitor
  const day = new Date().toISOString().slice(0, 10);
  const visitorId = crypto
    .createHash("sha256")
    .update(`${ip}|${userAgent}|${day}|viviane-salt`)
    .digest("hex")
    .slice(0, 24);

  const ua = userAgent.toLowerCase();
  const device: VisitMeta["device"] = /ipad|tablet|kindle|silk/i.test(ua)
    ? "tablet"
    : /mobi|android|iphone|windows phone/i.test(ua)
      ? "mobile"
      : "desktop";

  let browser = "Outro";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") || ua.includes("crios")) browser = "Chrome";
  else if (ua.includes("firefox") || ua.includes("fxios")) browser = "Firefox";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("opr") || ua.includes("opera")) browser = "Opera";

  return { visitorId, device, browser };
}

/** Normalize referrer to a clean hostname (or "Direto") */
export function cleanReferrer(referrer: string | null | undefined): string {
  if (!referrer) return "Direto";
  try {
    const url = new URL(referrer);
    const host = url.hostname.replace(/^www\./, "");
    if (
      host === "localhost" ||
      host === locationHostSafe() ||
      host.endsWith(".localhost")
    )
      return "Direto";
    return host;
  } catch {
    return "Direto";
  }
}

function locationHostSafe(): string {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
      : "__none__";
  } catch {
    return "__none__";
  }
}
