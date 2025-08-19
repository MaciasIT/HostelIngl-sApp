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

