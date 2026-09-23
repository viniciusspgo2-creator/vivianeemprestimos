"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  ExternalLink,
  FileText,
  Globe2,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Search,
} from "lucide-react";
import type { SiteSettings } from "@/lib/site-config";
import { OverviewTab } from "@/components/admin/overview";
import { SiteTab } from "@/components/admin/site-settings";
import { SeoTab } from "@/components/admin/seo-settings";
import { BlogTab } from "@/components/admin/blog-manager";
import { LeadsTab } from "@/components/admin/leads-table";
import { PasswordTab } from "@/components/admin/password-form";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "site", label: "Site e Banners", icon: Megaphone },
  { id: "seo", label: "SEO", icon: Search },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "leads", label: "Atendimentos", icon: Inbox },
  { id: "password", label: "Senha", icon: KeyRound },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      if (data.ok) setSettings(data.settings);
    } catch {
      toast.error("Não foi possível carregar as configurações.");
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.status === 401) {
          router.refresh();
          return;
        }
        const data = await res.json();
        if (data.ok && !cancelled) setSettings(data.settings);
      } catch {
        if (!cancelled) toast.error("Não foi possível carregar as configurações.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.refresh();
  }

  if (!settings) {
    return (
      <div className="min-h-svh bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Carregando painel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-100 flex flex-col dark">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-600/30 shrink-0">
              <BarChart3 className="h-5 w-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">
                {settings.siteName}
              </p>
              <p className="text-[11px] text-zinc-500 leading-tight">
                Painel administrativo
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            >
              <a href="/" target="_blank" rel="noopener">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Ver site</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-zinc-800 bg-zinc-900 hover:bg-blue-950 hover:text-blue-300 text-zinc-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 -mt-px overflow-x-auto">
          <div className="flex gap-1 pb-px">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    active
                      ? "border-blue-600 text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-8">
        {tab === "overview" ? <OverviewTab /> : null}
        {tab === "site" ? (
          <SiteTab settings={settings} onSaved={loadSettings} />
        ) : null}
        {tab === "seo" ? (
          <SeoTab settings={settings} onSaved={loadSettings} />
        ) : null}
        {tab === "blog" ? <BlogTab /> : null}
        {tab === "leads" ? <LeadsTab /> : null}
        {tab === "password" ? <PasswordTab /> : null}
      </main>

      <footer className="border-t border-zinc-900 py-4">
        <p className="mx-auto max-w-7xl px-4 sm:px-6 text-[11px] text-zinc-600 flex items-center gap-2">
          <Globe2 className="h-3 w-3" />
          Painel do {settings.siteName} — conteúdo, SEO e desempenho em um só
          lugar.
        </p>
      </footer>
    </div>
  );
}
