import { useRef, useState, useEffect } from 'react'

const MIN_WIDTH = 350
const MIN_HEIGHT = 400
const MAX_WIDTH = 900
const MAX_HEIGHT = 900
const MIN_FONT = 14
const MAX_FONT = 28

export default function FloatingChatContainer({ children }) {
  const containerRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [position, setPosition] = useState(() => {
    // Centrado por defecto
    return { x: window.innerWidth/2 - 250, y: window.innerHeight/2 - 300 }
  })
  const [size, setSize] = useState(() => {
    // Tamaño por defecto
    return { width: 500, height: 600 }
  })
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('unibuddy-fontsize')
    return saved ? parseInt(saved, 10) : 16
  })

  // Guardar tamaño de fuente
  useEffect(() => {
    localStorage.setItem('unibuddy-fontsize', fontSize)
  }, [fontSize])

  // Drag
  useEffect(() => {
    function onMove(e) {
      if (!dragging) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      setPosition(pos => ({
        x: Math.max(0, Math.min(window.innerWidth - size.width, clientX - dragging.offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, clientY - dragging.offsetY)),
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
  }, [dragging, size.width, size.height])

  // Resize
  useEffect(() => {
    function onMove(e) {
      if (!resizing) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      setSize(sz => ({
        width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, clientX - position.x)),
        height: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, clientY - position.y)),
      }))
    }
    function onUp() { setResizing(false) }
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
  }, [resizing, position.x, position.y])

  // Centrar si cambia tamaño de ventana
  useEffect(() => {
    function onResize() {
      setPosition(pos => ({
        x: Math.max(0, Math.min(window.innerWidth - size.width, pos.x)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, pos.y)),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [size.width, size.height])

  // Accesibilidad: atajos para fuente
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey && e.key === '+') { setFontSize(f => Math.min(MAX_FONT, f + 2)); e.preventDefault() }
      if (e.ctrlKey && e.key === '-') { setFontSize(f => Math.max(MIN_FONT, f - 2)); e.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Drag handle sólo en la parte superior
  function startDrag(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const rect = containerRef.current.getBoundingClientRect()
    setDragging({
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    })
  }

  // Resize handle en la esquina inferior derecha
  function startResize(e) {
    e.stopPropagation()
    setResizing(true)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        maxWidth: MAX_WIDTH,
        maxHeight: MAX_HEIGHT,
        zIndex: 100,
        fontSize: fontSize,
        background: 'transparent',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        userSelect: dragging ? 'none' : 'auto',
        transition: 'box-shadow 0.2s',
      }}
      aria-label="Ventana de chat flotante Unibuddy"
      tabIndex={0}
    >
      {/* Barra superior para arrastrar y controles */}
      <div
        style={{
          width: '100%',
          height: 36,
          cursor: dragging ? 'grabbing' : 'grab',
          background: 'rgba(255,255,255,0.7)',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 8px',
          gap: 8,
          zIndex: 2,
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        aria-label="Barra de herramientas de la ventana de chat"
      >
        <button
          aria-label="Reducir tamaño de fuente"
          onClick={e => { e.stopPropagation(); setFontSize(f => Math.max(MIN_FONT, f - 2)) }}
          style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', marginRight: 2 }}
        >A-</button>
        <button
          aria-label="Aumentar tamaño de fuente"
          onClick={e => { e.stopPropagation(); setFontSize(f => Math.min(MAX_FONT, f + 2)) }}
          style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', marginRight: 8 }}
        >A+</button>
        <span style={{fontSize: 13, color: '#888', userSelect: 'none'}}>Fuente: {fontSize}px</span>
        <div
          onMouseDown={startResize}
          onTouchStart={startResize}
          style={{
            width: 18, height: 18, marginLeft: 'auto', cursor: 'nwse-resize',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none',
          }}
          aria-label="Redimensionar ventana"
        >
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 14L14 2M6 14h8v-8" stroke="#2563eb" strokeWidth="2" fill="none"/></svg>
        </div>
      </div>
      {/* Contenido del chat */}
      <div style={{flex: 1, overflow: 'auto', minHeight: 0}}>
        {children}
      </div>
    </div>
  )
} 