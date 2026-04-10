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
