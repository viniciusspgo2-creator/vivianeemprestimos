"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Lead = {
  id: number;
  name: string;
  phone: string;
  service: string | null;
  message: string | null;
  createdAt: string;
};

export function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.ok) setLeads(data.leads);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Inbox className="h-5 w-5 text-orange-500" /> Solicitações de
          atendimento
        </h2>
        <p className="text-sm text-zinc-500">
          Cada envio pelo formulário de contato do site fica registrado aqui
          para follow-up no WhatsApp.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Últimas solicitações</CardTitle>
          <CardDescription>
            Atualiza automaticamente a cada 30 segundos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Carregando...
            </div>
          ) : leads.length === 0 ? (
            <p className="py-16 text-center text-sm text-zinc-500">
              Nenhuma solicitação ainda.
            </p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="pl-6 text-zinc-500">Data</TableHead>
                    <TableHead className="text-zinc-500">Nome</TableHead>
                    <TableHead className="text-zinc-500">Telefone</TableHead>
                    <TableHead className="text-zinc-500">Interesse</TableHead>
                    <TableHead className="text-zinc-500 pr-6">
                      Mensagem
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="border-zinc-800/60">
                      <TableCell className="pl-6 whitespace-nowrap text-zinc-400 text-xs">
                        {new Date(lead.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="font-medium text-zinc-200">
                        {lead.name}
                      </TableCell>
                      <TableCell className="text-zinc-300 text-sm whitespace-nowrap">
                        <a
                          className="hover:text-orange-400"
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener"
                        >
                          {lead.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-zinc-300 text-sm">
                        {lead.service}
                      </TableCell>
                      <TableCell className="pr-6 max-w-80 truncate text-zinc-400 text-sm">
                        {lead.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
