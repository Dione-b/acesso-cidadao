import { Programa } from '@/types/programa'
import programasFederal from './federal.json'
import programasPI from './pi.json'
import estadosData from './estados.json'

export interface EstadoInfo {
  sigla: string
  nome: string
  descricao: string
  total_programas: number
}

export const estados: EstadoInfo[] = estadosData

export const programasPorEstado: Record<string, Programa[]> = {
  federal: programasFederal as Programa[],
  PI: programasPI as Programa[],
}

export function getProgramasPorEstado(estado: string): Programa[] {
  return programasPorEstado[estado] || []
}

export function getTodosProgramas(): Programa[] {
  return Object.values(programasPorEstado).flat()
}

export function getEstadosDisponiveis(): EstadoInfo[] {
  return estados.filter(e => e.total_programas > 0)
}

export function getEstadoPorSigla(sigla: string): EstadoInfo | undefined {
  return estados.find(e => e.sigla === sigla)
}

export function getProgramaPorSlug(slug: string): Programa | undefined {
  return getTodosProgramas().find(p => p.slug === slug)
}
