# Documentación Técnica: App de Inglés para Hostelería

## 1. Visión General del Proyecto

Esta es una aplicación de página única (SPA) construida con React y Vite. Utiliza Tailwind CSS para el estilizado y no requiere un backend, funcionando completamente en el lado del cliente. El estado y el progreso del usuario se persisten en el `localStorage` del navegador.

## 2. Configuración del Entorno de Desarrollo

Para levantar el proyecto en un entorno local, sigue estos pasos:

1.  **Clonar el repositorio** (o tener los archivos del proyecto).
2.  **Instalar dependencias**: Abre una terminal en la raíz del proyecto y ejecuta:
    ```bash
    npm install
    ```
3.  **Iniciar el servidor de desarrollo**: Una vez instaladas las dependencias, ejecuta:
    ```bash
    npm run dev
    ```
4.  Abre la URL local que se muestra en la terminal (normalmente `http://localhost:5173`).

## 3. Estructura del Proyecto

```
/
├── .gitignore
├── DIARIO_DE_DESARROLLO.md
├── eslint.config.js
├── GEMINI.md
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── DOCUMENTACION/
│   │   ├── DESARROLLO_MODULO_CONVERSACIONES.md
│   │   ├── DOCUMENTACION_TECNICA.md
│   │   ├── MANUAL_DE_USUARIO.md
│   │   ├── PLAN_DE_MEJORAS.md
│   │   └── pdfs/
│   ├── conversations_extended_v4.json
│   ├── hostelenglish_dataset_clean.json
│   └── vite.svg
├── png/
├── README.md
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js
```

## 4. Arquitectura y Flujo de Datos

La aplicación reside en un único componente principal, `App.jsx`, que gestiona todo el estado y la lógica.

### 4.1. Gestión del Estado

El estado se maneja con hooks de React (`useState`, `useMemo`, `useEffect`):

- `raw`: Almacena el set de frases completo. Se carga dinámicamente desde `public/hostelenglish_dataset_clean.json`.
- `conversations`: Almacena el set de conversaciones. Se carga dinámicamente desde `public/conversations_extended_v4.json`.
- `category`, `query`, `page`, `perPage`: Gestionan el estado de los filtros y la paginación para las frases.
- `conversationCategory`: Gestiona el estado del filtro de categoría para las conversaciones.
- `mode`: Controla qué vista o modo de estudio está activo (`browse`, `flash`, `quiz`, etc.).
- `favs`, `srs`, `metrics`: Almacenan los datos del usuario (favoritos, progreso de estudio y estadísticas). Se inicializan y se persisten en `localStorage`.
- `theme`, `density`: Gestionan el estado de la UI (tema oscuro/claro y densidad).

### 4.2. Carga de Datos

Al iniciarse, la aplicación carga los datos de los ficheros JSON (`hostelenglish_dataset_clean.json` y `conversations_extended_v4.json`) de forma asíncrona desde la carpeta `public`. Esto asegura que la aplicación siempre utilice la versión más actualizada de los datos sin necesidad de reconstruir el proyecto.

### 4.3. Lógica de Estudio (SRS)

La función `reviewSM2` implementa una versión simplificada del algoritmo SM-2 de repetición espaciada. Recibe una tarjeta y una calificación de calidad (1-5) y calcula la próxima fecha de revisión (`due`), el factor de facilidad (`ease`) y el intervalo.

## 5. Componentes Principales

La UI se descompone en los siguientes componentes de React:

- `TopBar`: La barra de navegación superior.
- `Tabs`: La barra de pestañas para seleccionar el modo.
- `Filters`: Los controles de filtrado por categoría y búsqueda.
- `AudioBar`: Los controles para la reproducción de audio (voces, velocidad).
- `Browse` y `PhraseRow`: La vista de tabla para explorar frases.
- `Conversations` y `Conversation`: El módulo para explorar diálogos interactivos.
- `Flashcards`: El modo de tarjetas de estudio.
- `Quiz`: El modo de test de opción múltiple.
- `Exam`: El modo de examen configurable.
- `Study`: El modo de estudio con SRS.
- `Dashboard`: El panel de estadísticas del usuario.

## 6. Módulo de Conversaciones

El módulo de conversaciones se carga desde `public/conversations_extended_v4.json` y permite a los usuarios explorar diálogos interactivos. Ahora incluye un filtro por categorías para facilitar la búsqueda.

### 6.1. Estructura de Datos de Conversaciones

El fichero `conversations_extended_v4.json` contiene un array de objetos, donde cada objeto representa una conversación y tiene la siguiente estructura:

- **id**: Un identificador único para la conversación (ej. "conv1").
- **title**: El título de la conversación.
- **scenario**: Una breve descripción del contexto de la conversación.
- **categoria**: La categoría a la que pertenece la conversación (ej. "Recepción", "Restaurante", "Quejas").
- **participants**: Un array con los nombres de los participantes en el diálogo.
- **dialogue**: Un array de objetos, donde cada objeto es una línea del diálogo con los siguientes campos:
  - **speaker**: El nombre del participante que habla.
  - **es**: El texto de la línea en español.
  - **en**: El texto de la línea en inglés.

## 7. Posibles Mejoras a Futuro

- **Refactorización a Componentes**: La mejora más importante sería dividir `App.jsx` en archivos de componentes separados para mejorar la legibilidad y el mantenimiento.
- **Backend y Cuentas de Usuario**: Para un progreso persistente entre dispositivos, se podría añadir un backend (ej. Firebase, Supabase) para gestionar usuarios y almacenar sus datos.
- **Frameworks de UI**: Considerar el uso de librerías de componentes como `shadcn/ui` o `Headless UI` para construir interfaces más robustas y accesibles.
- **Testing**: Implementar un framework de testing como Vitest o Jest con React Testing Library para añadir pruebas unitarias y de integración.