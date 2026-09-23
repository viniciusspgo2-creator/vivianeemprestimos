import { NextRequest, NextResponse } from "next/server";
import {
  hasAdmin,
  createAdmin,
  login,
  logout,
  isAuthenticated,
  changePassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const adminExists = await hasAdmin();
  const authed = adminExists ? await isAuthenticated() : false;
  return NextResponse.json({ adminExists, authenticated: authed });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    password?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  try {
    switch (body.action) {
      case "setup": {
        if (await hasAdmin()) {
          return NextResponse.json(
            { ok: false, error: "Senha já configurada. Faça login." },
            { status: 400 }
          );
        }
        const pw = body.password || "";
        if (pw.length < 6) {
          return NextResponse.json(
            { ok: false, error: "A senha deve ter pelo menos 6 caracteres." },
            { status: 400 }
          );
        }
        await createAdmin(pw);
        await login(pw);
        return NextResponse.json({ ok: true });
      }
      case "login": {
        const ok = await login(body.password || "");
        if (!ok)
          return NextResponse.json(
            { ok: false, error: "Senha incorreta." },
            { status: 401 }
          );
        return NextResponse.json({ ok: true });
      }
      case "logout": {
        await logout();
        return NextResponse.json({ ok: true });
      }
      case "change-password": {
        if (!(await isAuthenticated()))
          return NextResponse.json({ ok: false }, { status: 401 });
        const ok = await changePassword(
          body.currentPassword || "",
          body.newPassword || ""
        );
        if (!ok)
          return NextResponse.json(
            { ok: false, error: "Senha atual incorreta." },
            { status: 400 }
          );
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json(
          { ok: false, error: "Ação inválida" },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
