export default function Avatar({ type }) {
  if (type === 'bot') {
    // Birrete
    return (
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/80 shadow" aria-label="Bot" role="img">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="11" cy="13" rx="8" ry="6" fill="#fff"/>
          <path d="M5 8 L11 5 L17 8" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
          <rect x="9.5" y="3.5" width="3" height="1.2" rx="0.6" fill="var(--color-accent)"/>
          <rect x="10.5" y="2" width="1" height="2" rx="0.5" fill="var(--color-accent)"/>
        </svg>
      </span>
    )
  }
  // Usuario: círculo con inicial
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-title font-bold text-lg shadow" aria-label="Tú" role="img">
      U
    </span>
  )
} 