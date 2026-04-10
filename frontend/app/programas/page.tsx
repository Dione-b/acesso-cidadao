import { getProgramas } from '@/lib/strapi'
import { filtrarProgramas } from '@/lib/matching'
import { ProgramaCard } from '@/components/programas/ProgramaCard'
import { PerfilUsuario } from '@/types/programa'
import Link from 'next/link'

interface SearchParams {
  estado?: string
  renda_per_capita?: string
  tamanho_familia?: string
  perfil?: string
  area_interesse?: string
}

export default async function ProgramasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const programas = await getProgramas()

  const temPerfil = params.estado && params.renda_per_capita

  let resultados = programas.map((p) => ({ programa: p, match: undefined as any }))

  if (temPerfil) {
    const perfil: PerfilUsuario = {
      estado: params.estado!,
      renda_per_capita: Number(params.renda_per_capita),
      tamanho_familia: Number(params.tamanho_familia ?? 1),
      perfil: (params.perfil as any) ?? 'outro',
      area_interesse: (params.area_interesse as any) ?? 'todos',
    }
    const matches = filtrarProgramas(programas, perfil)
    resultados = matches.map((m) => ({ programa: m.programa, match: m }))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {temPerfil ? 'Programas para o seu perfil' : 'Todos os programas'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {resultados.length} programa{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/quiz"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refazer quiz
          </Link>
        </div>

        <div className="space-y-3">
          {resultados.map(({ programa, match }) => (
            <ProgramaCard key={programa.id} programa={programa} match={match} />
          ))}
        </div>

        {resultados.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Nenhum programa encontrado para este perfil.</p>
            <Link href="/quiz" className="text-blue-600 hover:underline">
              Tentar com outro perfil
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
