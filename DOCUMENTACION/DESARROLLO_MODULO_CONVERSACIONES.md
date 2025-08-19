# Desarrollo del Módulo de Conversaciones

Este documento detalla los pasos técnicos y las decisiones tomadas durante la implementación del nuevo módulo de "Conversaciones" en la aplicación.

## 1. Creación de Componentes Base

Se han creado dos nuevos componentes de React para formar la estructura del módulo:

-   `src/components/Conversations.jsx`: Este componente renderiza la lista de todas las conversaciones disponibles. Muestra el título y el escenario de cada una, permitiendo al usuario seleccionar una para ver el detalle.

-   `src/components/Conversation.jsx`: Este componente muestra el diálogo completo de una conversación seleccionada. Incluye la lógica inicial para ocultar/mostrar las traducciones y los botones para reproducir el audio de cada línea.

