"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/admin/field";
import { ImageUpload } from "@/components/admin/image-upload";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  author: string | null;
  tags: string | null;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
};

type Draft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  tags: string;
  published: boolean;
};

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  metaTitle: "",
  metaDescription: "",
  author: "Equipe Viviane Empréstimos",
  tags: "",
  published: false,
};

export function BlogTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.ok) setPosts(data.posts);
    } catch {
      toast.error("Erro ao carregar posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setDraft(EMPTY);
    setOpen(true);
  }

  function openEdit(post: Post) {
    setDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
      author: post.author ?? "",
      tags: post.tags ?? "",
      published: post.published,
    });
    setOpen(true);
  }

  async function save() {
    if (!draft.title.trim() || !draft.content.trim()) {
      toast.error("Título e conteúdo são obrigatórios.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "Não foi possível salvar o artigo.");
        return;
      }
      toast.success(draft.id ? "Artigo atualizado!" : "Artigo criado!");
      setOpen(false);
      load();
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post: Post) {
    await fetch("/api/admin/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    toast.success(!post.published ? "Artigo publicado!" : "Artigo despublicado.");
    load();
  }

  async function remove(post: Post) {
    if (!confirm(`Excluir definitivamente "${post.title}"?`)) return;
    await fetch(`/api/admin/blog?id=${post.id}`, { method: "DELETE" });
    toast.success("Artigo excluído.");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" /> Artigos do blog
          </h2>
          <p className="text-sm text-zinc-500">
            Artigos publicados entram automaticamente no menu, no sitemap e nos
            dados estruturados.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <Plus className="h-4 w-4" /> Novo artigo
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Carregando artigos...
        </div>
      ) : posts.length === 0 ? (
        <Card className="border-dashed border-zinc-800 bg-zinc-900/40">
          <CardContent className="py-14 text-center text-zinc-500">
            <FileText className="mx-auto h-10 w-10 text-zinc-700" />
            <p className="mt-3 font-medium text-zinc-400">
              Nenhum artigo ainda.
            </p>
            <p className="text-sm">
              Crie o primeiro artigo para atrair tráfego orgânico.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="border-zinc-800 bg-zinc-900/60 py-0"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-700">
                      <FileText className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold truncate">{post.title}</p>
                    <Badge
                      className={
                        post.published
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }
                    >
                      {post.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    /blog/{post.slug} ·{" "}
                    {new Date(post.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={post.published ? "Despublicar" : "Publicar"}
                    onClick={() => togglePublish(post)}
                    className="text-zinc-400 hover:text-zinc-100"
                  >
                    {post.published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Editar"
                    onClick={() => openEdit(post)}
                    className="text-zinc-400 hover:text-zinc-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Excluir"
                    onClick={() => remove(post)}
                    className="text-zinc-400 hover:text-blue-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90svh] overflow-y-auto border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle>
              {draft.id ? "Editar artigo" : "Novo artigo"}
            </DialogTitle>
            <DialogDescription>
              No conteúdo, separe parágrafos com linha em branco. Use{" "}
              <code>## </code> para subtítulos e <code>- </code> para listas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Título">
              <Input
                className="bg-zinc-950 border-zinc-800"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field
              label="Slug (URL)"
              hint="Deixe vazio para gerar automaticamente a partir do título"
            >
              <Input
                className="bg-zinc-950 border-zinc-800"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="ex: como-evitar-luz-de-injecao-acesa"
              />
            </Field>
            <Field label="Resumo (aparece na listagem e no Google)">
              <Textarea
                className="bg-zinc-950 border-zinc-800"
                rows={2}
                value={draft.excerpt}
                onChange={(e) =>
                  setDraft({ ...draft, excerpt: e.target.value })
                }
              />
            </Field>
            <Field label="Conteúdo">
              <Textarea
                className="bg-zinc-950 border-zinc-800 min-h-52"
                rows={10}
                value={draft.content}
                onChange={(e) =>
                  setDraft({ ...draft, content: e.target.value })
                }
              />
            </Field>
            <ImageUpload
              label="Imagem de capa"
              value={draft.coverImage}
              onChange={(url) => setDraft({ ...draft, coverImage: url })}
              hint="capa-artigo"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Autor">
                <Input
                  className="bg-zinc-950 border-zinc-800"
                  value={draft.author}
                  onChange={(e) =>
                    setDraft({ ...draft, author: e.target.value })
                  }
                />
              </Field>
              <Field label="Tags (separadas por vírgula)">
                <Input
                  className="bg-zinc-950 border-zinc-800"
                  value={draft.tags}
                  onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                />
              </Field>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                SEO do artigo
              </p>
              <Field label="Título SEO" hint="Se vazio, usa o título do artigo">
                <Input
                  className="bg-zinc-950 border-zinc-800"
                  value={draft.metaTitle}
                  onChange={(e) =>
                    setDraft({ ...draft, metaTitle: e.target.value })
                  }
                  maxLength={70}
                />
              </Field>
              <Field label="Meta description">
                <Textarea
                  className="bg-zinc-950 border-zinc-800"
                  rows={2}
                  value={draft.metaDescription}
                  onChange={(e) =>
                    setDraft({ ...draft, metaDescription: e.target.value })
                  }
                  maxLength={180}
                />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
              <div>
                <p className="text-sm font-medium">Publicar</p>
                <p className="text-xs text-zinc-500">
                  Artigos despublicados ficam ocultos do site e do sitemap.
                </p>
              </div>
              <Switch
                checked={draft.published}
                onCheckedChange={(v) => setDraft({ ...draft, published: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {draft.id ? "Salvar alterações" : "Criar artigo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
