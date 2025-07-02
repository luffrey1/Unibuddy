// Botones de respuestas rápidas para preguntas frecuentes
const ICONS = {
  'Horarios': (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2"/></svg>
  ),
  'Profesores': (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>
  ),
  'Ubicación aulas': (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke="currentColor" strokeWidth="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  'Biblioteca': (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M7 4v16M17 4v16"/></svg>
  ),
  'Exámenes': (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M8 2v4M16 2v4M4 10h16"/></svg>
  ),
}

export default function QuickReplies({ onSelect, faqs, fontSize }) {
  return (
    <nav className="flex flex-wrap gap-2 px-6 pb-2" aria-label="Respuestas rápidas">
      {faqs.map(faq => (
        <button
          key={faq.q}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/90 text-white text-xs font-medium hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition shadow animate-fade-in"
          onClick={() => onSelect(faq.q)}
          tabIndex={0}
          aria-label={`Pregunta frecuente: ${faq.q}`}
          style={fontSize ? { fontSize: fontSize } : {}}
        >
          {ICONS[faq.q] || null}
          {faq.q}
        </button>
      ))}
    </nav>
  )
} 