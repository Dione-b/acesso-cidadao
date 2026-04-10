'use client'

import { useState } from 'react'
import { submitContribuicao } from '@/lib/strapi'

export default function ContribuirPage() {
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [form, setForm] = useState({
    nome: '', descricao: '', esfera: 'federal', estado: '',
    valor_beneficio: '', como_se_inscrever: '', link_oficial: '',
    fonte: '', email_colaborador: '',
  })

  function atualizar(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function enviar() {
    setEnviando(true)
    const ok = await submitContribuicao({ ...form, status_revisao: 'pendente' })
    setEnviando(false)
    if (ok) setSucesso(true)
  }

  if (sucesso) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contribuição enviada!</h1>
          <p className="text-gray-600">
            Nossa equipe irá revisar as informações em breve. Obrigado por ajudar!
          </p>
        </div>
      </main>
    )
  }

  const campo = (label: string, chave: string, tipo = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {tipo === 'textarea' ? (
        <textarea
          value={(form as any)[chave]}
          onChange={(e) => atualizar(chave, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type={tipo}
          value={(form as any)[chave]}
          onChange={(e) => atualizar(chave, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contribuir com um programa</h1>
        <p className="text-gray-500 text-sm mb-8">
          Conhece um programa público que não está no catálogo? Envie as informações e nossa equipe irá revisar.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          {campo('Nome do programa *', 'nome', 'text', 'ex: Bolsa Família')}
          {campo('Descrição *', 'descricao', 'textarea', 'Descreva o programa e quem pode participar')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Esfera de governo</label>
            <select
              value={form.esfera}
              onChange={(e) => atualizar('esfera', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="federal">Federal</option>
              <option value="estadual">Estadual</option>
              <option value="municipal">Municipal</option>
            </select>
          </div>

          {form.esfera !== 'federal' && campo('Estado (UF)', 'estado', 'text', 'ex: PI')}
          {campo('Valor do benefício', 'valor_beneficio', 'text', 'ex: até R$ 706/mês')}
          {campo('Como se inscrever *', 'como_se_inscrever', 'textarea', 'Passo a passo para se inscrever')}
          {campo('Link oficial', 'link_oficial', 'url', 'https://...')}
          {campo('Fonte / referência *', 'fonte', 'text', 'ex: gov.br, secretaria estadual...')}
          {campo('Seu e-mail (para contato)', 'email_colaborador', 'email', 'seu@email.com')}

          <button
            onClick={enviar}
            disabled={enviando || !form.nome || !form.descricao || !form.como_se_inscrever}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? 'Enviando...' : 'Enviar contribuição'}
          </button>
        </div>
      </div>
    </main>
  )
}
