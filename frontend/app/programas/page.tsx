import { Suspense } from 'react'
import { ProgramasContent } from './ProgramasContent'

export default function ProgramasPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Suspense fallback={<ProgramasSkeleton />}>
        <ProgramasContent />
      </Suspense>
    </main>
  )
}

function ProgramasSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Título */}
      <div className="mb-8">
        <div className="h-8 w-64 animate-shimmer rounded-lg mb-2" />
        <div className="h-4 w-40 animate-shimmer rounded-lg" />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-5 mb-8 card-elevate">
        <div className="h-10 animate-shimmer rounded-lg mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-10 animate-shimmer rounded-lg" />
          <div className="h-10 animate-shimmer rounded-lg" />
          <div className="h-10 animate-shimmer rounded-lg" />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 card-elevate">
            <div className="h-5 w-48 animate-shimmer rounded mb-3" />
            <div className="h-4 w-full animate-shimmer rounded mb-2" />
            <div className="h-4 w-3/4 animate-shimmer rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-5 w-16 animate-shimmer rounded-full" />
              <div className="h-5 w-20 animate-shimmer rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
