# Unibuddy

Unibuddy es un chatbot universitario simulado, orientado a estudiantes de Medicina. Implementado con React + Vite y Tailwind CSS 4, ofrece una experiencia moderna, accesible y profesional.

## Características principales
- Marca visual: tonos azules, verdes pastel y grises neutros, logo SVG, tipografía amigable
- Chat con IA simulada (respuestas por palabras clave y aleatorias)
- Respuestas rápidas tipo FAQ
- Modo oscuro/claro con toggle
- Accesibilidad: roles ARIA, navegación por teclado, contraste adecuado
- Código modular y limpio

## Estructura de carpetas
```
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── Header.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── MessageBubble.jsx
│   │   └── QuickReplies.jsx
│   ├── logic/
│   │   └── bot.js
│   ├── index.css
│   └── main.jsx
├── public/
│   └── ...
├── vite.config.js
├── package.json
└── README.md
```

## Cómo correr localmente
1. Instala dependencias:
   ```sh
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```
3. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Diseño visual (descripción)
- **Header:** Logo SVG (globo de chat con birrete), nombre "Unibuddy", toggle de modo oscuro.
- **Ventana de chat:** Mensajes del usuario alineados a la derecha (azul), del bot a la izquierda (verde pastel), burbujas redondeadas.
- **Respuestas rápidas:** Botones FAQ bajo los mensajes.
- **Campo de texto:** Input accesible, botón de enviar con icono.
- **Indicador:** "El bot está escribiendo..." cuando responde.
- **Modo oscuro:** Fondo gris oscuro, burbujas adaptadas.

---

> Proyecto de ejemplo para estudiantes, sin backend real. ¡Personalízalo para tu universidad!
