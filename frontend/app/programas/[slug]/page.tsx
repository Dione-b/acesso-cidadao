import { getProgramaBySlug, getProgramas } from '@/lib/strapi'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const ESFERA_LABEL = { federal: '🇧🇷 Federal', estadual: '📍 Estadual', municipal: '🏙️ Municipal' }

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const programas = await getProgramas()
    return programas.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default async function ProgramaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const programa = await getProgramaBySlug(slug)
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
