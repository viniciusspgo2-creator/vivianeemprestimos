"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = { mode: "setup" | "login" };

export function AdminGate({ mode }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSetup = mode === "setup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isSetup && password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isSetup ? "setup" : "login",
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Não foi possível continuar.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden dark">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-blue-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-blue-600/5 blur-3xl"
      />

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/80 backdrop-blur shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15 border border-blue-600/30">
            {isSetup ? (
              <ShieldCheck className="h-7 w-7 text-orange-500" />
            ) : (
              <LockKeyhole className="h-7 w-7 text-orange-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isSetup ? "Configure sua senha" : "Acesso restrito"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isSetup
              ? "Primeiro acesso detectado. Crie a senha de administração do site."
              : "Digite a senha de administração para entrar no painel."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={submit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                {isSetup ? "Nova senha" : "Senha"}
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100"
                  required
                  minLength={6}
                  autoFocus
                />
              </div>
            </div>
            {isSetup ? (
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-zinc-300">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repita a senha"
                    className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            ) : null}
            {error ? (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                {error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSetup ? (
                "Criar senha e entrar"
              ) : (
                "Entrar no painel"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
