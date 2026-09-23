"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Contador de visitas — envia a navegação para /api/track
 * (dedupe, bots e admin são tratados no servidor).
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    // pequeno atraso evita contar visitas que saem na hora
    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname, referrer: document.referrer || "" }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
