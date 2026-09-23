import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Captura pública de leads do formulário de contato (vai para o painel /admin). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const name = String(body.name ?? "").trim().slice(0, 120);
    const phone = String(body.phone ?? "").trim().slice(0, 40);
    const service = String(body.service ?? "").trim().slice(0, 120);
    const message = String(body.message ?? "").trim().slice(0, 500);

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, error: "Informe nome e telefone." },
        { status: 400 }
      );
    }

    await db.contactLead.create({
      data: {
        name,
        phone,
        service: service || null,
        message: message || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
