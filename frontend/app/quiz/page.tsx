'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizStep } from '@/components/quiz/QuizStep'
import { PerfilUsuario } from '@/types/programa'

const STEPS = [
  {
    chave: 'estado' as keyof PerfilUsuario,
    pergunta: 'Em qual estado você mora?',
    opcoes: [
      { valor: 'PI', label: 'Piauí' },
      { valor: 'outro', label: 'Outro estado' },
    ],
  },
  {
    chave: 'renda_per_capita' as keyof PerfilUsuario,
    pergunta: 'Qual a renda mensal da sua família dividida por pessoa?',
    opcoes: [
      { valor: '350', label: 'Até R$ 706 por pessoa' },
      { valor: '1400', label: 'Entre R$ 706 e R$ 2.800' },
      { valor: '5000', label: 'Acima de R$ 2.800' },
    ],
  },
  {
    chave: 'tamanho_familia' as keyof PerfilUsuario,
    pergunta: 'Quantas pessoas moram na sua casa?',
    opcoes: [
      { valor: '1', label: '1 pessoa (moro sozinho)' },
      { valor: '3', label: '2 a 4 pessoas' },
      { valor: '6', label: '5 ou mais pessoas' },
    ],
  },
  {
    chave: 'perfil' as keyof PerfilUsuario,
    pergunta: 'Qual é o seu perfil principal?',
    opcoes: [
      { valor: 'familia', label: 'Família com filhos' },
      { valor: 'idoso', label: 'Idoso (60+)' },
      { valor: 'jovem', label: 'Jovem estudante' },
      { valor: 'agricultor', label: 'Agricultor / trabalhador rural' },
      { valor: 'pcd', label: 'Pessoa com deficiência' },
      { valor: 'outro', label: 'Outro' },
    ],
  },
  {
    chave: 'area_interesse' as keyof PerfilUsuario,
    pergunta: 'Qual área te interessa?',
    opcoes: [
      { valor: 'todos', label: 'Todas as áreas' },
      { valor: 'renda', label: 'Renda / transferência de dinheiro' },
      { valor: 'moradia', label: 'Moradia' },
      { valor: 'saude', label: 'Saúde' },
      { valor: 'educacao', label: 'Educação' },
      { valor: 'emprego', label: 'Emprego e qualificação' },
      { valor: 'agricultura', label: 'Agricultura' },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [stepAtual, setStepAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})

  const step = STEPS[stepAtual]

  function selecionar(valor: string) {
    const novasRespostas = { ...respostas, [step.chave]: valor }
    setRespostas(novasRespostas)

    if (stepAtual < STEPS.length - 1) {
      setStepAtual(stepAtual + 1)
    } else {
      // Serializar perfil e navegar para resultados
      const params = new URLSearchParams(novasRespostas)
      router.push(`/programas?${params.toString()}`)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <QuizStep
          pergunta={step.pergunta}
          opcoes={step.opcoes}
          valorAtual={respostas[step.chave] ?? null}
          onSelecionar={selecionar}
          stepAtual={stepAtual + 1}
          totalSteps={STEPS.length}
        />
        {stepAtual > 0 && (
          <button
            onClick={() => setStepAtual(stepAtual - 1)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </button>
        )}
      </div>
    </main>
  )
}
