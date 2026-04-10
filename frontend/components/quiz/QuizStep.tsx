'use client'

interface Opcao {
  valor: string
  label: string
}

interface QuizStepProps {
  pergunta: string
  opcoes: Opcao[]
  valorAtual: string | null
  onSelecionar: (valor: string) => void
  stepAtual: number
  totalSteps: number
}

export function QuizStep({
  pergunta,
  opcoes,
  valorAtual,
  onSelecionar,
  stepAtual,
  totalSteps,
}: QuizStepProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Pergunta {stepAtual} de {totalSteps}</span>
          <span>{Math.round((stepAtual / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(stepAtual / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">{pergunta}</h2>

      <div className="space-y-3">
        {opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            onClick={() => onSelecionar(opcao.valor)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
              valorAtual === opcao.valor
                ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium'
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            {opcao.label}
          </button>
        ))}
      </div>
    </div>
  )
}
