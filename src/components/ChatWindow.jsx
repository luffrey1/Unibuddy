import { useRef, useEffect, useState } from 'react'
import MessageBubble from './MessageBubble'
import QuickReplies from './QuickReplies'
import TypingIndicator from './TypingIndicator'
import { getBotReply, FAQS } from '../logic/bot'

const MIN_WIDTH = 350
const MIN_HEIGHT = 400
const MAX_WIDTH = 900
const MAX_HEIGHT = 900
const MIN_FONT = 14
const MAX_FONT = 28

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700)
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 700)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

// Helper para limitar valores
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export default function ChatWindow() {
  const isMobile = useIsMobile()
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! Soy Unibuddy, tu asistente universitario de Medicina. ¿En qué puedo ayudarte hoy?', ts: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('unibuddy-fontsize')
    return saved ? parseInt(saved, 10) : 16
  })
  const [size, setSize] = useState({ width: 500, height: 600 })
  const [position, setPosition] = useState(() => ({
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 300
  }))
  const [resizing, setResizing] = useState(null) // null | direction string
  const [dragging, setDragging] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sectionRef = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Guardar tamaño de fuente
  useEffect(() => {
    localStorage.setItem('unibuddy-fontsize', fontSize)
  }, [fontSize])

  // Skip link para accesibilidad
  useEffect(() => {
    const handler = e => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isBotTyping])

  // Accesibilidad: atajos para fuente
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey && e.key === '+') { setFontSize(f => Math.min(MAX_FONT, f + 2)); e.preventDefault() }
      if (e.ctrlKey && e.key === '-') { setFontSize(f => Math.max(MIN_FONT, f - 2)); e.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Drag window (solo escritorio)
  useEffect(() => {
    if (isMobile) return
    function onMove(e) {
      if (!dragging) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      setPosition(pos => ({
        x: clamp(clientX - dragOffset.current.x, 0, window.innerWidth - size.width),
        y: clamp(clientY - dragOffset.current.y, 0, window.innerHeight - size.height)
      }))
    }
    function onUp() { setDragging(false) }
    if (dragging) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove)
      window.addEventListener('touchend', onUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, size.width, size.height, isMobile])

  // Resize window (solo escritorio)
  useEffect(() => {
    if (isMobile) return
    function onMove(e) {
      if (!resizing) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      setSize(sz => {
        let { width, height } = sz
        let { x, y } = position
        if (resizing.includes('right')) {
          width = clamp(clientX - x, MIN_WIDTH, MAX_WIDTH)
        }
        if (resizing.includes('left')) {
          const newWidth = clamp(width + (x - clientX), MIN_WIDTH, MAX_WIDTH)
          x = clamp(clientX, 0, x + width - MIN_WIDTH)
          width = newWidth
        }
        if (resizing.includes('bottom')) {
          height = clamp(clientY - y, MIN_HEIGHT, MAX_HEIGHT)
        }
        if (resizing.includes('top')) {
          const newHeight = clamp(height + (y - clientY), MIN_HEIGHT, MAX_HEIGHT)
          y = clamp(clientY, 0, y + height - MIN_HEIGHT)
          height = newHeight
        }
        setPosition({ x, y })
        return { width, height }
      })
    }
    function onUp() { setResizing(null) }
    if (resizing) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove)
      window.addEventListener('touchend', onUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [resizing, position, isMobile])

  // Drag handle
  function startDrag(e) {
    if (isMobile) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const rect = sectionRef.current.getBoundingClientRect()
    dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top }
    setDragging(true)
  }

  // Resize handles
  function startResize(dir, e) {
    if (isMobile) return
    e.stopPropagation()
    setResizing(dir)
  }

  // Maneja el envío de mensajes
  const sendMessage = async (text) => {
    if (!text.trim()) return
    setMessages(msgs => [...msgs, { from: 'user', text, ts: Date.now() }])
    setInput('')
    setIsBotTyping(true)
    // Simula delay de IA
    const reply = await getBotReply(text)
    setMessages(msgs => [...msgs, { from: 'bot', text: reply, ts: Date.now() }])
    setIsBotTyping(false)
    inputRef.current?.focus()
  }

  // Enviar con Enter, Shift+Enter para salto de línea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Estilos y controles según dispositivo
  const sectionStyle = isMobile
    ? {
        width: '100%',
        maxWidth: '400px',
        minWidth: '0',
        height: 'calc(100dvh - 56px)',
        maxHeight: 'calc(100dvh - 56px)',
        minHeight: 'calc(100dvh - 56px)',
        fontSize: fontSize,
        position: 'fixed',
        left: 0,
        right: 0,
        top: '56px',
        zIndex: 10,
        boxShadow: 'none',
        borderRadius: 0,
        border: 'none',
        margin: '0 auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }
    : {
        width: size.width,
        height: size.height,
        fontSize: fontSize,
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 100,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        maxWidth: MAX_WIDTH,
        maxHeight: MAX_HEIGHT,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        userSelect: dragging ? 'none' : 'auto',
        transition: 'box-shadow 0.2s',
      }

  return (
    <>
      <a href="#chat-input" className="sr-only focus:not-sr-only absolute left-2 top-2 bg-primary text-white px-2 py-1 rounded z-50">Saltar al input de chat</a>
      <section
        ref={sectionRef}
        style={sectionStyle}
        className={
          isMobile
            ? "flex flex-col bg-[var(--color-glass)] dark:bg-[var(--color-glass-dark)] backdrop-blur-md animate-fade-in"
            : "w-full max-w-xl h-[75vh] flex flex-col bg-[var(--color-glass)] dark:bg-[var(--color-glass-dark)] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md animate-fade-in"
        }
        aria-label="Ventana de chat con Unibuddy"
        role="region"
      >
        {/* Drag handle barra superior solo escritorio */}
        {!isMobile && (
          <div
            style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 32, cursor: dragging ? 'grabbing' : 'grab', zIndex: 11, borderTopLeftRadius: 18, borderTopRightRadius: 18, background: 'rgba(255,255,255,0.01)'}}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            aria-label="Mover chat"
          />
        )}
        {/* Controles de fuente y resize solo escritorio */}
        {!isMobile && (
          <div style={{position: 'absolute', top: 8, right: 12, zIndex: 12, display: 'flex', alignItems: 'center', gap: 4}}>
            <button
              aria-label="Reducir tamaño de fuente"
              onClick={() => setFontSize(f => Math.max(MIN_FONT, f - 2))}
              style={{ fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', marginRight: 2 }}
            >A-</button>
            <button
              aria-label="Aumentar tamaño de fuente"
              onClick={() => setFontSize(f => Math.min(MAX_FONT, f + 2))}
              style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', marginRight: 4 }}
            >A+</button>
          </div>
        )}
        {/* Resize handles solo escritorio */}
        {!isMobile && <>
          {/* Esquinas */}
          <div onMouseDown={e => startResize('top-left', e)} onTouchStart={e => startResize('top-left', e)} style={{position:'absolute',top:-6,left:-6,width:12,height:12,cursor:'nwse-resize',zIndex:12}} />
          <div onMouseDown={e => startResize('top-right', e)} onTouchStart={e => startResize('top-right', e)} style={{position:'absolute',top:-6,right:-6,width:12,height:12,cursor:'nesw-resize',zIndex:12}} />
          <div onMouseDown={e => startResize('bottom-left', e)} onTouchStart={e => startResize('bottom-left', e)} style={{position:'absolute',bottom:-6,left:-6,width:12,height:12,cursor:'nesw-resize',zIndex:12}} />
          <div onMouseDown={e => startResize('bottom-right', e)} onTouchStart={e => startResize('bottom-right', e)} style={{position:'absolute',bottom:-6,right:-6,width:12,height:12,cursor:'nwse-resize',zIndex:12}} />
          {/* Bordes */}
          <div onMouseDown={e => startResize('top', e)} onTouchStart={e => startResize('top', e)} style={{position:'absolute',top:-6,left:12,right:12,height:12,cursor:'ns-resize',zIndex:12}} />
          <div onMouseDown={e => startResize('bottom', e)} onTouchStart={e => startResize('bottom', e)} style={{position:'absolute',bottom:-6,left:12,right:12,height:12,cursor:'ns-resize',zIndex:12}} />
          <div onMouseDown={e => startResize('left', e)} onTouchStart={e => startResize('left', e)} style={{position:'absolute',left:-6,top:12,bottom:12,width:12,cursor:'ew-resize',zIndex:12}} />
          <div onMouseDown={e => startResize('right', e)} onTouchStart={e => startResize('right', e)} style={{position:'absolute',right:-6,top:12,bottom:12,width:12,cursor:'ew-resize',zIndex:12}} />
        </>}
        {/* Mensajes */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-2"
          tabIndex={0}
          aria-live="polite"
          style={{ fontSize: fontSize, flex: '1 1 0%', minHeight: 0 }}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} from={msg.from} text={msg.text} ts={msg.ts} animate fontSize={fontSize} />
          ))}
          {isBotTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        {/* Respuestas rápidas */}
        <QuickReplies onSelect={sendMessage} faqs={FAQS} fontSize={fontSize} />
        {/* Input de usuario */}
        <form
          className="sticky bottom-0 flex items-center gap-2 p-4 border-t border-gray-100 dark:border-gray-700 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(24,24,27,0.8)] backdrop-blur-md rounded-b-3xl"
          onSubmit={e => { e.preventDefault(); sendMessage(input) }}
          role="search"
          aria-label="Enviar mensaje al chatbot"
        >
          <label htmlFor="chat-input" className="sr-only">Escribe tu mensaje</label>
          <input
            id="chat-input"
            ref={inputRef}
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-gray-900 dark:text-gray-100 shadow-sm font-medium"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            autoComplete="off"
            tabIndex={0}
            aria-label="Escribe tu mensaje"
            maxLength={300}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition shadow"
            disabled={isBotTyping || !input.trim()}
            aria-label="Enviar mensaje. Pulsa Enter para enviar, Shift+Enter para salto de línea"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 12l18-6-6 18-2-8-8-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
        <div className="hidden sm:block text-xs text-timestamp mt-1 ml-2 select-none" aria-hidden="true">
          Pulsa <kbd>Enter</kbd> para enviar, <kbd>Shift+Enter</kbd> para salto de línea
        </div>
      </section>
    </>
  )
} 