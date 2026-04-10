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
