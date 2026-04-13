# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Acesso Cidadão** — a web platform for curating public government programs (federal + Piauí pilot) where citizens discover which programs they qualify for via an eligibility quiz. Contributors submit new programs via a form, subject to moderator review.

## Architecture

- **Frontend** (`frontend/`): Next.js 14 with App Router + Tailwind CSS, deployed on Vercel

The matching logic (`lib/matching.ts`) runs 100% on the frontend — no AI, no backend computation.

## Commands

### Frontend (`frontend/`)

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # Lint
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/lib/matching.ts` | Quiz eligibility matching logic |
| `frontend/types/programa.ts` | TypeScript domain types |

## Data Model

### Programa (core entity)

Key fields: `nome`, `descricao`, `esfera` (federal/estadual/municipal), `areas` (array enum), `publicos_alvo` (array enum), `renda_maxima_per_capita`, `tamanho_familia_min/max`, `estados_validos`, `status` (ativo/encerrado/suspenso).

### Contribuicao

Mirror of Programa fields plus: `status_revisao` (pendente/aprovado/rejeitado/correcao_solicitada), `observacao`, `email_colaborador`.

## Quiz Matching Logic

A program matches a user if:
1. `renda_per_capita_usuario <= programa.renda_maxima_per_capita` (or null = no limit)
2. `estado_usuario IN programa.estados_validos` (or "federal" = nationwide)
3. `tamanho_familia BETWEEN min AND max` (nulls = no bound)
4. `perfil_usuario IN programa.publicos_alvo`
5. `area_interesse IN programa.areas` (or user selected "all")

**Match total** (✅) = all criteria met. **Match parcial** (🟡) = renda+estado met but 1 divergent profile/area criterion. No-match programs are hidden.

## Implementation Plan

See `plan.md` for the full sprint-by-sprint implementation plan with step-by-step tasks. When executing it, use the `superpowers:subagent-driven-development` skill as instructed at the top of that file.
