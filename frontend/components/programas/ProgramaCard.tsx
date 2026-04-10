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
