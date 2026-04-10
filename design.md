# Acesso Cidadão — Design Spec

> **Status:** Aprovado  
> **Data:** 2026-04-09  
> **Autor:** Dibax  

---

## Visão Geral

Plataforma web de curadoria de programas públicos governamentais (federal + piloto Piauí), onde qualquer pessoa — cidadã ou profissional — descobre em minutos quais programas existem e se é elegível. Colaboradores contribuem com novos programas via formulário, sujeito à revisão humana por moderadores.

---

## Problema

Não existe uma plataforma unificada, acessível e atualizada que permita ao cidadão descobrir programas públicos de todos os níveis de governo. O CadÚnico cobre só assistência social federal; portais de transparência são voltados a gestores; catálogos existentes são PDFs desatualizados.

---

## Usuários

- **Cidadão leigo:** quer descobrir benefícios para si sem saber os nomes dos programas
- **Profissional (assistente social, servidor):** quer consultar catálogo completo e filtrar por área/perfil
- **Colaborador:** quer contribuir com informações de um programa que conhece
- **Moderador:** revisa e aprova contribuições antes de publicar

---

## Arquitetura

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js 14)         │
│  Quiz · Catálogo · Página do Programa   │
│  Formulário de Contribuição             │
└────────────────┬────────────────────────┘
                 │ REST API
┌────────────────▼────────────────────────┐
│         CMS Headless (Strapi v5)        │
│  Programas · Categorias · Contribuições │
│  Fila de moderação                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     PostgreSQL (Neon serveless — fase 1)      │
└─────────────────────────────────────────┘
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| CMS | Strapi v5 |
| Banco | PostgreSQL via Neon serveless |
| Hospedagem Frontend | Vercel |
| Hospedagem CMS | Contabo VPS |

---

## Modelo de Dados

### Content Type: Programa

```
Programa
├── nome                      String (obrigatório)
├── descricao                 Text longo (obrigatório)
├── esfera                    Enum: federal | estadual | municipal
├── estado                    String UF (opcional — null se federal)
├── areas                     Array Enum: saude | educacao | moradia |
│                               renda | emprego | agricultura | cultura | outro
├── publicos_alvo             Array Enum: familia | idoso | jovem |
│                               mulher | agricultor | pcd | indigena | outro
├── renda_maxima_per_capita   Decimal (null = sem limite)
├── tamanho_familia_min       Integer (default: 1)
├── tamanho_familia_max       Integer (null = sem limite)
├── estados_validos           Array String UF (["federal"] = vale em todo Brasil)
├── valor_beneficio           String (ex: "até R$ 706/mês")
├── como_se_inscrever         Text longo
├── link_oficial              URL
├── status                    Enum: ativo | encerrado | suspenso
├── data_atualizacao          Date
└── fonte                     String (nome do colaborador/fonte)
```

### Content Type: Contribuicao

```
Contribuicao
├── todos os campos de Programa (cópia para revisão)
├── status_revisao    Enum: pendente | aprovado | rejeitado | correcao_solicitada
├── observacao        Text (comentário do moderador)
├── email_colaborador String
└── createdAt         DateTime
```

---

## Quiz de Elegibilidade

### Perguntas

| # | Pergunta | Campo mapeado |
|---|----------|---------------|
| 1 | Em qual estado você mora? | estado |
| 2 | Qual a renda mensal da sua família dividida por pessoa? | renda_maxima_per_capita |
| 3 | Quantas pessoas moram na sua casa? | tamanho_familia |
| 4 | Qual é o seu perfil principal? | publicos_alvo |
| 5 | Qual área te interessa? | areas |

### Lógica de Matching

```
programa é compatível (match total) se:
  renda_per_capita_usuario <= programa.renda_maxima_per_capita (ou null)
  E estado_usuario IN programa.estados_validos (ou "federal")
  E tamanho_familia BETWEEN min e max (ou null)
  E perfil_usuario IN programa.publicos_alvo
  E area_interesse IN programa.areas (ou usuario escolheu "todos")

programa é match parcial se:
  critérios de renda e estado atendidos
  MAS perfil ou área divergem em 1 critério

programas sem match não aparecem
```

### Badge de Resultado

- ✅ **Match total** — todos os critérios atendidos
- 🟡 **Match parcial** — 1 critério divergente
- (❌ Não elegível — oculto dos resultados)

---

## Fluxo de Contribuição

```
1. Colaborador acessa /contribuir
2. Preenche formulário com todos os campos do Programa
3. Submissão cria registro em Contribuicao (status: pendente)
4. Moderador acessa painel Strapi → revisa
5. Se aprovado → copia dados para Programa → publica
6. Se rejeita ou solicita correção → registra observação
```

---

## Estrutura de Repositório

```
govacesso/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # Home com CTA para quiz
│   │   ├── quiz/
│   │   │   └── page.tsx              # Quiz multi-step
│   │   ├── programas/
│   │   │   ├── page.tsx              # Catálogo com filtros
│   │   │   └── [slug]/page.tsx       # Página individual do programa
│   │   └── contribuir/
│   │       └── page.tsx              # Formulário de contribuição
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── QuizStep.tsx
│   │   │   ├── QuizResults.tsx
│   │   │   └── MatchBadge.tsx
│   │   ├── programas/
│   │   │   ├── ProgramaCard.tsx
│   │   │   └── FiltrosSidebar.tsx
│   │   └── ui/                       # Componentes genéricos
│   ├── lib/
│   │   ├── strapi.ts                 # Cliente da API Strapi
│   │   └── matching.ts               # Lógica de matching quiz → programas
│   └── types/
│       └── programa.ts               # Tipos TypeScript
└── cms/                              # Strapi v5
    └── src/api/
        ├── programa/
        └── contribuicao/
```

---

## Roadmap por Fases

### Fase 1 — MVP Piauí
- Quiz funcional com 20–30 programas federais + estaduais do PI
- Catálogo com busca e filtros básicos
- Formulário de contribuição + moderação via Strapi

### Fase 2 — Expansão
- Mais estados
- Contas de moderador com permissões granulares
- Notificações por perfil

### Fase 3 — Escala nacional
- Todos os estados
- API pública
- PWA / App mobile