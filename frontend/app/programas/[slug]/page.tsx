import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTodosProgramas, getProgramaPorSlug } from '@/data'

const ESFERA_LABEL: Record<string, string> = {
  federal: '🇧🇷 Federal',
  estadual: '📍 Estadual',
  municipal: '🏙️ Municipal',
}

const AREA_LABELS: Record<string, string> = {
  saude: 'Saúde',
  educacao: 'Educação',
  moradia: 'Moradia',
  renda: 'Renda',
  emprego: 'Emprego',
  agricultura: 'Agricultura',
  cultura: 'Cultura',
  outro: 'Outro',
  energia: 'Energia',
  alimentacao: 'Alimentação',
  saneamento: 'Saneamento',
  inclusao: 'Inclusão',
}

const PUBLICO_LABELS: Record<string, string> = {
  familia: 'Família',
  idoso: 'Idoso',
  jovem: 'Jovem',
  mulher: 'Mulher',
  agricultor: 'Agricultor',
  pcd: 'Pessoa com deficiência',
  indigena: 'Indígena',
  estudante: 'Estudante',
  outro: 'Outro',
}

export const dynamicParams = true

export async function generateStaticParams() {
  const programas = getTodosProgramas()
  return programas.map(p => ({ slug: p.slug }))
}

export default async function ProgramaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const programa = getProgramaPorSlug(slug)
  if (!programa) notFound()

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm mb-4 sm:mb-8 animate-fade-up" aria-label="Breadcrumb">
          <Link href="/programas" className="text-neutral-400 hover:text-brand-600 transition-colors shrink-0">
            Programas
          </Link>
          <svg className="w-3.5 h-3.5 text-neutral-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-neutral-600 font-medium truncate min-w-0">{programa.nome}</span>
        </nav>

        {/* Card principal */}
        <article className="bg-white rounded-2xl card-elevate overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
          {/* Header do card */}
          <div className="gradient-hero px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="badge bg-white/15 text-white border border-white/20 backdrop-blur-sm text-xs sm:text-sm">
                {ESFERA_LABEL[programa.esfera]}
              </span>
              {programa.status === 'ativo' && (
                <span className="badge bg-green-400/20 text-green-100 border border-green-400/20 text-xs sm:text-sm">
                  ● Ativo
                </span>
              )}
              {programa.status === 'suspenso' && (
                <span className="badge bg-yellow-400/20 text-yellow-100 border border-yellow-400/20 text-xs sm:text-sm">
                  ⏸ Suspenso
                </span>
              )}
              {programa.status === 'encerrado' && (
                <span className="badge bg-red-400/20 text-red-100 border border-red-400/20 text-xs sm:text-sm">
                  ✕ Encerrado
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{programa.nome}</h1>
          </div>

          {/* Corpo */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Descrição */}
            <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
              {programa.descricao}
            </p>

            {/* Valor do benefício */}
            {programa.valor_beneficio && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💰</span>
                  <h2 className="font-semibold text-green-800 text-sm">Valor do benefício</h2>
                </div>
                <p className="text-green-900 font-medium text-lg">{programa.valor_beneficio}</p>
              </div>
            )}

            {/* Como se inscrever */}
            <div>
              <h2 className="font-semibold text-neutral-800 text-lg mb-3 flex items-center gap-2">
                <span className="text-base">📝</span>
                Como se inscrever
              </h2>
              <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed text-sm">
                  {programa.como_se_inscrever}
                </p>
              </div>
            </div>

            {/* Áreas e públicos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Áreas de atuação
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {programa.areas.map(area => (
                    <span key={area} className="badge badge-area">{AREA_LABELS[area]}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Público-alvo
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {programa.publicos_alvo.map(pub => (
                    <span key={pub} className="badge badge-federal">{PUBLICO_LABELS[pub]}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Renda / família */}
            {(programa.renda_maxima_per_capita || programa.tamanho_familia_min > 1 || programa.tamanho_familia_max) && (
              <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
                <h3 className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">
                  Critérios de elegibilidade
                </h3>
                <div className="space-y-2 text-sm text-neutral-700">
                  {programa.renda_maxima_per_capita && (
                    <p>
                      <span className="font-medium">Renda máx. per capita:</span>{' '}
                      R$ {programa.renda_maxima_per_capita.toLocaleString('pt-BR')}
                    </p>
                  )}
                  {(programa.tamanho_familia_min > 1 || programa.tamanho_familia_max) && (
                    <p>
                      <span className="font-medium">Tamanho da família:</span>{' '}
                      {programa.tamanho_familia_min}
                      {programa.tamanho_familia_max ? ` a ${programa.tamanho_familia_max}` : '+'} pessoas
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            {programa.link_oficial && (
              <a
                href={programa.link_oficial}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm sm:text-base w-full justify-center py-3 sm:py-2.5"
                id="link-oficial"
              >
                Acessar site oficial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </div>

          {/* Rodapé do card */}
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <span>
              Atualizado em {new Date(programa.data_atualizacao).toLocaleDateString('pt-BR')}
            </span>
            <span className="truncate">Fonte: {programa.fonte}</span>
          </div>
        </article>

        {/* Voltar */}
        <div className="mt-4 sm:mt-6 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          <Link href="/programas" className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </main>
  )
}
