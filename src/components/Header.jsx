import { useState, useEffect } from 'react'

// Logo SVG animado: globo de chat con birrete y destello
function Logo() {
  return (
    <span aria-label="Unibuddy logo" role="img" className="inline-block align-middle mr-2">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="22" rx="16" ry="13" fill="var(--color-primary)"/>
        <ellipse cx="20" cy="22" rx="13" ry="10" fill="white"/>
        <path d="M14 17 L20 13 L26 17" stroke="var(--color-primary)" strokeWidth="2.5" fill="none"/>
        <rect x="17.5" y="10" width="5" height="2.5" rx="1" fill="var(--color-secondary)"/>
        <rect x="19" y="7" width="2" height="3.5" rx="1" fill="var(--color-secondary)"/>
        {/* Destello animado */}
        <circle cx="32" cy="10" r="2" fill="var(--color-accent)">
          <animate attributeName="r" values="2;3;2" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </span>
  )
}

// Toggle de modo oscuro robusto y sincronizado
function DarkModeToggle() {
  // Sincroniza el estado con la clase real en <html> al montar
  const getInitial = () => {
    if (typeof window === 'undefined') return false
    if (document.documentElement.classList.contains('dark')) return true
    try {
      const pref = localStorage.getItem('unibuddy-dark')
      if (pref === '1') return true
      if (pref === '0') return false
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  const [dark, setDark] = useState(getInitial)

  // Aplica la clase 'dark' en html cuando cambia el estado
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem('unibuddy-dark', dark ? '1' : '0') } catch {}
  }, [dark])

  // Solo escucha cambios del sistema si no hay preferencia guardada
  useEffect(() => {
    const pref = localStorage.getItem('unibuddy-dark')
    if (pref !== null) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setDark(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setDark(d => !d)

  return (
    <button
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      onClick={toggle}
      className="ml-2 p-2 rounded-full bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(24,24,27,0.8)] shadow hover:bg-[var(--color-accent)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
      tabIndex={0}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span className="inline-block transition-transform duration-300" style={{transform: dark ? 'rotate(180deg)' : 'rotate(0deg)'}}>
        {dark ? (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-400">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <path stroke="currentColor" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/>
          </svg>
        ) : (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-600 dark:text-gray-200">
            <path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
          </svg>
        )}
      </span>
    </button>
  )
}

// Menú de ayuda/accesibilidad con fondo blanco/gris y texto adaptado
function HelpMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative ml-2">
      <button
        aria-label="Abrir menú de ayuda"
        className="p-2 rounded-full bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(24,24,27,0.8)] shadow hover:bg-[var(--color-accent)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setOpen(o => !o)}
        tabIndex={0}
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path stroke="currentColor" strokeWidth="2" d="M12 8v2m0 4h.01"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4 text-sm animate-fade-in transition-colors">
          <h2 className="font-title text-lg text-primary mb-2">Ayuda & Accesibilidad</h2>
          <ul className="space-y-1 text-gray-800 dark:text-white">
            <li>• Navega con <b>Tab</b> y <b>Shift+Tab</b></li>
            <li>• Contraste alto y modo oscuro</li>
            <li>• Botones <b>A+</b> y <b>A-</b> para aumentar/disminuir fuente</li>
            <li>• Atajos: <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl+K</kbd> para buscar FAQ, <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl +</kbd> y <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl -</kbd> para tamaño de letra</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-20 w-full flex items-center justify-between px-6 py-3 bg-[var(--color-glass)] dark:bg-[var(--color-glass-dark)] backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800" role="banner">
      <div className="flex items-center">
        <Logo />
        <span className="text-2xl font-title font-bold text-primary select-none tracking-tight">Unibuddy</span>
      </div>
      <nav className="flex items-center">
        <DarkModeToggle />
        <HelpMenu />
      </nav>
    </header>
  )
} 