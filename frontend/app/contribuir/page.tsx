import Link from 'next/link'

const GITHUB_REPO = 'https://github.com/Dione-b/acesso-cidadao'

const HOW_TO_CONTRIBUTE = [
  {
    icon: '🐛',
    title: 'Reportar um bug',
    desc: 'Encontrou algum dado errado ou comportamento inesperado? Abra uma issue.',
  },
  {
    icon: '📋',
    title: 'Sugerir um programa',
    desc: 'Conhece um programa público que não está no catálogo? Proponha via issue ou PR.',
  },
  {
    icon: '💻',
    title: 'Contribuir com código',
    desc: 'Abra um fork, implemente a melhoria e envie um Pull Request.',
  },
  {
    icon: '📝',
    title: 'Melhorar a documentação',
    desc: 'Correções de texto, traduções, exemplos — toda ajuda é bem-vinda.',
  },
]

export default function ContribuirPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm mb-4 sm:mb-6 animate-fade-up" aria-label="Breadcrumb">
          <Link href="/" className="text-neutral-400 hover:text-brand-600 transition-colors shrink-0">
            Início
          </Link>
          <svg className="w-3.5 h-3.5 text-neutral-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-neutral-600 font-medium">Contribuir</span>
        </nav>

        {/* Cabeçalho */}
        <div className="mb-6 sm:mb-8 animate-fade-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Contribuir com o projeto
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
            O <strong className="text-neutral-700">Acesso Cidadão</strong> é um projeto open source.
            Qualquer pessoa pode contribuir com dados, código ou melhorias diretamente pelo repositório no GitHub.
          </p>
        </div>

        {/* Card principal */}
        <div
          className="bg-white rounded-2xl card-elevate overflow-hidden animate-fade-up"
          style={{ animationDelay: '100ms' }}
        >
          {/* Header decorativo */}
          <div className="gradient-hero px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🤝</div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Projeto open source</h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              Contribuições aceitas via Pull Request no GitHub
            </p>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Formas de contribuir */}
            <h3 className="font-semibold text-neutral-800 mb-3 sm:mb-4 text-sm sm:text-base">Como você pode ajudar</h3>

            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {HOW_TO_CONTRIBUTE.map(item => (
                <div
                  key={item.title}
                  className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-neutral-50 rounded-xl border border-neutral-100"
                >
                  <span className="text-lg sm:text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm">{item.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <a
                href={`${GITHUB_REPO}/issues/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm sm:text-base w-full justify-center py-3 sm:py-2.5"
                id="cta-abrir-issue"
              >
                {/* Ícone do GitHub */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Abrir uma issue no GitHub
              </a>

              <a
                href={`${GITHUB_REPO}/fork`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm sm:text-base w-full justify-center py-3 sm:py-2.5"
                id="cta-fork-repo"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Fazer fork e contribuir com PR
              </a>
            </div>

            {/* Link para o repositório */}
            <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                id="link-repo-github"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                github.com/Dione-b/acesso-cidadao
              </a>
            </div>
          </div>
        </div>

        {/* Voltar */}
        <div className="mt-4 sm:mt-6 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          <Link
            href="/programas"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </main>
  )
}
