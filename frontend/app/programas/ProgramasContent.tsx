'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProgramaCard } from '@/components/programas/ProgramaCard'
import { Pagination } from '@/components/ui/Pagination'
import { getTodosProgramas, getEstadosDisponiveis } from '@/data'
import { Area, PublicoAlvo } from '@/types/programa'

const ITEMS_PER_PAGE = 5

const AREA_LABELS: Record<Area | string, string> = {
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

const PUBLICO_LABELS: Record<PublicoAlvo | string, string> = {
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

export function ProgramasContent() {
  const searchParams = useSearchParams()
  const urlEstado = searchParams.get('estado')

  const [estadoSelecionado, setEstadoSelecionado] = useState<string>('todos')
  const [areaSelecionada, setAreaSelecionada] = useState<string>('todas')
  const [publicoSelecionado, setPublicoSelecionado] = useState<string>('todos')
  const [textoBusca, setTextoBusca] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (urlEstado) {
      setEstadoSelecionado(urlEstado)
    }
  }, [urlEstado])

  const todosProgramas = getTodosProgramas()
  const estadosDisponiveis = getEstadosDisponiveis()

  const areasDisponiveis = useMemo(() => {
    const areas = new Set<string>()
    todosProgramas.forEach(p => p.areas.forEach(a => areas.add(a)))
    return Array.from(areas).sort()
  }, [todosProgramas])

  const publicosDisponiveis = useMemo(() => {
    const publicos = new Set<string>()
    todosProgramas.forEach(p => p.publicos_alvo.forEach(pub => publicos.add(pub)))
    return Array.from(publicos).sort()
  }, [todosProgramas])

  const hasActiveFilters =
    estadoSelecionado !== 'todos' ||
    areaSelecionada !== 'todas' ||
    publicoSelecionado !== 'todos' ||
    textoBusca.trim() !== ''

  const clearFilters = () => {
    setEstadoSelecionado('todos')
    setAreaSelecionada('todas')
    setPublicoSelecionado('todos')
    setTextoBusca('')
    setCurrentPage(1)
  }

  const programasFiltrados = useMemo(() => {
    return todosProgramas.filter(programa => {
      const matchEstado =
        estadoSelecionado === 'todos' ||
        programa.estados_validos.includes(estadoSelecionado) ||
        (estadoSelecionado === 'federal' && programa.esfera === 'federal')

      const matchArea =
        areaSelecionada === 'todas' || programa.areas.includes(areaSelecionada as Area)

      const matchPublico =
        publicoSelecionado === 'todos' ||
        programa.publicos_alvo.includes(publicoSelecionado as PublicoAlvo)

      const matchBusca =
        textoBusca.trim() === '' ||
        programa.nome.toLowerCase().includes(textoBusca.toLowerCase()) ||
        programa.descricao.toLowerCase().includes(textoBusca.toLowerCase())

      return matchEstado && matchArea && matchPublico && matchBusca
    })
  }, [todosProgramas, estadoSelecionado, areaSelecionada, publicoSelecionado, textoBusca])

  // Reset para p.1 sempre que algum filtro mudar
  useEffect(() => {
    setCurrentPage(1)
  }, [estadoSelecionado, areaSelecionada, publicoSelecionado, textoBusca])

  const totalPages = Math.ceil(programasFiltrados.length / ITEMS_PER_PAGE)
  const programasDaPagina = programasFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Cabeçalho da página */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl font-bold text-neutral-900">Programas disponíveis</h1>
        <p className="text-neutral-500 mt-1">
          {programasFiltrados.length} programa{programasFiltrados.length !== 1 ? 's' : ''} encontrado{programasFiltrados.length !== 1 ? 's' : ''}
          {totalPages > 1 && (
            <span className="ml-2 text-neutral-400">
              · página {currentPage} de {totalPages}
            </span>
          )}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl card-elevate p-5 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }} id="filtros">
        {/* Busca */}
        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar programa por nome ou descrição..."
              value={textoBusca}
              onChange={e => setTextoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg text-base text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              id="busca-programas"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label htmlFor="filtro-estado" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
              Estado
            </label>
            <select
              id="filtro-estado"
              value={estadoSelecionado}
              onChange={e => setEstadoSelecionado(e.target.value)}
              className="select-custom w-full border border-neutral-200 rounded-lg px-3 py-3 text-base text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            >
              <option value="todos">Todos os estados</option>
              {estadosDisponiveis.map(e => (
                <option key={e.sigla} value={e.sigla}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-area" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
              Área de interesse
            </label>
            <select
              id="filtro-area"
              value={areaSelecionada}
              onChange={e => setAreaSelecionada(e.target.value)}
              className="select-custom w-full border border-neutral-200 rounded-lg px-3 py-3 text-base text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            >
              <option value="todas">Todas as áreas</option>
              {areasDisponiveis.map(a => (
                <option key={a} value={a}>
                  {AREA_LABELS[a] || a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-publico" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
              Público-alvo
            </label>
            <select
              id="filtro-publico"
              value={publicoSelecionado}
              onChange={e => setPublicoSelecionado(e.target.value)}
              className="select-custom w-full border border-neutral-200 rounded-lg px-3 py-3 text-base text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            >
              <option value="todos">Todos os públicos</option>
              {publicosDisponiveis.map(p => (
                <option key={p} value={p}>
                  {PUBLICO_LABELS[p] || p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Limpar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
            id="limpar-filtros"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar filtros
          </button>
        )}
      </div>

      {/* Lista de programas da página corrente */}
      <div className="space-y-4">
        {programasDaPagina.map((programa, index) => (
          <div
            key={programa.slug}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
          >
            <ProgramaCard programa={programa} />
          </div>
        ))}
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Empty state */}
      {programasFiltrados.length === 0 && (
        <div className="text-center py-20 animate-fade-in" id="empty-state">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-neutral-700 mb-2">
            Nenhum programa encontrado
          </p>
          <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
            Tente ajustar os filtros ou a busca para encontrar programas disponíveis.
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
