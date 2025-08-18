# Plan de Mejoras y Nuevas Funcionalidades

Este documento detalla una serie de mejoras y nuevas funcionalidades que podrían ser implementadas en la aplicación "Inglés para Hostelería". Están categorizadas para facilitar su seguimiento y priorización.

## I. Mejoras en la Experiencia de Usuario (UX) y la Interfaz de Usuario (UI)

1.  **Personalización de Temas Avanzada (Implementado):**
    *   **Descripción:** Permitir al usuario elegir entre una gama más amplia de temas visuales (no solo claro/oscuro) o incluso personalizar esquemas de colores específicos.
    *   **Beneficio:** Mayor adaptabilidad a las preferencias del usuario, mejorando la comodidad visual y la experiencia general.

2.  **Notificaciones Mejoradas (Implementado):**
    *   **Descripción:** Implementar un sistema de notificaciones más robusto y configurable para recordatorios de estudio, logros alcanzados, nuevas funcionalidades, etc. Esto iría más allá de los mensajes "toast" actuales.
    *   **Beneficio:** Mantener al usuario comprometido y al tanto de su progreso y de las novedades de la aplicación.

3.  **Feedback Visual en Flashcards/Quiz/Estudio:**
    *   **Descripción:** Añadir animaciones sutiles o feedback visual más claro (ej. cambios de color, iconos de acierto/error) al responder correctamente o incorrectamente en los modos de estudio.
    *   **Beneficio:** Proporcionar una retroalimentación instantánea y más atractiva, reforzando el aprendizaje y la interacción.

4.  **Modo de Enfoque/Inmersión:**
    *   **Descripción:** Desarrollar una opción que permita al usuario ocultar temporalmente la barra superior, la barra de audio y otros elementos de la interfaz que puedan ser una distracción durante las sesiones intensivas de estudio.
    *   **Beneficio:** Minimizar las distracciones y ayudar al usuario a concentrarse plenamente en el material de estudio.

5.  **Accesibilidad (A11y):**
    *   **Descripción:** Mejorar la accesibilidad general de la aplicación, incluyendo:
        *   Navegación completa mediante teclado.
        *   Soporte optimizado para lectores de pantalla (etiquetas ARIA, semántica HTML).
        *   Asegurar un contraste de colores adecuado para usuarios con deficiencias visuales.
    *   **Beneficio:** Hacer la aplicación usable para un público más amplio, cumpliendo con estándares de inclusión.

## II. Nuevas Funcionalidades de Contenido y Estudio

6.  **Creación y Edición de Frases:**
    *   **Descripción:** Permitir a los usuarios añadir sus propias frases personalizadas (español e inglés) y/o editar las frases existentes en el dataset. Si no se implementa un backend, esta funcionalidad sería solo a nivel de `localStorage`.
    *   **Beneficio:** Mayor flexibilidad y personalización del contenido de estudio, adaptándose a necesidades específicas del usuario.

7.  **Importación/Exportación de Datos Mejorada:**
    *   **Descripción:** Ampliar las opciones de importación y exportación de datos:
        *   Soporte para más formatos de archivo (ej. Anki Deck, TSV).
        *   Una interfaz de usuario que permita al usuario seleccionar qué tipos de datos desea exportar (solo favoritos, solo progreso SRS, todo el dataset, etc.).
    *   **Beneficio:** Facilitar la gestión de los datos del usuario y la interoperabilidad con otras herramientas de estudio.

8.  **Estadísticas Detalladas:**
    *   **Descripción:** Ampliar el dashboard actual con gráficos y métricas más avanzadas sobre el progreso del estudio, como:
        *   Progreso de estudio por categoría.
        *   Historial de aciertos y errores a lo largo del tiempo.
        *   Tiempo de estudio por sesión/día.
    *   **Beneficio:** Proporcionar al usuario una visión más profunda y motivadora de su aprendizaje.

9.  **Modo de Dictado/Escritura:**
    *   **Descripción:** Introducir un nuevo modo de estudio donde el usuario deba escribir la traducción de una frase o dictarla (usando reconocimiento de voz del navegador) para practicar la producción activa del idioma.
    *   **Beneficio:** Mejorar las habilidades de escritura y habla, y reforzar la memorización activa.

10. **Ejercicios de Relleno de Huecos:**
    *   **Descripción:** Crear un tipo de ejercicio donde se presenten frases con una o varias palabras omitidas, y el usuario deba rellenar los huecos con la palabra correcta.
    *   **Beneficio:** Practicar el vocabulario en contexto y la gramática de forma interactiva.

11. **Listas de Vocabulario:**
    *   **Descripción:** Una sección dedicada a la gestión y estudio de listas de vocabulario clave, quizás con definiciones, sinónimos, antónimos y ejemplos de uso.
    *   **Beneficio:** Ofrecer una forma estructurada de aprender y revisar vocabulario específico del sector.

12. **Pronunciación Interactiva:**
    *   **Descripción:** Integrar una API de reconocimiento de voz (ej. Web Speech API) que permita al usuario practicar su pronunciación y recibir feedback instantáneo sobre la corrección de su habla.
    *   **Beneficio:** Ayudar al usuario a mejorar su acento y fluidez en el idioma.

## III. Mejoras Técnicas (sin backend)

13. **Optimización de Rendimiento:**
    *   **Descripción:** Realizar una auditoría de rendimiento y aplicar optimizaciones en el código para asegurar que la aplicación sea rápida y fluida, especialmente al manejar grandes volúmenes de frases o en dispositivos menos potentes.
    *   **Beneficio:** Mejorar la experiencia del usuario al reducir tiempos de carga y mejorar la reactividad de la interfaz.

14. **Pruebas Unitarias/Integración:**
    *   **Descripción:** Ampliar la cobertura de pruebas automatizadas (unitarias y de integración) para las funciones de utilidad, hooks personalizados y componentes clave.
    *   **Beneficio:** Asegurar la estabilidad de la aplicación, prevenir la introducción de errores (regresiones) y facilitar futuras modificaciones.

15. **Internacionalización (i18n):**
    *   **Descripción:** Preparar la aplicación para soportar múltiples idiomas de interfaz de usuario, separando los textos de la UI del código. Aunque el contenido principal sea inglés/español, la interfaz podría estar en otros idiomas.
    *   **Beneficio:** Abrir la aplicación a usuarios que prefieran interactuar con la interfaz en su idioma nativo, incluso si están aprendiendo inglés/español.

16. **Frameworks de UI:**
    *   **Descripción:** Considerar el uso de librerías de componentes como shadcn/ui o Headless UI para construir interfaces más robustas, accesibles y con un desarrollo más eficiente. Estas librerías proporcionan componentes pre-construidos y accesibles que se integran bien con Tailwind CSS.
    *   **Beneficio:** Acelerar el desarrollo de la UI, asegurar la accesibilidad de los componentes y mantener una alta calidad visual y funcional.
