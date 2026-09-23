import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Listagem de leads do formulário de contato (somente painel admin). */
export async function GET() {
  if (!(await isAuthenticated()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const leads = await db.contactLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ ok: true, leads });
}
