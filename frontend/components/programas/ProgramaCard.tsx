import Link from 'next/link'
import { Programa } from '@/types/programa'

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

interface ProgramaCardProps {
  programa: Programa
}

export function ProgramaCard({ programa }: ProgramaCardProps) {
  const esferaLabel =
    programa.esfera === 'federal'
      ? '🇧🇷 Federal'
      : `📍 ${programa.estado ?? programa.esfera}`

  return (
    <Link
      href={`/programas/${programa.slug}`}
      className="group block bg-white rounded-xl p-4 sm:p-5 card-elevate min-h-[120px]"
      id={`programa-${programa.slug}`}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
        <h3 className="font-semibold text-neutral-900 group-hover:text-brand-700 transition-colors leading-snug text-base sm:text-lg">
          {programa.nome}
        </h3>
        <span
          className={`badge shrink-0 text-xs sm:text-sm ${
            programa.esfera === 'federal' ? 'badge-federal' : 'badge-estadual'
          }`}
        >
          {esferaLabel}
        </span>
      </div>

      {/* Descrição */}
      <p className="text-sm text-neutral-600 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
        {programa.descricao}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {programa.areas.slice(0, 3).map(area => (
          <span key={area} className="badge badge-area text-xs">
            {AREA_ICONS[area]} {AREA_LABELS[area]}
          </span>
        ))}
        {programa.areas.length > 3 && (
          <span className="badge badge-area text-xs">+{programa.areas.length - 3}</span>
        )}

        {programa.valor_beneficio && (
          <span className="badge badge-valor text-xs ml-auto shrink-0">
            💰 {programa.valor_beneficio}
          </span>
        )}
      </div>

      {/* Seta de hover */}
      <div className="mt-3 sm:mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400 truncate">
          Atualizado em {new Date(programa.data_atualizacao).toLocaleDateString('pt-BR')}
        </span>
        <svg
          className="w-4 h-4 text-neutral-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0"
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}
