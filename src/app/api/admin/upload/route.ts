import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"],
]);

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

/** Stores the upload in PostgreSQL (Vercel filesystem is ephemeral) and
 *  returns a permanent, cacheable URL: /api/images/<id> */
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file)
      return NextResponse.json(
        { ok: false, error: "Arquivo não enviado." },
        { status: 400 }
      );

    const ext = ALLOWED.get(file.type);
    if (!ext)
      return NextResponse.json(
        {
          ok: false,
          error: "Formato não suportado (JPG, PNG, WebP, AVIF, SVG).",
        },
        { status: 400 }
      );
    if (file.size > MAX_SIZE)
      return NextResponse.json(
        { ok: false, error: "Imagem acima de 8MB." },
        { status: 400 }
      );

    // SEO-friendly filename: slug + short hash + extension
    const slug =
      String(form.get("slug") || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "imagem";
    const hash = crypto.randomUUID().slice(0, 8);
    const filename = `${slug}-${hash}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = await db.image.create({
      data: {
        filename,
        mime: file.type,
        size: buffer.length,
        data: buffer,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, url: `/api/images/${image.id}` });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Falha ao salvar imagem." },
      { status: 500 }
    );
  }
}
