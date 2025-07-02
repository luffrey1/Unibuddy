import Avatar from './Avatar'
import Tooltip from './Tooltip'

// Muestra un mensaje en el chat, diferenciando usuario y bot
export default function MessageBubble({ from, text, ts, animate, fontSize }) {
  const isUser = from === 'user'
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? 'justify-end flex-row-reverse' : 'justify-start'} w-full`}
      aria-live="polite"
      role="listitem"
    >
      <Avatar type={from} />
      <div className="flex flex-col items-start max-w-[75%]">
        <div
          className={`px-4 py-2 rounded-2xl shadow text-sm whitespace-pre-line relative
            ${isUser
              ? 'bg-primary text-white rounded-br-md animate-bubble-in-right'
              : 'bg-white/80 dark:bg-secondary/30 text-gray-900 dark:text-gray-100 rounded-bl-md animate-bubble-in-left'}
            ${animate ? 'motion-safe:animate-fade-in' : ''}
          `}
          tabIndex={0}
          aria-label={isUser ? 'Mensaje de usuario' : 'Mensaje del bot'}
          style={fontSize ? { fontSize: fontSize } : {}}
        >
          {text}
        </div>
        {ts && (
          <Tooltip text={new Date(ts).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}>
            <span className="text-xs text-timestamp mt-1 ml-2 select-none" aria-label="Hora del mensaje">
              {new Date(ts).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  )
} 