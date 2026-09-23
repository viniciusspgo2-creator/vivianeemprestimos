# Deploy automatico - Vercel + Neon

Este projeto foi preparado para que o deploy de novos sites seja feito quase todo pelo terminal, sem instalar `node_modules` no computador.

## Comando principal

Abra o PowerShell na raiz do projeto e execute:

```powershell
npm run deploy:auto
```

O script usa `npx vercel@latest`, portanto a Vercel CLI fica no cache do npm e nao e instalada dentro do projeto.

## O que ele faz sozinho

1. Faz login na Vercel no primeiro uso (somente a primeira vez).
2. Cria ou vincula o projeto Vercel.
3. Conecta o repositorio GitHub quando existe `.git` + `origin`.
4. Cria um banco Neon Free automaticamente se o projeto ainda nao tiver `DATABASE_URL` + `DATABASE_URL_UNPOOLED`.
5. Injeta as variaveis do Neon na Vercel.
6. Configura `NEXT_PUBLIC_SITE_URL`.
7. Executa o deploy de producao.
8. Tenta vincular o dominio ao projeto.
9. Durante o build, Prisma aplica as migrations automaticamente.

## Primeiro uso apenas

A Vercel pode abrir o navegador para autenticar sua conta GitHub e/ou aceitar os termos da integracao Neon. Depois disso, os proximos projetos ficam praticamente em um comando.

## Configuracao por site

Edite somente `deploy.config.json` antes de usar o mesmo modelo em outro site.
