// Preguntas frecuentes y respuestas simuladas
export const FAQS = [
  { q: 'Horarios', a: 'Puedes consultar los horarios en el portal universitario o en la cartelera de la facultad.' },
  { q: 'Profesores', a: '¿Buscas información de algún profesor en particular? Puedo darte sus horarios de tutoría o contacto.' },
  { q: 'Ubicación aulas', a: 'Las aulas principales están en el edificio central, planta baja y primer piso.' },
  { q: 'Biblioteca', a: 'La biblioteca abre de 8:00 a 21:00. Recuerda llevar tu carnet universitario.' },
  { q: 'Exámenes', a: 'Las fechas de exámenes se publican en el campus virtual y en la web de la facultad.' },
]

const RANDOM_ANSWERS = [
  '¡Buena pregunta! ¿Quieres que te ayude a buscarlo en la web de la facultad?',
  'No tengo esa información exacta, pero puedo orientarte sobre dónde encontrarla.',
  '¿Te gustaría que te recomiende recursos de estudio?',
  'Si tienes dudas sobre trámites, también puedo ayudarte.'
]

// Simula delay y responde según palabras clave o aleatorio
export async function getBotReply(userText) {
  await new Promise(res => setTimeout(res, 1000 + Math.random() * 1000))
  const txt = userText.toLowerCase()
  for (const faq of FAQS) {
    if (txt.includes(faq.q.toLowerCase())) return faq.a
  }
  if (txt.includes('hola') || txt.includes('buenas')) return '¡Hola! ¿En qué puedo ayudarte hoy?'
  if (txt.includes('gracias')) return '¡De nada! Si tienes más preguntas, aquí estaré.'
  if (txt.includes('adiós') || txt.includes('hasta luego')) return '¡Hasta luego! Mucho éxito en tus estudios.'
  return RANDOM_ANSWERS[Math.floor(Math.random() * RANDOM_ANSWERS.length)]
} 