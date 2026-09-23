"use client";

import { useState } from "react";
import { Loader2, Megaphone, Phone, Save, Type } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { Field } from "@/components/admin/field";

export function SiteTab({
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
      toast.success("Configurações salvas! O site já reflete as mudanças.");
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
            <Phone className="h-4 w-4 text-orange-500" /> Dados de contato e
            atendimento
          </CardTitle>
          <CardDescription>
            Estes dados alimentam o site inteiro (topo, rodapé, contato,
            WhatsApp e Google).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do site">
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
            />
          </Field>
          <Field label="Telefone exibido">
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.phoneDisplay}
              onChange={(e) => set("phoneDisplay", e.target.value)}
            />
          </Field>
          <Field
            label="WhatsApp (só números, com DDI)"
            hint="Ex.: 5517988192424 — usado no botão do WhatsApp e no tel:"
          >
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Endereço completo" className="sm:col-span-2">
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
          <Field label="Mensagem padrão do WhatsApp" className="sm:col-span-2">
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.whatsappDefaultMessage}
              onChange={(e) => set("whatsappDefaultMessage", e.target.value)}
            />
          </Field>
          <Field
            label="Mensagem do botão flutuante"
            className="sm:col-span-2"
          >
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.whatsappFloatingMessage}
              onChange={(e) => set("whatsappFloatingMessage", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-orange-500" /> Canais comerciais
            e vídeo
          </CardTitle>
          <CardDescription>
            Links de contratação usados nos botões do site e o vídeo
            institucional do YouTube.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field
            label="Link do simulador de crédito pessoal"
            hint="Abre em nova aba nos botões “Simule agora” e no menu Serviços"
          >
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.simulatorUrl}
              onChange={(e) => set("simulatorUrl", e.target.value)}
            />
          </Field>
          <Field
            label="Link de contratação FGTS"
            hint="Usado nos botões “Contrate agora” e “Consultar contratação”"
          >
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.fgtsContractUrl}
              onChange={(e) => set("fgtsContractUrl", e.target.value)}
            />
          </Field>
          <Field
            label="ID do vídeo institucional (YouTube)"
            hint="Somente o código do vídeo, ex.: P7kjyLYzw4Y"
          >
            <Input
              className="bg-zinc-950 border-zinc-800"
              value={form.youtubeId}
              onChange={(e) => set("youtubeId", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-orange-500" /> Banners (imagens
            de topo)
          </CardTitle>
          <CardDescription>
            Envie imagens largas (1920×1080 recomendado). Deixe vazio para usar
            o gradiente padrão de cada página.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <ImageUpload
            label="Página inicial"
            value={form.bannerHome}
            onChange={(url) => set("bannerHome", url)}
            hint="banner-home"
          />
          <ImageUpload
            label="Página Serviços"
            value={form.bannerServicos}
            onChange={(url) => set("bannerServicos", url)}
            hint="banner-servicos"
          />
          <ImageUpload
            label="Página FGTS"
            value={form.bannerFgts}
            onChange={(url) => set("bannerFgts", url)}
            hint="banner-fgts"
          />
          <ImageUpload
            label="Página Sobre"
            value={form.bannerSobre}
            onChange={(url) => set("bannerSobre", url)}
            hint="banner-sobre"
          />
          <ImageUpload
            label="Página Contato"
            value={form.bannerContato}
            onChange={(url) => set("bannerContato", url)}
            hint="banner-contato"
          />
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="h-4 w-4 text-orange-500" /> Textos editáveis
          </CardTitle>
          <CardDescription>
            Principais chamadas do site, sempre com a identidade visual
            preservada.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Seção “Precisa de ajuda?” — título">
              <Input
                className="bg-zinc-950 border-zinc-800"
                value={form.textHelpTitle}
                onChange={(e) => set("textHelpTitle", e.target.value)}
              />
            </Field>
            <Field label="Seção “Precisa de ajuda?” — subtítulo">
              <Input
                className="bg-zinc-950 border-zinc-800"
                value={form.textHelpSubtitle}
                onChange={(e) => set("textHelpSubtitle", e.target.value)}
              />
            </Field>
            <Field label="Botão principal da seção ajuda">
              <Input
                className="bg-zinc-950 border-zinc-800"
                value={form.textHelpPrimary}
                onChange={(e) => set("textHelpPrimary", e.target.value)}
              />
            </Field>
            <Field label="Botão secundário da seção ajuda">
              <Input
                className="bg-zinc-950 border-zinc-800"
                value={form.textHelpSecondary}
                onChange={(e) => set("textHelpSecondary", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Rodapé — descrição do site">
            <Textarea
              className="bg-zinc-950 border-zinc-800"
              rows={2}
              value={form.textFooterAbout}
              onChange={(e) => set("textFooterAbout", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <SaveBar saving={saving} onSave={save} />
    </div>
  );
}

export function SaveBar({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-4 flex justify-end">
      <Button
        onClick={onSave}
        disabled={saving}
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-950/40"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Salvar alterações
      </Button>
    </div>
  );
}

export function Label2({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Label className="text-zinc-300">{children}</Label>;
}
