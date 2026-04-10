# Acesso Cidadão — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o MVP do Acesso Cidadão — plataforma de curadoria de programas públicos com quiz de elegibilidade, catálogo filtrável e sistema de contribuição com moderação.

**Architecture:** Next.js 14 (App Router) no frontend consumindo API REST do Strapi v5 (CMS headless). PostgreSQL via Supabase como banco. Lógica de matching quiz→programas 100% no frontend (lib/matching.ts), sem IA.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Strapi v5, PostgreSQL (Supabase), Vercel, Contabo VPS

---

## Estrutura de Arquivos

```
acessoCidadao/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── quiz/page.tsx
│   │   ├── programas/page.tsx
│   │   ├── programas/[slug]/page.tsx
│   │   └── contribuir/page.tsx
│   ├── components/
│   │   ├── quiz/QuizStep.tsx
│   │   ├── quiz/QuizResults.tsx
│   │   ├── quiz/MatchBadge.tsx
│   │   ├── programas/ProgramaCard.tsx
│   │   └── programas/FiltrosSidebar.tsx
│   ├── lib/
│   │   ├── strapi.ts
│   │   └── matching.ts
│   └── types/programa.ts
└── cms/
    └── src/api/
        ├── programa/
        └── contribuicao/
```

---

## Sprint 1 — Setup e Infraestrutura (Dias 1–3)

### Task 1.1: Inicializar repositório e frontend Next.js

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/app/layout.tsx`
- Create: `.gitignore`

- [ ] **Step 1: Criar repositório Git**

```bash
mkdir acessoCidadao && cd acessoCidadao
git init
echo "node_modules/\n.env\n.env.local\n.next/" > .gitignore
git add .gitignore
git commit -m "chore: init repo"
```

- [ ] **Step 2: Criar projeto Next.js**

```bash
cd acessoCidadao
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

- [ ] **Step 3: Verificar que o projeto inicia**

```bash
cd frontend && pnpm run dev
```
Expected: servidor rodando em http://localhost:3000

- [ ] **Step 4: Commit**

```bash
git add frontend/
git commit -m "chore: scaffold Next.js frontend"
```

---

### Task 1.2: Definir tipos TypeScript do domínio

**Files:**
- Create: `frontend/types/programa.ts`

- [ ] **Step 1: Criar arquivo de tipos**

```typescript
// frontend/types/programa.ts

export type Esfera = 'federal' | 'estadual' | 'municipal'

export type Area =
  | 'saude'
  | 'educacao'
  | 'moradia'
  | 'renda'
  | 'emprego'
  | 'agricultura'
  | 'cultura'
  | 'outro'

export type PublicoAlvo =
  | 'familia'
  | 'idoso'
  | 'jovem'
  | 'mulher'
  | 'agricultor'
  | 'pcd'
  | 'indigena'
  | 'outro'

export type StatusPrograma = 'ativo' | 'encerrado' | 'suspenso'

export interface Programa {
  id: number
  slug: string
  nome: string
  descricao: string
  esfera: Esfera
  estado: string | null
  areas: Area[]
  publicos_alvo: PublicoAlvo[]
  renda_maxima_per_capita: number | null
  tamanho_familia_min: number
  tamanho_familia_max: number | null
  estados_validos: string[]
  valor_beneficio: string
  como_se_inscrever: string
  link_oficial: string
  status: StatusPrograma
  data_atualizacao: string
  fonte: string
}

export interface PerfilUsuario {
  estado: string
  renda_per_capita: number
  tamanho_familia: number
  perfil: PublicoAlvo
  area_interesse: Area | 'todos'
}

export type NivelMatch = 'total' | 'parcial'

export interface ProgramaComMatch {
  programa: Programa
  nivel: NivelMatch
  criterios_atendidos: number
  criterios_total: number
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/types/
git commit -m "feat: add domain types"
```

---

### Task 1.3: Instalar e configurar Strapi v5 no VPS

**Files:**
- Create: `cms/` (gerado pelo Strapi CLI)

- [ ] **Step 1: Criar projeto Strapi no VPS (via SSH)**

```bash
# No VPS (Contabo)
npx create-strapi-app@latest cms \
  --dbclient=postgres \
  --dbhost=<SUPABASE_HOST> \
  --dbport=5432 \
  --dbname=acessoCidadao \
  --dbusername=<SUPABASE_USER> \
  --dbpassword=<SUPABASE_PASSWORD>
```

- [ ] **Step 2: Iniciar Strapi e acessar painel**

```bash
cd cms && pnpm run develop
```
Expected: painel acessível em http://<VPS_IP>:1337/admin

- [ ] **Step 3: Criar admin inicial via UI**

Acesse o painel → crie conta de administrador.

- [ ] **Step 4: Commit da config**

```bash
git add cms/
git commit -m "chore: scaffold Strapi CMS"
```

---

## Sprint 2 — CMS: Content Types e API (Dias 4–6)

### Task 2.1: Criar Content Type Programa no Strapi

**Files:**
- Create: `cms/src/api/programa/content-types/programa/schema.json`

- [ ] **Step 1: Criar schema via Strapi Content-Type Builder (UI)**

No painel Strapi → Content-Type Builder → Create new collection type → Nome: `programa`

Adicionar campos:
```
nome              Text         obrigatório
slug              UID          baseado em nome
descricao         Rich Text    obrigatório
esfera            Enumeration  federal, estadual, municipal
estado            Text
areas             JSON
publicos_alvo     JSON
renda_maxima_per_capita  Decimal
tamanho_familia_min      Integer  default:1
tamanho_familia_max      Integer
estados_validos          JSON
valor_beneficio          Text
como_se_inscrever        Rich Text
link_oficial             Text
status            Enumeration  ativo, encerrado, suspenso
data_atualizacao  Date
fonte             Text
```

- [ ] **Step 2: Verificar schema gerado**

```bash
cat cms/src/api/programa/content-types/programa/schema.json
```
Expected: arquivo JSON com todos os campos definidos

- [ ] **Step 3: Configurar permissões públicas de leitura**

Painel Strapi → Settings → Roles → Public → Programa → habilitar `find` e `findOne`

- [ ] **Step 4: Testar API**

```bash
curl http://localhost:1337/api/programas
```
Expected: `{"data":[],"meta":{"pagination":{...}}}`

- [ ] **Step 5: Commit**

```bash
git add cms/src/api/programa/
git commit -m "feat: add Programa content type"
```

---

### Task 2.2: Criar Content Type Contribuicao no Strapi

**Files:**
- Create: `cms/src/api/contribuicao/content-types/contribuicao/schema.json`

- [ ] **Step 1: Criar schema via UI**

Content-Type Builder → Create → `contribuicao`

Adicionar campos (todos os de Programa, mais):
```
status_revisao  Enumeration  pendente, aprovado, rejeitado, correcao_solicitada
                             default: pendente
observacao      Text
email_colaborador  Email
```
Todos os campos de Programa copiados (sem slug e sem status).

- [ ] **Step 2: Configurar permissão de escrita pública**

Settings → Roles → Public → Contribuicao → habilitar `create`
(NÃO habilitar find/findOne — contribuições são privadas)

- [ ] **Step 3: Testar criação via API**

```bash
curl -X POST http://localhost:1337/api/contribuicaos \
  -H "Content-Type: application/json" \
  -d '{"data":{"nome":"Teste","email_colaborador":"a@b.com","status_revisao":"pendente"}}'
```
Expected: `{"data":{"id":1,...}}`

- [ ] **Step 4: Commit**

```bash
git add cms/src/api/contribuicao/
git commit -m "feat: add Contribuicao content type"
```

---

### Task 2.3: Criar cliente Strapi no frontend

**Files:**
- Create: `frontend/lib/strapi.ts`
- Create: `frontend/.env.local`

- [ ] **Step 1: Criar .env.local**

```bash
# frontend/.env.local
NEXT_PUBLIC_STRAPI_URL=http://<VPS_IP>:1337
```

- [ ] **Step 2: Criar cliente**

```typescript
// frontend/lib/strapi.ts
import { Programa } from '@/types/programa'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!

interface StrapiResponse<T> {
  data: T
  meta: { pagination?: { page: number; pageSize: number; total: number } }
}

interface StrapiItem<T> {
  id: number
  attributes: T
}

export async function getProgramas(): Promise<Programa[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/programas?populate=*&filters[status][$eq]=ativo&pagination[pageSize]=100`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Erro ao buscar programas')
  const json: StrapiResponse<StrapiItem<Omit<Programa, 'id'>>[]> = await res.json()
  return json.data.map((item) => ({ id: item.id, ...item.attributes }))
}

export async function getProgramaBySlug(slug: string): Promise<Programa | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/programas?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return null
  const json: StrapiResponse<StrapiItem<Omit<Programa, 'id'>>[]> = await res.json()
  if (!json.data.length) return null
  return { id: json.data[0].id, ...json.data[0].attributes }
}

export async function submitContribuicao(data: Record<string, unknown>): Promise<boolean> {
  const res = await fetch(`${STRAPI_URL}/api/contribuicaos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
  return res.ok
}
```

- [ ] **Step 3: Testar cliente manualmente**

```bash
cd frontend && node -e "
const { getProgramas } = require('./lib/strapi.ts')
getProgramas().then(console.log).catch(console.error)
"
```
Expected: array vazio `[]` (ainda sem dados)

- [ ] **Step 4: Commit**

```bash
git add frontend/lib/strapi.ts frontend/.env.local
git commit -m "feat: add Strapi API client"
```

---

## Sprint 3 — Lógica de Matching e Quiz (Dias 7–10)

### Task 3.1: Implementar lógica de matching

**Files:**
- Create: `frontend/lib/matching.ts`
- Create: `frontend/lib/matching.test.ts`

- [ ] **Step 1: Escrever testes**

```typescript
// frontend/lib/matching.test.ts
import { calcularMatch } from './matching'
import { Programa, PerfilUsuario } from '@/types/programa'

const programaBase: Programa = {
  id: 1,
  slug: 'bolsa-familia',
  nome: 'Bolsa Família',
  descricao: '',
  esfera: 'federal',
  estado: null,
  areas: ['renda'],
  publicos_alvo: ['familia'],
  renda_maxima_per_capita: 706,
  tamanho_familia_min: 1,
  tamanho_familia_max: null,
  estados_validos: ['federal'],
  valor_beneficio: 'variável',
  como_se_inscrever: '',
  link_oficial: '',
  status: 'ativo',
  data_atualizacao: '2024-01-01',
  fonte: 'gov.br',
}

const perfilElegivel: PerfilUsuario = {
  estado: 'PI',
  renda_per_capita: 500,
  tamanho_familia: 3,
  perfil: 'familia',
  area_interesse: 'renda',
}

test('match total quando todos os critérios são atendidos', () => {
  const result = calcularMatch(programaBase, perfilElegivel)
  expect(result).not.toBeNull()
  expect(result!.nivel).toBe('total')
})

test('match parcial quando só perfil difere', () => {
  const perfil = { ...perfilElegivel, perfil: 'idoso' as const }
  const result = calcularMatch(programaBase, perfil)
  expect(result).not.toBeNull()
  expect(result!.nivel).toBe('parcial')
})

test('null quando renda acima do limite', () => {
  const perfil = { ...perfilElegivel, renda_per_capita: 900 }
  const result = calcularMatch(programaBase, perfil)
  expect(result).toBeNull()
})

test('null quando estado não é atendido', () => {
  const programa = { ...programaBase, estados_validos: ['CE'] }
  const result = calcularMatch(programa, perfilElegivel)
  expect(result).toBeNull()
})

test('match total quando programa sem limite de renda', () => {
  const programa = { ...programaBase, renda_maxima_per_capita: null }
  const result = calcularMatch(programa, perfilElegivel)
  expect(result!.nivel).toBe('total')
})
```

- [ ] **Step 2: Rodar testes — verificar que falham**

```bash
cd frontend && npx jest lib/matching.test.ts
```
Expected: FAIL — "Cannot find module './matching'"

- [ ] **Step 3: Implementar matching**

```typescript
// frontend/lib/matching.ts
import { Programa, PerfilUsuario, ProgramaComMatch, NivelMatch } from '@/types/programa'

export function calcularMatch(
  programa: Programa,
  perfil: PerfilUsuario
): ProgramaComMatch | null {
  // Critérios disqualificantes (retornam null se não atendidos)
  if (
    programa.renda_maxima_per_capita !== null &&
    perfil.renda_per_capita > programa.renda_maxima_per_capita
  ) {
    return null
  }

  const estadoValido =
    programa.estados_validos.includes('federal') ||
    programa.estados_validos.includes(perfil.estado)
  if (!estadoValido) return null

  if (perfil.tamanho_familia < programa.tamanho_familia_min) return null
  if (
    programa.tamanho_familia_max !== null &&
    perfil.tamanho_familia > programa.tamanho_familia_max
  ) {
    return null
  }

  // Critérios de match total vs parcial
  let criterios_atendidos = 0
  const criterios_total = 2 // perfil + area

  const perfilAtendido = programa.publicos_alvo.includes(perfil.perfil)
  if (perfilAtendido) criterios_atendidos++

  const areaAtendida =
    perfil.area_interesse === 'todos' ||
    programa.areas.includes(perfil.area_interesse as any)
  if (areaAtendida) criterios_atendidos++

  const nivel: NivelMatch = criterios_atendidos === criterios_total ? 'total' : 'parcial'

  return { programa, nivel, criterios_atendidos, criterios_total }
}

export function filtrarProgramas(
  programas: Programa[],
  perfil: PerfilUsuario
): ProgramaComMatch[] {
  return programas
    .map((p) => calcularMatch(p, perfil))
    .filter((r): r is ProgramaComMatch => r !== null)
    .sort((a, b) => b.criterios_atendidos - a.criterios_atendidos)
}
```

- [ ] **Step 4: Rodar testes — verificar que passam**

```bash
cd frontend && npx jest lib/matching.test.ts
```
Expected: PASS — 5 testes passando

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/matching.ts frontend/lib/matching.test.ts
git commit -m "feat: add quiz matching logic with tests"
```

---

### Task 3.2: Componente QuizStep

**Files:**
- Create: `frontend/components/quiz/QuizStep.tsx`

- [ ] **Step 1: Implementar componente**

```tsx
// frontend/components/quiz/QuizStep.tsx
'use client'

interface Opcao {
  valor: string
  label: string
}

interface QuizStepProps {
  pergunta: string
  opcoes: Opcao[]
  valorAtual: string | null
  onSelecionar: (valor: string) => void
  stepAtual: number
  totalSteps: number
}

export function QuizStep({
  pergunta,
  opcoes,
  valorAtual,
  onSelecionar,
  stepAtual,
  totalSteps,
}: QuizStepProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Pergunta {stepAtual} de {totalSteps}</span>
          <span>{Math.round((stepAtual / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(stepAtual / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">{pergunta}</h2>

      <div className="space-y-3">
        {opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            onClick={() => onSelecionar(opcao.valor)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
              valorAtual === opcao.valor
                ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium'
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            {opcao.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/quiz/QuizStep.tsx
git commit -m "feat: add QuizStep component"
```

---

### Task 3.3: Componente MatchBadge

**Files:**
- Create: `frontend/components/quiz/MatchBadge.tsx`

- [ ] **Step 1: Implementar componente**

```tsx
// frontend/components/quiz/MatchBadge.tsx
import { NivelMatch } from '@/types/programa'

interface MatchBadgeProps {
  nivel: NivelMatch
  criterios_atendidos: number
  criterios_total: number
}

export function MatchBadge({ nivel, criterios_atendidos, criterios_total }: MatchBadgeProps) {
  if (nivel === 'total') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✅ Elegível
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      🟡 Possível ({criterios_atendidos}/{criterios_total} critérios)
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/quiz/MatchBadge.tsx
git commit -m "feat: add MatchBadge component"
```

---

### Task 3.4: Página do Quiz

**Files:**
- Create: `frontend/app/quiz/page.tsx`

- [ ] **Step 1: Implementar página**

```tsx
// frontend/app/quiz/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizStep } from '@/components/quiz/QuizStep'
import { PerfilUsuario } from '@/types/programa'

const STEPS = [
  {
    chave: 'estado' as keyof PerfilUsuario,
    pergunta: 'Em qual estado você mora?',
    opcoes: [
      { valor: 'PI', label: 'Piauí' },
      { valor: 'outro', label: 'Outro estado' },
    ],
  },
  {
    chave: 'renda_per_capita' as keyof PerfilUsuario,
    pergunta: 'Qual a renda mensal da sua família dividida por pessoa?',
    opcoes: [
      { valor: '350', label: 'Até R$ 706 por pessoa' },
      { valor: '1400', label: 'Entre R$ 706 e R$ 2.800' },
      { valor: '5000', label: 'Acima de R$ 2.800' },
    ],
  },
  {
    chave: 'tamanho_familia' as keyof PerfilUsuario,
    pergunta: 'Quantas pessoas moram na sua casa?',
    opcoes: [
      { valor: '1', label: '1 pessoa (moro sozinho)' },
      { valor: '3', label: '2 a 4 pessoas' },
      { valor: '6', label: '5 ou mais pessoas' },
    ],
  },
  {
    chave: 'perfil' as keyof PerfilUsuario,
    pergunta: 'Qual é o seu perfil principal?',
    opcoes: [
      { valor: 'familia', label: 'Família com filhos' },
      { valor: 'idoso', label: 'Idoso (60+)' },
      { valor: 'jovem', label: 'Jovem estudante' },
      { valor: 'agricultor', label: 'Agricultor / trabalhador rural' },
      { valor: 'pcd', label: 'Pessoa com deficiência' },
      { valor: 'outro', label: 'Outro' },
    ],
  },
  {
    chave: 'area_interesse' as keyof PerfilUsuario,
    pergunta: 'Qual área te interessa?',
    opcoes: [
      { valor: 'todos', label: 'Todas as áreas' },
      { valor: 'renda', label: 'Renda / transferência de dinheiro' },
      { valor: 'moradia', label: 'Moradia' },
      { valor: 'saude', label: 'Saúde' },
      { valor: 'educacao', label: 'Educação' },
      { valor: 'emprego', label: 'Emprego e qualificação' },
      { valor: 'agricultura', label: 'Agricultura' },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [stepAtual, setStepAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})

  const step = STEPS[stepAtual]

  function selecionar(valor: string) {
    const novasRespostas = { ...respostas, [step.chave]: valor }
    setRespostas(novasRespostas)

    if (stepAtual < STEPS.length - 1) {
      setStepAtual(stepAtual + 1)
    } else {
      // Serializar perfil e navegar para resultados
      const params = new URLSearchParams(novasRespostas)
      router.push(`/programas?${params.toString()}`)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <QuizStep
          pergunta={step.pergunta}
          opcoes={step.opcoes}
          valorAtual={respostas[step.chave] ?? null}
          onSelecionar={selecionar}
          stepAtual={stepAtual + 1}
          totalSteps={STEPS.length}
        />
        {stepAtual > 0 && (
          <button
            onClick={() => setStepAtual(stepAtual - 1)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </button>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Testar quiz no browser**

```bash
cd frontend && pnpm run dev
```
Acesse http://localhost:3000/quiz — navegar pelas 5 perguntas, verificar progresso e redirecionamento.

- [ ] **Step 3: Commit**

```bash
git add frontend/app/quiz/
git commit -m "feat: add quiz page with 5-step flow"
```

---

## Sprint 4 — Catálogo e Página do Programa (Dias 11–14)

### Task 4.1: Componente ProgramaCard

**Files:**
- Create: `frontend/components/programas/ProgramaCard.tsx`

- [ ] **Step 1: Implementar componente**

```tsx
// frontend/components/programas/ProgramaCard.tsx
import Link from 'next/link'
import { Programa, ProgramaComMatch } from '@/types/programa'
import { MatchBadge } from '@/components/quiz/MatchBadge'

const AREA_LABELS: Record<string, string> = {
  saude: 'Saúde', educacao: 'Educação', moradia: 'Moradia',
  renda: 'Renda', emprego: 'Emprego', agricultura: 'Agricultura',
  cultura: 'Cultura', outro: 'Outro',
}

interface ProgramaCardProps {
  programa: Programa
  match?: ProgramaComMatch
}

export function ProgramaCard({ programa, match }: ProgramaCardProps) {
  return (
    <Link
      href={`/programas/${programa.slug}`}
      className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900">{programa.nome}</h3>
        {match && (
          <MatchBadge
            nivel={match.nivel}
            criterios_atendidos={match.criterios_atendidos}
            criterios_total={match.criterios_total}
          />
        )}
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{programa.descricao}</p>

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
          {programa.esfera === 'federal' ? '🇧🇷 Federal' : `📍 ${programa.estado}`}
        </span>
        {programa.areas.slice(0, 2).map((area) => (
          <span key={area} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
            {AREA_LABELS[area]}
          </span>
        ))}
        {programa.valor_beneficio && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">
            💰 {programa.valor_beneficio}
          </span>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/programas/ProgramaCard.tsx
git commit -m "feat: add ProgramaCard component"
```

---

### Task 4.2: Página do Catálogo com matching

**Files:**
- Create: `frontend/app/programas/page.tsx`

- [ ] **Step 1: Implementar página**

```tsx
// frontend/app/programas/page.tsx
import { getProgramas } from '@/lib/strapi'
import { filtrarProgramas } from '@/lib/matching'
import { ProgramaCard } from '@/components/programas/ProgramaCard'
import { PerfilUsuario } from '@/types/programa'
import Link from 'next/link'

interface SearchParams {
  estado?: string
  renda_per_capita?: string
  tamanho_familia?: string
  perfil?: string
  area_interesse?: string
}

export default async function ProgramasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const programas = await getProgramas()

  const temPerfil = searchParams.estado && searchParams.renda_per_capita

  let resultados = programas.map((p) => ({ programa: p, match: undefined as any }))

  if (temPerfil) {
    const perfil: PerfilUsuario = {
      estado: searchParams.estado!,
      renda_per_capita: Number(searchParams.renda_per_capita),
      tamanho_familia: Number(searchParams.tamanho_familia ?? 1),
      perfil: (searchParams.perfil as any) ?? 'outro',
      area_interesse: (searchParams.area_interesse as any) ?? 'todos',
    }
    const matches = filtrarProgramas(programas, perfil)
    resultados = matches.map((m) => ({ programa: m.programa, match: m }))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {temPerfil ? 'Programas para o seu perfil' : 'Todos os programas'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {resultados.length} programa{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/quiz"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refazer quiz
          </Link>
        </div>

        <div className="space-y-3">
          {resultados.map(({ programa, match }) => (
            <ProgramaCard key={programa.id} programa={programa} match={match} />
          ))}
        </div>

        {resultados.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Nenhum programa encontrado para este perfil.</p>
            <Link href="/quiz" className="text-blue-600 hover:underline">
              Tentar com outro perfil
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verificar no browser**

```bash
pnpm run dev
```
Acesse http://localhost:3000/programas — lista vazia (ainda sem dados no CMS). Acesse com parâmetros: `/programas?estado=PI&renda_per_capita=500&tamanho_familia=3&perfil=familia&area_interesse=renda`

- [ ] **Step 3: Commit**

```bash
git add frontend/app/programas/page.tsx
git commit -m "feat: add catalog page with quiz matching"
```

---

### Task 4.3: Página individual do Programa

**Files:**
- Create: `frontend/app/programas/[slug]/page.tsx`

- [ ] **Step 1: Implementar página**

```tsx
// frontend/app/programas/[slug]/page.tsx
import { getProgramaBySlug, getProgramas } from '@/lib/strapi'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const ESFERA_LABEL = { federal: '🇧🇷 Federal', estadual: '📍 Estadual', municipal: '🏙️ Municipal' }

export async function generateStaticParams() {
  const programas = await getProgramas()
  return programas.map((p) => ({ slug: p.slug }))
}

export default async function ProgramaPage({ params }: { params: { slug: string } }) {
  const programa = await getProgramaBySlug(params.slug)
  if (!programa) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/programas" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Voltar ao catálogo
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="mb-1">
            <span className="text-sm text-gray-500">{ESFERA_LABEL[programa.esfera]}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{programa.nome}</h1>
          <p className="text-gray-700 mb-6">{programa.descricao}</p>

          {programa.valor_beneficio && (
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-green-800">💰 Valor do benefício</p>
              <p className="text-green-900">{programa.valor_beneficio}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-2">Como se inscrever</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{programa.como_se_inscrever}</p>
          </div>

          {programa.link_oficial && (
            <a
              href={programa.link_oficial}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
              Acessar site oficial →
            </a>
          )}

          <p className="text-xs text-gray-400 mt-6">
            Atualizado em {new Date(programa.data_atualizacao).toLocaleDateString('pt-BR')} · Fonte: {programa.fonte}
          </p>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/programas/[slug]/
git commit -m "feat: add individual program page"
```

---

## Sprint 5 — Contribuição, Home e Seed de Dados (Dias 15–18)

### Task 5.1: Página de Contribuição

**Files:**
- Create: `frontend/app/contribuir/page.tsx`

- [ ] **Step 1: Implementar formulário**

```tsx
// frontend/app/contribuir/page.tsx
'use client'

import { useState } from 'react'
import { submitContribuicao } from '@/lib/strapi'

export default function ContribuirPage() {
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [form, setForm] = useState({
    nome: '', descricao: '', esfera: 'federal', estado: '',
    valor_beneficio: '', como_se_inscrever: '', link_oficial: '',
    fonte: '', email_colaborador: '',
  })

  function atualizar(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function enviar() {
    setEnviando(true)
    const ok = await submitContribuicao({ ...form, status_revisao: 'pendente' })
    setEnviando(false)
    if (ok) setSucesso(true)
  }

  if (sucesso) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contribuição enviada!</h1>
          <p className="text-gray-600">
            Nossa equipe irá revisar as informações em breve. Obrigado por ajudar!
          </p>
        </div>
      </main>
    )
  }

  const campo = (label: string, chave: string, tipo = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {tipo === 'textarea' ? (
        <textarea
          value={(form as any)[chave]}
          onChange={(e) => atualizar(chave, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type={tipo}
          value={(form as any)[chave]}
          onChange={(e) => atualizar(chave, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contribuir com um programa</h1>
        <p className="text-gray-500 text-sm mb-8">
          Conhece um programa público que não está no catálogo? Envie as informações e nossa equipe irá revisar.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {campo('Nome do programa *', 'nome', 'text', 'ex: Bolsa Família')}
          {campo('Descrição *', 'descricao', 'textarea', 'Descreva o programa e quem pode participar')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Esfera de governo</label>
            <select
              value={form.esfera}
              onChange={(e) => atualizar('esfera', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="federal">Federal</option>
              <option value="estadual">Estadual</option>
              <option value="municipal">Municipal</option>
            </select>
          </div>

          {form.esfera !== 'federal' && campo('Estado (UF)', 'estado', 'text', 'ex: PI')}
          {campo('Valor do benefício', 'valor_beneficio', 'text', 'ex: até R$ 706/mês')}
          {campo('Como se inscrever *', 'como_se_inscrever', 'textarea', 'Passo a passo para se inscrever')}
          {campo('Link oficial', 'link_oficial', 'url', 'https://...')}
          {campo('Fonte / referência *', 'fonte', 'text', 'ex: gov.br, secretaria estadual...')}
          {campo('Seu e-mail (para contato)', 'email_colaborador', 'email', 'seu@email.com')}

          <button
            onClick={enviar}
            disabled={enviando || !form.nome || !form.descricao || !form.como_se_inscrever}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? 'Enviando...' : 'Enviar contribuição'}
          </button>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/contribuir/
git commit -m "feat: add contribution form page"
```

---

### Task 5.2: Home Page

**Files:**
- Create: `frontend/app/page.tsx`

- [ ] **Step 1: Implementar home**

```tsx
// frontend/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Descubra os programas públicos que são para você
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Responda 5 perguntas e veja quais benefícios do governo federal e estadual você pode acessar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700"
          >
            Descobrir meus benefícios →
          </Link>
          <Link
            href="/programas"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border border-gray-200 hover:border-blue-300"
          >
            Ver todos os programas
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          Conhece um programa que não está aqui?{' '}
          <Link href="/contribuir" className="text-blue-600 hover:underline">
            Contribua com o catálogo
          </Link>
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/page.tsx
git commit -m "feat: add home page"
```

---

### Task 5.3: Seed de dados iniciais no Strapi

**Files:**
- Create: `cms/seed/programas.json`

- [ ] **Step 1: Criar arquivo de seed com 5 programas reais**

```json
[
  {
    "nome": "Bolsa Família",
    "descricao": "Programa de transferência direta de renda para famílias em situação de pobreza e extrema pobreza.",
    "esfera": "federal",
    "estado": null,
    "areas": ["renda"],
    "publicos_alvo": ["familia"],
    "renda_maxima_per_capita": 706,
    "tamanho_familia_min": 1,
    "tamanho_familia_max": null,
    "estados_validos": ["federal"],
    "valor_beneficio": "A partir de R$ 142/mês por criança",
    "como_se_inscrever": "1. Inscreva-se no CadÚnico no CRAS mais próximo\n2. Mantenha o cadastro atualizado\n3. O governo seleciona automaticamente as famílias elegíveis",
    "link_oficial": "https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia",
    "status": "ativo",
    "data_atualizacao": "2024-01-01",
    "fonte": "gov.br"
  },
  {
    "nome": "Pé-de-Meia",
    "descricao": "Incentivo financeiro-educacional para estudantes do ensino médio de escolas públicas inscritos no CadÚnico.",
    "esfera": "federal",
    "estado": null,
    "areas": ["educacao", "renda"],
    "publicos_alvo": ["jovem", "familia"],
    "renda_maxima_per_capita": 706,
    "tamanho_familia_min": 1,
    "tamanho_familia_max": null,
    "estados_validos": ["federal"],
    "valor_beneficio": "R$ 200/mês + poupança de R$ 1.000/ano",
    "como_se_inscrever": "1. Estar matriculado no ensino médio público\n2. Ter entre 14 e 24 anos\n3. Família inscrita no CadÚnico com renda até meio salário mínimo per capita\n4. Inscrição automática via MEC",
    "link_oficial": "https://www.gov.br/mec/pt-br/pe-de-meia",
    "status": "ativo",
    "data_atualizacao": "2024-01-01",
    "fonte": "gov.br"
  },
  {
    "nome": "Tarifa Social de Energia Elétrica",
    "descricao": "Desconto na conta de energia elétrica para famílias de baixa renda inscritas no CadÚnico.",
    "esfera": "federal",
    "estado": null,
    "areas": ["renda", "outro"],
    "publicos_alvo": ["familia", "idoso", "pcd"],
    "renda_maxima_per_capita": 706,
    "tamanho_familia_min": 1,
    "tamanho_familia_max": null,
    "estados_validos": ["federal"],
    "valor_beneficio": "Desconto de 10% a 65% na conta de luz",
    "como_se_inscrever": "1. Estar inscrito no CadÚnico\n2. Solicitar o desconto diretamente na distribuidora de energia elétrica da sua cidade",
    "link_oficial": "https://www.gov.br/aneel/pt-br/assuntos/tarifas/tarifa-social",
    "status": "ativo",
    "data_atualizacao": "2024-01-01",
    "fonte": "gov.br/aneel"
  },
  {
    "nome": "Garantia-Safra",
    "descricao": "Benefício para agricultores familiares do Semiárido que perdem mais de 50% da produção por causa da seca ou excesso de chuva.",
    "esfera": "federal",
    "estado": null,
    "areas": ["agricultura", "renda"],
    "publicos_alvo": ["agricultor"],
    "renda_maxima_per_capita": 706,
    "tamanho_familia_min": 1,
    "tamanho_familia_max": null,
    "estados_validos": ["PI", "CE", "BA", "PB", "PE", "RN", "MA", "AL", "SE"],
    "valor_beneficio": "R$ 1.200 por safra",
    "como_se_inscrever": "1. Ser agricultor familiar no Semiárido\n2. Inscrever-se no município entre julho e setembro\n3. Pagar o boleto de adesão\n4. Aguardar confirmação de perda pelo técnico municipal",
    "link_oficial": "https://www.gov.br/mda/pt-br/acoes-e-programas/garantia-safra",
    "status": "ativo",
    "data_atualizacao": "2024-01-01",
    "fonte": "gov.br/mda"
  },
  {
    "nome": "BPC — Benefício de Prestação Continuada",
    "descricao": "Benefício de 1 salário mínimo mensal para idosos com 65 anos ou mais e pessoas com deficiência que não têm renda suficiente para se manter.",
    "esfera": "federal",
    "estado": null,
    "areas": ["renda", "saude"],
    "publicos_alvo": ["idoso", "pcd"],
    "renda_maxima_per_capita": 353,
    "tamanho_familia_min": 1,
    "tamanho_familia_max": null,
    "estados_validos": ["federal"],
    "valor_beneficio": "1 salário mínimo mensal (R$ 1.412)",
    "como_se_inscrever": "1. Inscrever-se no CadÚnico\n2. Agendar atendimento pelo Meu INSS (app ou site)\n3. Comparecer à agência do INSS com documentos\n4. Aguardar análise do pedido",
    "link_oficial": "https://www.gov.br/inss/pt-br/saiba-mais/seus-direitos-e-deveres/beneficios-e-servicos/beneficios/beneficio-assistencial-ao-idoso-e-a-pessoa-com-deficiencia-bpc",
    "status": "ativo",
    "data_atualizacao": "2024-01-01",
    "fonte": "gov.br/inss"
  }
]
```

- [ ] **Step 2: Inserir dados via painel Strapi**

Acesse o painel Strapi → Content Manager → Programa → Add new entry para cada programa do JSON acima. Preencha todos os campos e publique.

- [ ] **Step 3: Verificar que programas aparecem na API**

```bash
curl http://localhost:1337/api/programas?populate=*
```
Expected: array com 5 programas

- [ ] **Step 4: Verificar que quiz retorna resultados**

Acesse: http://localhost:3000/programas?estado=PI&renda_per_capita=500&tamanho_familia=3&perfil=familia&area_interesse=renda
Expected: Bolsa Família e Tarifa Social aparecem com ✅

- [ ] **Step 5: Commit**

```bash
git add cms/seed/
git commit -m "feat: add seed data with 5 initial programs"
```

---

## Sprint 6 — Deploy e Produção (Dias 19–21)

### Task 6.1: Deploy do CMS no VPS

- [ ] **Step 1: Configurar variáveis de ambiente no VPS**

```bash
# No VPS, criar /home/ubuntu/acessoCidadao-cms/.env
APP_KEYS=<gerar com: openssl rand -base64 32>
API_TOKEN_SALT=<openssl rand -base64 32>
ADMIN_JWT_SECRET=<openssl rand -base64 32>
JWT_SECRET=<openssl rand -base64 32>
DATABASE_CLIENT=postgres
DATABASE_URL=<URL_SUPABASE>
NODE_ENV=production
```

- [ ] **Step 2: Build e start do Strapi**

```bash
cd cms && pnpm run build && pnpm run start
```
Expected: Strapi rodando em http://<VPS_IP>:1337

- [ ] **Step 3: Configurar PM2 para manter o processo**

```bash
pnpm install -g pm2
pm2 start pnpm --name "acessoCidadao-cms" -- start
pm2 save && pm2 startup
```

- [ ] **Step 4: Verificar API pública**

```bash
curl http://<VPS_IP>:1337/api/programas
```
Expected: lista de programas

---

### Task 6.2: Deploy do Frontend na Vercel

- [ ] **Step 1: Criar projeto na Vercel**

```bash
cd frontend && npx vercel --prod
```

- [ ] **Step 2: Configurar variável de ambiente na Vercel**

Dashboard Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_STRAPI_URL = http://<VPS_IP>:1337
```

- [ ] **Step 3: Redeploy**

```bash
npx vercel --prod
```
Expected: URL de produção funcionando

- [ ] **Step 4: Testar fluxo completo em produção**

1. Acessar URL de produção
2. Clicar em "Descobrir meus benefícios"
3. Completar o quiz
4. Verificar resultados com badges
5. Clicar em um programa → ver detalhes
6. Acessar /contribuir → enviar formulário
7. No painel Strapi → verificar contribuição na fila

- [ ] **Step 5: Commit final**

```bash
git tag v0.1.0
git push origin main --tags
```

---

## Resumo dos Sprints

| Sprint | Foco | Dias | Entrega |
|--------|------|------|---------|
| 1 | Setup e infraestrutura | 1–3 | Repo + Next.js + Strapi instalados |
| 2 | CMS e API | 4–6 | Content types + cliente Strapi |
| 3 | Lógica de matching + Quiz | 7–10 | Quiz funcional com matching testado |
| 4 | Catálogo e páginas | 11–14 | Catálogo + página individual |
| 5 | Contribuição + Home + Seed | 15–18 | App completo com dados reais |
| 6 | Deploy | 19–21 | MVP em produção |