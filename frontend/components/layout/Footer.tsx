import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-brand-700 flex items-center justify-center text-white font-bold text-xs">
                AC
              </div>
              <span className="font-bold text-brand-800">Acesso Cidadão</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Plataforma aberta que conecta cidadãos aos programas sociais do governo federal e estadual.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-neutral-800 text-sm mb-3">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/programas" className="text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                  Catálogo de Programas
                </Link>
              </li>
              <li>
                <Link href="/contribuir" className="text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                  Contribuir
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-semibold text-neutral-800 text-sm mb-3">Sobre o projeto</h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Projeto comunitário e colaborativo. Os dados são obtidos de fontes públicas oficiais e mantidos pela comunidade.
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-400">
            © {currentYear} Acesso Cidadão — Dados públicos, acesso universal.
          </p>
          <p className="text-xs text-neutral-400">
            Feito com 💚 para o povo brasileiro
          </p>
        </div>
      </div>
    </footer>
  )
}
