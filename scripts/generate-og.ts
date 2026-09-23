/**
 * Gera /public/images/og-viviane.jpg (1200×630) on-brand:
 * gradiente azul da marca + logo + padrão de linhas + textos.
 * Uso: bun scripts/generate-og.ts
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const logoBase64 = readFileSync(
  path.join(ROOT, "public/images/logo.webp")
).toString("base64");

// padrão de linhas do hero (135deg)
const lines = Array.from({ length: 26 }, (_, i) => {
  const x = i * 80 - 200;
  return `<line x1="${x}" y1="0" x2="${x + 800}" y2="630" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1.5"/>`;
}).join("");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a174f"/>
      <stop offset="65%" stop-color="#17378e"/>
      <stop offset="100%" stop-color="#245bd6"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ff7900" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#ff7900" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g>${lines}</g>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="1060" cy="80" r="220" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>
  <circle cx="1060" cy="80" r="120" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
  <rect x="0" y="0" width="14" height="630" fill="#ff7900"/>
  <g transform="translate(80,96)">
    <rect x="-24" y="-24" width="356" height="140" rx="22" fill="#ffffff"/>
    <image href="data:image/webp;base64,${logoBase64}" x="0" y="0" width="308" height="92" preserveAspectRatio="xMidYMid meet"/>
  </g>
  <text x="80" y="330" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="64" font-weight="bold" fill="#ffffff" letter-spacing="-2">Crédito e antecipação</text>
  <text x="80" y="404" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="64" font-weight="bold" fill="#ff9e2c" letter-spacing="-2">do seu FGTS.</text>
  <text x="80" y="470" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="30" fill="#dbe5ff">Consignado • FGTS • Crédito pessoal • Cartão consignado</text>
  <text x="80" y="548" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="24" fill="#aebce3">Atendimento presencial em Bady Bassitt/SP e digital em nível nacional</text>
</svg>`;

await sharp(Buffer.from(svg))
  .jpeg({ quality: 88 })
  .toFile(path.join(ROOT, "public/images/og-viviane.jpg"));

console.log("og-viviane.jpg gerada");
