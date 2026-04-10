import { calcularMatch, filtrarProgramas } from './matching'
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
