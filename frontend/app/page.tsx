import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Descubra os programas públicos que são para você
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Responda 5 perguntas e veja quais benefícios do governo federal e estadual você pode acessar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700"
          >
            Descobrir meus benefícios →
          </Link>
          <Link
            href="/programas"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border border-gray-200 hover:border-blue-300"
          >
            Ver todos os programas
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          Conhece um programa que não está aqui?{' '}
          <Link href="/contribuir" className="text-blue-600 hover:underline">
            Contribua com o catálogo
          </Link>
        </p>
      </div>
    </main>
  )
}
