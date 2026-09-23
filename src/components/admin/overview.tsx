"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  Eye,
  Globe,
  Loader2,
  MonitorSmartphone,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Stats = {
  total: number;
  uniqueTotal: number;
  today: number;
  yesterday: number;
  last7: number;
  last30: number;
  unique7: number;
  unique30: number;
  daily: { day: string; views: number }[];
  topPages: { path: number | string; views: number }[];
  devices: { device: string; views: number }[];
  referrers: { referrer: string; views: number }[];
  browsers: { browser: string; views: number }[];
  recent: {
    id: number;
    path: string;
    device: string | null;
    browser: string | null;
    referrer: string | null;
    createdAt: string;
  }[];
};

const PAGE_LABELS: Record<string, string> = {
  "/": "Início",
  "/sobre": "Sobre nós",
  "/servicos": "Serviços",
  "/contato": "Contato",
  "/blog": "Blog",
};

function label(path: string) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith("/blog/")) return `Artigo: ${path.replace("/blog/", "")}`;
  return path;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

export function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.ok) setStats(data.stats);
      else toast.error("Sessão expirada.");
    } catch {
      toast.error("Erro ao carregar estatísticas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-zinc-400 py-20 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" /> Calculando estatísticas...
      </div>
    );
  }

  if (!stats) return null;

  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.views));
  const delta =
    stats.yesterday > 0
      ? Math.round(((stats.today - stats.yesterday) / stats.yesterday) * 100)
      : stats.today > 0
        ? 100
        : 0;
  const totalDevices = Math.max(
    1,
    stats.devices.reduce((acc, d) => acc + d.views, 0)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Eye}
          label="Visitas hoje"
          value={stats.today}
          hint={
            delta === 0
              ? "Estável vs. ontem"
              : `${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)}% vs. ontem (${stats.yesterday})`
          }
        />
        <KpiCard
          icon={Users}
          label="Últimos 7 dias"
          value={stats.last7}
          hint={`${stats.unique7} visitantes únicos`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Últimos 30 dias"
          value={stats.last30}
          hint={`${stats.unique30} visitantes únicos`}
        />
        <KpiCard
          icon={Activity}
          label="Total desde o início"
          value={stats.total}
          hint={`${stats.uniqueTotal} visitantes únicos`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="border-zinc-800 bg-zinc-900/60 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-orange-500" />
              Visitas por dia — últimos 30 dias
            </CardTitle>
            <CardDescription>
              Passe o mouse sobre as barras para ver os números.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-[3px]">
              {stats.daily.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Ainda sem visitas registradas. Elas aparecem aqui em tempo
                  real assim que o site receber acessos.
                </p>
              ) : (
                stats.daily.map((d) => (
                  <div
                    key={d.day}
                    className="group relative flex-1 flex flex-col items-center justify-end h-full"
                    title={`${d.day}: ${d.views} visitas`}
                  >
                    <span className="absolute -top-1 hidden group-hover:block text-[10px] bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-200 whitespace-nowrap z-10">
                      {d.views}
                    </span>
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-blue-900/70 to-blue-500 hover:to-blue-400 transition-all"
                      style={{
                        height: `${Math.max(4, (d.views / maxDaily) * 100)}%`,
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MonitorSmartphone className="h-4 w-4 text-orange-500" />
              Dispositivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.devices.length === 0 ? (
              <p className="text-sm text-zinc-500">Sem dados ainda.</p>
            ) : (
              stats.devices.map((d) => (
                <div key={d.device} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-zinc-300">
                      {d.device === "mobile"
                        ? "Celular"
                        : d.device === "tablet"
                          ? "Tablet"
                          : "Computador"}
                    </span>
                    <span className="text-zinc-500">
                      {Math.round((d.views / totalDevices) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(d.views / totalDevices) * 100}
                    className="h-2 bg-zinc-800"
                  />
                </div>
              ))
            )}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Navegadores
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.browsers.map((b) => (
                  <Badge
                    key={b.browser}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300"
                  >
                    {b.browser} · {b.views}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MousePointerClick className="h-4 w-4 text-orange-500" />
              Páginas mais visitadas (30d)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topPages.length === 0 ? (
              <p className="text-sm text-zinc-500">Sem dados ainda.</p>
            ) : (
              stats.topPages.map((p) => (
                <div key={String(p.path)} className="flex justify-between text-sm">
                  <span className="text-zinc-300">{label(String(p.path))}</span>
                  <span className="font-bold text-zinc-100">{p.views}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-orange-500" />
              Origem do tráfego (30d)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.referrers.length === 0 ? (
              <p className="text-sm text-zinc-500">Sem dados ainda.</p>
            ) : (
              stats.referrers.map((r) => (
                <div
                  key={r.referrer}
                  className="flex justify-between text-sm gap-3"
                >
                  <span className="text-zinc-300 truncate">{r.referrer}</span>
                  <span className="font-bold text-zinc-100 shrink-0">
                    {r.views}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-orange-500" />
              Atividade recente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="pl-6 text-zinc-500">Página</TableHead>
                    <TableHead className="text-zinc-500">Origem</TableHead>
                    <TableHead className="text-right pr-6 text-zinc-500">
                      Há
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recent.map((v) => (
                    <TableRow key={v.id} className="border-zinc-800/60">
                      <TableCell className="pl-6 py-2.5 text-zinc-300 max-w-40 truncate">
                        {label(v.path)}
                      </TableCell>
                      <TableCell className="py-2.5 text-zinc-500 text-xs">
                        {v.referrer || "Direto"}
                      </TableCell>
                      <TableCell className="pr-6 py-2.5 text-right text-zinc-500 text-xs">
                        {timeAgo(v.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-600/25">
            <Icon className="h-5 w-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {label}
            </p>
            <p className="text-3xl font-extrabold tracking-tight">{value}</p>
          </div>
        </div>
        {hint ? (
          <p className="mt-3 text-xs text-zinc-500 truncate">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
