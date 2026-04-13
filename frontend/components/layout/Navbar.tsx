'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/programas', label: 'Programas' },
] as const

export function Navbar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-brand-600 transition-colors">
            AC
          </div>
          <div className="hidden sm:block">
            <span className="text-brand-800 font-bold text-lg leading-tight tracking-tight">
              Acesso
            </span>
            <span className="text-brasil-green font-bold text-lg leading-tight tracking-tight ml-1">
              Cidadão
            </span>
          </div>
        </Link>

        {/* Navegação */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`
                nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive(href)
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-neutral-600 hover:text-brand-700 hover:bg-neutral-50'
                }
              `}
            >
              {label}
            </Link>
          ))}

          <Link
            href="/contribuir"
            className={`
              ml-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${isActive('/contribuir')
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-brand-700 text-white hover:bg-brand-600 shadow-sm hover:shadow-md'
              }
            `}
          >
            Contribuir
          </Link>
        </div>
      </nav>
    </header>
  )
}
