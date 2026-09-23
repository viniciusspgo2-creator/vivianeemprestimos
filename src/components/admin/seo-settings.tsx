"use client";

import { useState } from "react";
import {
  BarChart3,
  Bot,
  Globe2,
  Loader2,
  MapPin,
  Save,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/admin/field";
import { SaveBar } from "@/components/admin/site-settings";

export function SeoTab({
  settings,
  onSaved,
}: {
  settings: SiteSettings;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  function set(key: keyof SiteSettings, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error("Não foi possível salvar.");
        return;
      }
      toast.success("SEO atualizado com sucesso!");
      onSaved();
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe2 className="h-4 w-4 text-orange-500" /> Configuração global
          </CardTitle>
          <CardDescription>
            Domínio canônico e identidade nos resultados de busca e redes
            sociais.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="URL do site (domínio canônico)"
            hint="Ex.: https://vivianeemprestimos.com.br — usado no canonical, sitemap.xml e Open Graph"
            className="sm:col-span-2"
          >
            <Input
              className="bg-zinc-950 border-zinc-800"
              placeholder="https://..."
              value={form.seoSiteUrl}
              onChange={(e) => set("seoSiteUrl", e.target.value)}
            />
          </Field>
          <Field label="Imagem Open Graph" hint="1200×630 recomendado">
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.seoOgImage}
              onChange={(e) => set("seoOgImage", e.target.value)}
            />
          </Field>
          <Field label="Cor do tema (mobile)">
            <Input
              className="bg-zinc-950 border-zinc-800"
              placeholder="#090909"
              value={form.seoThemeColor}
              onChange={(e) => set("seoThemeColor", e.target.value)}
            />
          </Field>
          <Field label="Indexação do site">
            <select
              className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
              value={form.seoRobotsIndex}
              onChange={(e) => set("seoRobotsIndex", e.target.value)}
            >
              <option value="index,follow">Indexar e seguir links (recomendado)</option>
              <option value="noindex,nofollow">Não indexar (manutenção)</option>
            </select>
          </Field>
          <Field label="Sufixo dos títulos" hint="Ex.: | Viviane Empréstimos">
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.seoTitleSuffix}
              onChange={(e) => set("seoTitleSuffix", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-orange-500" /> Títulos e descrições por
            página
          </CardTitle>
          <CardDescription>
            Regras de ouro: título até 60 caracteres, descrição até 155, com a
            palavra-chave principal no início.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <PageSeo
            page="Página inicial"
            title={form.seoHomeTitle}
            description={form.seoHomeDescription}
            keywords={form.seoHomeKeywords}
            onTitle={(v) => set("seoHomeTitle", v)}
            onDescription={(v) => set("seoHomeDescription", v)}
            onKeywords={(v) => set("seoHomeKeywords", v)}
          />
          <PageSeo
            page="Sobre nós"
            title={form.seoSobreTitle}
            description={form.seoSobreDescription}
            onTitle={(v) => set("seoSobreTitle", v)}
            onDescription={(v) => set("seoSobreDescription", v)}
          />
          <PageSeo
            page="Serviços"
            title={form.seoServicosTitle}
            description={form.seoServicosDescription}
            onTitle={(v) => set("seoServicosTitle", v)}
            onDescription={(v) => set("seoServicosDescription", v)}
          />
          <PageSeo
            page="Antecipação FGTS"
            title={form.seoFgtsTitle}
            description={form.seoFgtsDescription}
            onTitle={(v) => set("seoFgtsTitle", v)}
            onDescription={(v) => set("seoFgtsDescription", v)}
          />
          <PageSeo
            page="Blog"
            title={form.seoBlogTitle}
            description={form.seoBlogDescription}
            onTitle={(v) => set("seoBlogTitle", v)}
            onDescription={(v) => set("seoBlogDescription", v)}
          />
          <PageSeo
            page="Contato"
            title={form.seoContatoTitle}
            description={form.seoContatoDescription}
            onTitle={(v) => set("seoContatoTitle", v)}
            onDescription={(v) => set("seoContatoDescription", v)}
          />
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-orange-500" /> Google Analytics 4 e
            Tag Manager
          </CardTitle>
          <CardDescription>
            Cole os IDs e os scripts são carregados de forma otimizada (sem
            bloquear a renderização).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="ID do GA4" hint="Formato: G-XXXXXXXXXX">
            <Input
              className="bg-zinc-950 border-zinc-800"
              placeholder="G-..."
              value={form.ga4Id}
              onChange={(e) => set("ga4Id", e.target.value)}
            />
          </Field>
          <Field label="ID do GTM" hint="Formato: GTM-XXXXXXX">
            <Input
              className="bg-zinc-950 border-zinc-800"
              placeholder="GTM-..."
              value={form.gtmId}
              onChange={(e) => set("gtmId", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400 space-y-1.5">
            <p className="flex items-center gap-2 font-semibold text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Eventos
              recomendados para campanhas
            </p>
            <p>
              O site já envia <code>page_view</code> automaticamente. No GTM,
              configure eventos de conversão em{" "}
              <code>/contato</code> (envio do formulário), cliques nos botões
              de WhatsApp, simulador e contratação FGTS — são os pontos de
              decisão do cliente.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4 text-orange-500" /> SEO técnico e local — status
          </CardTitle>
          <CardDescription>
            Recursos já implementados automaticamente na plataforma:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2.5 text-sm text-zinc-300 sm:grid-cols-2">
            {[
              "sitemap.xml automático (inclui o blog)",
              "robots.txt com bloqueio do /admin",
              "Canonicals absolutos em todas as páginas",
              "Open Graph + Twitter Cards",
              "Dados estruturados: FinancialService, Organization, WebSite, WebPage, Breadcrumb, FAQ, Service, BlogPosting, VideoObject",
              "SEO local: endereço, horário, área atendida e geo tags",
              "Redirects 301 das antigas URLs .php",
              "Imagens com alt text, lazy loading e cache imutável",
              "Preload da imagem principal (LCP)",
              "Headers de segurança (HTTPS ready, nosniff, frame-options)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-500">
            Próximo passo recomendado: cadastre o domínio no Google Search
            Console e envie o sitemap{" "}
            <code className="text-zinc-400">/sitemap.xml</code>. Com o GA4
            configurado acima, o acompanhamento de conversões fica completo.
          </p>
        </CardContent>
      </Card>

      <SaveBar saving={saving} onSave={save} />
    </div>
  );
}

function PageSeo({
  page,
  title,
  description,
  keywords,
  onTitle,
  onDescription,
  onKeywords,
}: {
  page: string;
  title: string;
  description: string;
  keywords?: string;
  onTitle: (v: string) => void;
  onDescription: (v: string) => void;
  onKeywords?: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
        {page}
      </p>
      <Field label="Título">
        <Input
          className="bg-zinc-950 border-zinc-800"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          maxLength={70}
        />
        <Meter value={title.length} max={60} />
      </Field>
      <Field label="Meta description">
        <Textarea
          className="bg-zinc-950 border-zinc-800"
          rows={2}
          value={description}
          onChange={(e) => onDescription(e.target.value)}
          maxLength={180}
        />
        <Meter value={description.length} max={155} />
      </Field>
      {onKeywords ? (
        <Field label="Palavras-chave (separadas por vírgula)">
          <Input
            className="bg-zinc-950 border-zinc-800"
            value={keywords ?? ""}
            onChange={(e) => onKeywords(e.target.value)}
          />
        </Field>
      ) : null}
    </div>
  );
}

function Meter({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    value === 0
      ? "bg-zinc-700"
      : value > max
        ? "bg-blue-600"
        : pct > 75
          ? "bg-emerald-600"
          : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-zinc-600 tabular-nums">
        {value}/{max}
      </span>
    </div>
  );
}
