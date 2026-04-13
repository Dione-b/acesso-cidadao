'use client'

import { useState, useEffect } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/** Gera a janela de páginas visíveis. Em mobile (total > 5) mostra apenas 3 números. */
function buildPageWindow(current: number, total: number, isMobile = false): (number | 'ellipsis')[] {
  const maxVisible = isMobile && total > 5 ? 3 : 5
  
  if (total <= maxVisible + 2) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]
  
  const windowSize = isMobile ? 1 : 2
  const windowStart = Math.max(2, current - windowSize)
  const windowEnd = Math.min(total - 1, current + windowSize)

  if (windowStart > 2) pages.push('ellipsis')

  for (let p = windowStart; p <= windowEnd; p++) {
    pages.push(p)
  }

  if (windowEnd < total - 1) pages.push('ellipsis')

  pages.push(total)
  return pages
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (totalPages <= 1) return null

  const pages = buildPageWindow(currentPage, totalPages, isMobile)
  const isFirst = currentPage === 1
  const isLast = currentPage === totalPages

  return (
    <nav
      aria-label="Navegação de páginas"
      className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-10 px-2"
    >
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Página anterior"
        className="
          flex items-center gap-1 px-2 sm:px-3 py-2.5 rounded-lg text-sm font-medium
          min-w-[44px] min-h-[44px]
          text-neutral-600 hover:text-brand-700 hover:bg-brand-50
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-600
          transition-colors
        "
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Números */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 sm:w-9 text-center text-neutral-400 text-sm select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Ir para página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors
                min-w-[36px] min-h-[44px]
                ${
                  page === currentPage
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-brand-50 hover:text-brand-700'
                }
              `}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Próxima */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Próxima página"
        className="
          flex items-center gap-1 px-2 sm:px-3 py-2.5 rounded-lg text-sm font-medium
          min-w-[44px] min-h-[44px]
          text-neutral-600 hover:text-brand-700 hover:bg-brand-50
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-600
          transition-colors
        "
      >
        <span className="hidden sm:inline">Próxima</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>
  )
}
