export type Esfera = 'federal' | 'estadual' | 'municipal'

export type Area =
  | 'saude'
  | 'educacao'
  | 'moradia'
  | 'renda'
  | 'emprego'
  | 'agricultura'
  | 'cultura'
  | 'outro'
  | 'energia'
  | 'alimentacao'
  | 'saneamento'
  | 'inclusao'

export type PublicoAlvo =
  | 'familia'
  | 'idoso'
  | 'jovem'
  | 'mulher'
  | 'agricultor'
  | 'pcd'
  | 'indigena'
  | 'outro'
  | 'estudante'

export type StatusPrograma = 'ativo' | 'encerrado' | 'suspenso'

export interface Programa {
  slug: string
  nome: string
  descricao: string
  esfera: Esfera
  estado: string | null
  areas: Area[]
  publicos_alvo: PublicoAlvo[]
  renda_maxima_per_capita: number | null
  tamanho_familia_min: number
  tamanho_familia_max: number | null
  estados_validos: string[]
  valor_beneficio: string
  como_se_inscrever: string
  link_oficial: string
  status: StatusPrograma
  data_atualizacao: string
  fonte: string
}
