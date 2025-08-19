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
├── DOCUMENTACION/
│   ├── MANUAL_DE_USUARIO.md
│   └── DOCUMENTACION_TECNICA.md
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/              <-- Componentes de la UI
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── conversations_extended_v4.json  <-- Dataset de conversaciones
│   ├── hostelenglish_dataset_normalized.json  <-- El dataset principal
│   ├── App.jsx                                <-- Componente raíz con toda la lógica
│   ├── index.css                              <-- Estilos base de Tailwind
│   └── main.jsx                               <-- Punto de entrada de React
├── .gitignore
├── index.html                                 <-- Plantilla HTML principal
├── package.json
├── postcss.config.js                          <-- Config. de PostCSS para Tailwind
├── tailwind.config.js                         <-- Config. de Tailwind CSS
└── vite.config.js                             <-- Config. del empaquetador Vite
```

## 4. Arquitectura y Flujo de Datos

La aplicación reside en un único componente principal, `App.jsx`, que gestiona todo el estado y la lógica.

### 4.1. Gestión del Estado

El estado se maneja con hooks de React (`useState`, `useMemo`, `useEffect`):

- `raw`: Almacena el set de frases completo después de ser procesado. Se inicializa desde el archivo JSON importado.
- `category`, `query`, `page`, `perPage`: Gestionan el estado de los filtros y la paginación.
- `mode`: Controla qué vista o modo de estudio está activo (`browse`, `flash`, `quiz`, etc.).
- `favs`, `srs`, `metrics`: Almacenan los datos del usuario (favoritos, progreso de estudio y estadísticas). Se inicializan y se persisten en `localStorage`.
- `theme`, `density`: Gestionan el estado de la UI (tema oscuro/claro y densidad).

### 4.2. Procesamiento de Datos

Al iniciarse, la aplicación importa los datos desde `src/hostelenglish_dataset_normalized.json` y realiza un pre-procesamiento para adaptarlos a lo que los componentes esperan:

1.  **Normalización de Nombres**: Mapea los campos `spanish` a `es` y `english` a `en`.
2.  **Extracción de Categorías**: Una rutina de expresiones regulares recorre las frases para detectar títulos de sección (ej. "VII. Dar Direcciones..."), los extrae como categorías y limpia el texto original.
3.  **Asignación de IDs**: Asigna un ID numérico único a cada frase basado en su índice.

### 4.3. Lógica de Estudio (SRS)

La función `reviewSM2` implementa una versión simplificada del algoritmo SM-2 de repetición espaciada. Recibe una tarjeta y una calificación de calidad (1-5) y calcula la próxima fecha de revisión (`due`), el factor de facilidad (`ease`) y el intervalo.

## 5. Componentes Principales

Aunque todo está en un solo archivo, la UI se puede descomponer lógicamente en estos componentes:

- `TopBar`: La barra de navegación superior.
- `Tabs`: La barra de pestañas para seleccionar el modo.
- `Filters`: Los controles de filtrado por categoría y búsqueda.
- `AudioBar`: Los controles para la reproducción de audio (voces, velocidad).
- `Browse` y `PhraseRow`: La vista de tabla para explorar frases.
- `Conversations` y `Conversation`: El nuevo módulo para explorar diálogos interactivos.
- `Flashcards`: El modo de tarjetas de estudio.
- `Quiz`: El modo de test de opción múltiple.
- `Exam`: El modo de examen configurable.
- `Study`: El modo de estudio con SRS.
- `Dashboard`: El panel de estadísticas del usuario.

## 6. Módulo de Conversaciones

El módulo de conversaciones se carga desde `src/conversations_extended_v4.json` y permite a los usuarios explorar diálogos interactivos. La lógica principal reside en `App.jsx`, que gestiona la selección de conversaciones y el estado de la interfaz. Los componentes `Conversations.jsx` y `Conversation.jsx` se encargan de la renderización.

## 7. Posibles Mejoras a Futuro

- **Refactorización a Componentes**: La mejora más importante sería dividir `App.jsx` en archivos de componentes separados para mejorar la legibilidad y el mantenimiento.
- **Backend y Cuentas de Usuario**: Para un progreso persistente entre dispositivos, se podría añadir un backend (ej. Firebase, Supabase) para gestionar usuarios y almacenar sus datos.
- **Frameworks de UI**: Considerar el uso de librerías de componentes como `shadcn/ui` o `Headless UI` para construir interfaces más robustas y accesibles.
- **Testing**: Implementar un framework de testing como Vitest o Jest con React Testing Library para añadir pruebas unitarias y de integración.
