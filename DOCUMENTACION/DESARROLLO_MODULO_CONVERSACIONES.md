# Desarrollo del Módulo de Conversaciones

Este documento detalla los pasos técnicos y las decisiones tomadas durante la implementación del nuevo módulo de "Conversaciones" en la aplicación.

## 1. Creación de Componentes Base

Se han creado dos nuevos componentes de React para formar la estructura del módulo:

-   `src/components/Conversations.jsx`: Este componente renderiza la lista de todas las conversaciones disponibles. Muestra el título y el escenario de cada una, permitiendo al usuario seleccionar una para ver el detalle.

-   `src/components/Conversation.jsx`: Este componente muestra el diálogo completo de una conversación seleccionada. Incluye la lógica inicial para ocultar/mostrar las traducciones y los botones para reproducir el audio de cada línea.

## 2. Integración en la Aplicación Principal

Se han realizado los siguientes cambios para integrar el nuevo módulo en la aplicación:

-   **`App.jsx`**: Se ha modificado el componente principal para:
    -   Importar los nuevos componentes `Conversations` y `Conversation`.
    -   Cargar los datos de `conversations_extended_v4.json` en el estado de la aplicación.
    -   Añadir un estado `selectedConversation` para gestionar la conversación seleccionada.
    -   Renderizar condicionalmente el componente `Conversations` o `Conversation` cuando el modo "conversations" está activo.

-   **`Tabs.jsx`**: Se ha añadido una nueva pestaña "Conversaciones" a la barra de navegación principal para que los usuarios puedan acceder al nuevo módulo.

## 3. Funcionalidad de Audio

-   **Reproducción de diálogo completo**: Se ha añadido un botón "Reproducir todo" en la vista de conversación. Al pulsarlo, se utiliza la funcionalidad existente de `useAudioPlus` para reproducir secuencialmente todas las líneas de diálogo de la conversación, alternando entre español e inglés según la configuración del modo de audio.

## 4. Modo Role-Playing

-   **Selección de Rol**: Se ha añadido un selector en la vista de conversación que permite al usuario elegir un rol (participante) de la conversación.
-   **Ocultar líneas**: Cuando se selecciona un rol, las líneas de diálogo de ese participante se ocultan, mostrando en su lugar un botón de "Mostrar línea".
-   **Interacción**: Al pulsar el botón, se revela la línea oculta, permitiendo al usuario practicar su parte de la conversación y luego comprobar su precisión.

## 5. Integración con el Módulo de Estudio

-   **Añadir Frases a Estudio**: Cada línea de diálogo en una conversación ahora tiene un botón "⭐ Añadir a estudio".
-   **Funcionalidad**: Al hacer clic en este botón, la frase (tanto en español como en inglés) se añade a la lista principal de frases de la aplicación. Esto permite que la frase pueda ser utilizada en los otros modos de estudio, como Flashcards, Quiz y, lo más importante, el sistema de repetición espaciada (SRS) del modo "Estudio".

## 6. Visor de Documentación

- **`Documentation.jsx`**: Se ha creado un nuevo componente que funciona como un modal para mostrar la documentación.
- **Carga de Markdown**: El componente carga dinámicamente los archivos `MANUAL_DE_USUARIO.md` y `DOCUMENTACION_TECNICA.md` usando `fetch`.
- **Renderizado de HTML**: Incluye una función simple que convierte el texto Markdown a HTML para una visualización amigable.
- **Integración en UI**: Se ha añadido un botón "Ayuda" en la `TopBar` que, a través de un nuevo estado `showDocs` en `App.jsx`, controla la visibilidad de este modal.

## 7. Categorización de Conversaciones

Para mejorar la organización y el filtrado, se ha añadido una funcionalidad de categorías al módulo de conversaciones.

-   **Ampliación del Dataset**: Se ha añadido un campo `categoria` a cada objeto de conversación en el fichero `public/conversations_extended_v4.json`. Las categorías definidas son: "Recepción", "Restaurante", "Bar" y "Quejas".

-   **Filtro en la Interfaz**: Se ha añadido un nuevo componente de filtro en la vista de `Conversations`. Este componente es el mismo que se utiliza para filtrar las frases, pero adaptado para usar las categorías de las conversaciones.

-   **Lógica de Filtrado**: La lógica de filtrado en `App.jsx` se ha actualizado para que el componente `Conversations` muestre solo las conversaciones que coinciden con la categoría seleccionada.