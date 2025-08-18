# Inglés para Hostelería

Esta es una aplicación web para aprender inglés enfocado en el sector de la hostelería. Incluye funcionalidades como:
- Visualización de frases en español e inglés.
- Modos de estudio (Flashcards, Quiz, Examen, Estudio programado).
- Funcionalidad de audio para escuchar las frases.
- Gestión de favoritos.
- Métricas de estudio.
- Soporte para temas claro/oscuro y densidad de interfaz.

## Estructura del Proyecto

El proyecto sigue una estructura modular para mejorar la legibilidad y el mantenimiento:

- `src/`: Contiene el código fuente de la aplicación.
    - `App.jsx`: Componente principal que orquesta la aplicación y gestiona el estado global.
    - `components/`: Contiene componentes reutilizables de la interfaz de usuario (e.g., `TopBar`, `AudioBar`, `Flashcards`).
    - `hooks/`: Contiene hooks personalizados para encapsular lógica con estado (e.g., `useAudioPlus`, `useThemeDensity`).
    - `utils/`: Contiene funciones de utilidad y constantes (e.g., `helpers.js`).
    - `hostelenglish_dataset_normalized.json`: Datos de las frases.
    - `conversations.json`: Datos de conversaciones.
    - `index.css`: Estilos globales.
    - `main.jsx`: Punto de entrada de la aplicación.
- `public/`: Contiene activos estáticos.

## Refactorización a Componentes

Se ha realizado una refactorización significativa del archivo `App.jsx` para dividirlo en componentes más pequeños y especializados. Esto mejora:
- **Legibilidad**: El código es más fácil de entender al estar dividido en bloques lógicos.
- **Mantenimiento**: Los cambios y las correcciones de errores son más sencillos de implementar al afectar a componentes específicos.
- **Reutilización**: Los componentes pueden ser reutilizados en diferentes partes de la aplicación o en futuros proyectos.

## Cómo Ejecutar la Aplicación

Para ejecutar la aplicación localmente, sigue los siguientes pasos:

1.  **Clona el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd app
    ```
2.  **Instala las dependencias**:
    ```bash
    npm install
    ```
3.  **Inicia el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run lint`: Ejecuta ESLint para verificar el código.
- `npm run preview`: Previsualiza la compilación de producción.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.