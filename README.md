# 🚀 LLM-WebApp para Modelos de Gemini AI personalizados

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E44AD?style=for-the-badge&logo=google&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)

Una interfaz web dinámica e intuitiva para interactuar con los potentes modelos de IA de Google Gemini. Chatea, personaliza parámetros y obtén respuestas contextualizadas basadas en el contenido de tus propios archivos PDF, todo directamente desde tu navegador.



## ✨ Características Principales

-   **🚀 Selección de Modelos de Vanguardia:** Elige entre las versiones más recientes de Gemini: `gemini-2.5-pro`, `gemini-2.5-flash` y `gemini-2.5-flash-lite`.
-   **⚙️ Control Total sobre los Parámetros:** Ajusta con precisión la `temperatura`, `top-p`, `top-k` y el máximo de `tokens` para moldear la creatividad y exactitud de la IA.
-   **📄 Chat con tus Documentos (PDF):** Carga un archivo PDF y la IA lo usará como base de conocimiento para responder tus preguntas de forma contextualizada.
-   **💬 Interfaz de Chat Moderna:** Una experiencia de usuario limpia, responsiva y agradable para mantener conversaciones fluidas.
-   **👁 Renderizado de Markdown:** Las respuestas de la IA se muestran con formato Markdown, permitiendo una fácil lectura de listas, código, tablas y más.
-   **⚡ Arquitectura 100% Client-Side:** Toda la lógica se ejecuta en tu navegador. No se necesita un backend, lo que garantiza privacidad y rapidez.

## 🛠️ Tecnologías Utilizadas

-   **Python:** Para realizar pruebas de llamada de API y ajustes de parámetros de los modelos.
-   **HTML5:** Para la estructura semántica del contenido.
-   **CSS3:** Para el diseño y la apariencia visual.
-   **JavaScript (Vanilla):** Para toda la lógica interactiva y la comunicación con la API.
-   **Google AI JavaScript SDK:** Para la integración directa con los modelos de Gemini.
-   **Marked.js:** Una librería ligera para renderizar Markdown en el cliente.
-   **pdf.js:** Para extraer el texto de los archivos PDF directamente en el navegador.
-   **Docker:** Para la contenedorización de la aplicación.
-   **Heroku:** Para el despliegue de la aplicación en la nube.

## 🏁 Cómo Empezar

Para ejecutar este proyecto en tu máquina local, sigue estos sencillos pasos.

### Requisitos Previos

Asegúrate de tener:
1.  Un navegador web moderno (Chrome, Firefox, Edge).
2.  Tu propia **Clave API de Google Gemini**. Puedes obtener una en [Google AI Studio](https://aistudio.google.com/app/apikey).

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git repo clone facuberon/LLM-WebApp
    ```
2.  **Navega al directorio del proyecto:**
    ```bash
    cd LLM-WebApp
    ```
3.  **Abre el archivo `index.html` en tu navegador.**
    ¡Y eso es todo! La aplicación está lista para usarse.

## 📖 Guía de Uso

1.  🔑 **Ingresa tu Clave API:** Pega tu clave API de Gemini en el campo correspondiente.
2.  🤖 **Elige un Modelo:** Selecciona el modelo de IA que desees utilizar en el menú desplegable.
3.  📄 **Sube un PDF (Opcional):** Haz clic en "Elegir Archivo" para seleccionar un PDF. La IA usará su contenido como contexto.
4.  🎛️ **Ajusta los Parámetros:** Modifica los deslizadores de `temperatura`, `top-p`, etc., según tus necesidades.
5.  ▶️ **Inicia la Conversación:** Presiona el botón "Iniciar Chat".
6.  ⌨️ **Envía Mensajes:** Escribe tu pregunta en el campo de texto y presiona `Enter` o el botón "Enviar".
7.  🔄 **Reinicia el Chat:** Si quieres empezar de nuevo, haz clic en "Reiniciar Chat" para volver a la pantalla de configuración.

## 🐳 Dockerización y Deploy

Esta aplicación ha sido dockerizada para facilitar su despliegue y ejecución en cualquier entorno compatible con Docker.

### Ejecución con Docker

1.  **Construir la imagen de Docker:**
    ```bash
    docker build -t llm-webapp .
    ```
2.  **Ejecutar el contenedor:**
    ```bash
    docker run -d -p 8080:80 llm-webapp
    ```
    La aplicación estará disponible en `http://localhost:8080`.

### Despliegue en Heroku

La aplicación está lista para ser desplegada en Heroku utilizando el stack de contenedores de Heroku. Con el `Dockerfile` y el `Procfile` configurados, puedes desplegar la aplicación siguiendo la [guía de Heroku para contenedores](https://devcenter.heroku.com/articles/container-registry-and-runtime).

## 💡 Próximas Mejoras

Este proyecto está en constante evolución. Algunas ideas para el futuro incluyen:
-   [ ] Historial de conversaciones persistente (usando `localStorage`).
-   [ ] Soporte para más formatos de archivo ( `.txt`, `.md`, `.docx`).
-   [ ] Opción para exportar la conversación.
-   [ ] Mejoras en la interfaz de usuario y animaciones.
