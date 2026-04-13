import Link from 'next/link'
import { getEstadosDisponiveis, getTodosProgramas } from '@/data'

const AREA_ICONS: Record<string, string> = {
  saude: '🏥',
  educacao: '📚',
  moradia: '🏠',
  renda: '💰',
  emprego: '💼',
  agricultura: '🌾',
  cultura: '🎭',
  energia: '⚡',
  alimentacao: '🍽️',
  saneamento: '🚰',
  inclusao: '🤝',
  outro: '📋',
}

export default function HomePage() {
  const estados = getEstadosDisponiveis()
  const todosProgramas = getTodosProgramas()
  const totalProgramas = todosProgramas.length
  const programasAtivos = todosProgramas.filter(p => p.status === 'ativo').length

  /* Contar áreas únicas */
  const areasUnicas = new Set(todosProgramas.flatMap(p => p.areas))

  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="gradient-hero relative overflow-hidden" id="hero">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-5 pattern-dots" />

        {/* Faixa amarela decorativa */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brasil-gold/10 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium mb-4 sm:mb-6 backdrop-blur-sm border border-white/10">
                🇧🇷 Plataforma aberta e colaborativa
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4 sm:mb-5">
                Descubra seus{' '}
                <span className="text-brasil-gold">direitos</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Encontre benefícios do governo federal e estadual disponíveis para você e sua família — em um único lugar.
              </p>
            </div>

            <div className="animate-fade-up flex flex-col sm:flex-row gap-3" style={{ animationDelay: '150ms' }}>
              <Link
                href="/programas"
                className="btn-primary text-base px-6 py-3.5 bg-white text-brand-800 hover:bg-neutral-50 hover:shadow-xl"
                id="cta-ver-programas"
              >
                Ver todos os programas
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/contribuir"
                className="btn-secondary text-base px-6 py-3.5 border-white/20 text-white bg-white/10 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
                id="cta-contribuir"
              >
                Contribuir com o catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="stat-card stat-card-green bg-white rounded-xl px-4 sm:px-6 py-4 sm:py-5 card-elevate animate-fade-up stagger-1">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{totalProgramas}</p>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Programas cadastrados</p>
          </div>
          <div className="stat-card stat-card-gold bg-white rounded-xl px-4 sm:px-6 py-4 sm:py-5 card-elevate animate-fade-up stagger-2">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{programasAtivos}</p>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Programas ativos</p>
          </div>
          <div className="stat-card stat-card-blue bg-white rounded-xl px-4 sm:px-6 py-4 sm:py-5 card-elevate animate-fade-up stagger-3">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{areasUnicas.size}</p>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Áreas de atuação</p>
          </div>
        </div>
      </section>

      {/* ─── Estados ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20" id="estados">
        <div className="text-center mb-10 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
            Explore por região
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Selecione um estado para ver os programas específicos da sua região
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {estados.map((estado, index) => (
            <Link
              key={estado.sigla}
              href={`/programas?estado=${estado.sigla}`}
              className={`
                group bg-white rounded-xl p-4 sm:p-5 card-elevate animate-fade-up
                stagger-${Math.min(index + 1, 6)}
              `}
              id={`estado-${estado.sigla.toLowerCase()}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg group-hover:text-brand-700 transition-colors">
                    {estado.nome}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{estado.descricao}</p>
                </div>
                <span className="badge badge-estadual shrink-0">
                  {estado.sigla === 'federal' ? '🇧🇷' : '📍'} {estado.sigla}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-sm font-medium text-brand-600">
                  {estado.total_programas} programa{estado.total_programas !== 1 ? 's' : ''}
                </span>
                <svg
                  className="w-4 h-4 text-neutral-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
            Conhece um programa que não está no catálogo?
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mb-6 max-w-md mx-auto">
            Ajude a manter o catálogo completo e atualizado para todos os brasileiros.
          </p>
          <Link href="/contribuir" className="btn-primary text-sm sm:text-base" id="cta-contribuir-bottom">
            Contribuir agora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
