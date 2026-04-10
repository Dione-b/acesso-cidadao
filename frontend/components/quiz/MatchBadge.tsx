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
