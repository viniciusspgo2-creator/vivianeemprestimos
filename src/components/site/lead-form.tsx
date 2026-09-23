"use client";

import { useState } from "react";

const INTERESTS = [
  "Empréstimo Consignado INSS",
  "Consignado público",
  "Consignado privado / CLT",
  "Antecipação Saque FGTS",
  "Crédito pessoal",
  "Cartão consignado",
  "Cartão Credcesta",
  "Crédito imobiliário",
  "Crédito para veículos",
  "Abertura de conta",
  "Seguros",
  "BPC / LOAS",
  "Consórcios",
  "Bolsa Família",
  "Outro assunto",
];

/**
 * Formulário de atendimento: salva o lead no banco (painel admin)
 * e abre o WhatsApp com a mensagem pronta. Aprimoramento de
 * conversão mantendo o fluxo original de WhatsApp.
 */
export function LeadForm({
  phone,
  siteName,
}: {
  phone: string;
  siteName: string;
}) {
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [service, setService] = useState(INTERESTS[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneInput, service, message }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("ok");
      const text = `Olá! Vim pelo site. Meu nome é ${name}. Tenho interesse em: ${service}.${
        message ? ` ${message}` : ""
      }`;
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener"
      );
    } catch {
      setStatus("err");
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <label>
        Seu nome
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como podemos te chamar?"
          maxLength={120}
        />
      </label>
      <label>
        WhatsApp / telefone
        <input
          required
          type="tel"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="(DDD) 90000-0000"
          maxLength={30}
        />
      </label>
      <label>
        Assunto de interesse
        <select value={service} onChange={(e) => setService(e.target.value)}>
          {INTERESTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        Mensagem (opcional)
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Conte rapidamente o que você precisa."
          maxLength={500}
        />
      </label>
      <button
        className="btn btn-orange"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando..." : "Enviar e abrir WhatsApp"}
      </button>
      <small>
        Ao enviar, você será direcionado ao WhatsApp da {siteName}. Seus dados
        ficam registrados apenas para retorno do atendimento.
      </small>
      {status === "ok" ? (
        <p className="form-status form-status--ok" role="status">
          Recebemos sua solicitação! Se o WhatsApp não abriu, use o botão
          flutuante para falar com a equipe.
        </p>
      ) : null}
      {status === "err" ? (
        <p className="form-status form-status--err" role="alert">
          Não foi possível registrar agora. Tente novamente ou fale direto pelo
          WhatsApp.
        </p>
      ) : null}
    </form>
  );
}
