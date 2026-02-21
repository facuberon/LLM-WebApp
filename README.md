# 🤖 LLM-WebApp — Chat con Gemini AI

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E44AD?style=for-the-badge&logo=google&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)

Interfaz de chat web construida con **Flask** para interactuar con los modelos de Google Gemini. Permite ajustar parámetros de generación, subir archivos PDF como contexto y ver las respuestas renderizadas en Markdown.

---

## ✨ Características

- **🤖 Modelos de última generación:** `gemini-3-flash-preview` y `gemini-3-pro-preview`.
- **⚙️ Control de parámetros:** Ajustá `temperatura`, `top-p`, `top-k` y `max tokens` antes de iniciar el chat.
- **📄 Chat sobre PDFs:** Subí un archivo PDF en el primer mensaje; Gemini lo recibirá en formato nativo (base64 + mime_type) y podrá responder preguntas sobre su contenido.
- **👁️ Renderizado Markdown:** Las respuestas del modelo se muestran con formato completo: listas, bloques de código, tablas, headings, etc.
- **💾 Sesiones en servidor:** La sesión se almacena en el filesystem del servidor (Flask-Session), no en cookies, evitando el límite de 4 KB y permitiendo manejar PDFs grandes.
- **� Reset de conversación:** Botón para reiniciar el chat y cambiar de modelo o PDF.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Python 3.11+ · Flask 3 · Flask-Session |
| IA | Google Gemini (SDK `google-genai`) |
| Frontend | HTML5 · CSS3 · JavaScript Vanilla |
| Markdown | [Marked.js](https://marked.js.org/) (CDN) |
| Servidor prod. | Gunicorn |
| Contenedor | Docker · Heroku |

---

## 🏁 Ejecución Local

### Requisitos previos

- Python 3.11+
- Una [API Key de Google AI Studio](https://aistudio.google.com/app/apikey)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/facuberon/LLM-WebApp.git
cd LLM-WebApp

# 2. Instalar dependencias
pip install -r requirements.txt


# 3. Iniciar la app
python app.py
```

Abrí **http://localhost:5000** en tu navegador.

> Si no configurás un archivo `.env`, podés ingresar la API Key directamente en el panel lateral de la app al iniciar el primer chat.

---

## 📖 Guía de Uso

1. 🔑 **API Key:** Si no la configuraste en `.env`, pegala en el campo del sidebar.
2. 🤖 **Modelo:** Elegí entre `gemini-3-flash-preview` (más rápido) o `gemini-3-pro-preview` (más capaz).
3. 📄 **PDF (opcional):** Subí un archivo PDF antes del primer mensaje. Gemini lo recibirá como documento nativo.
4. 🎛️ **Parámetros:** Ajustá temperatura, top-p, top-k y max tokens según necesites. Se bloquean una vez iniciada la conversación.
5. ⌨️ **Chat:** Escribí tu mensaje y presioná `Enter` (o `Shift+Enter` para nueva línea).
6. 🔄 **Resetear:** Hacé clic en "↺ Reiniciar chat" para empezar una nueva conversación con configuración diferente.

---

## 🐳 Docker

```bash
# Construir la imagen
docker build -t llm-webapp .

# Ejecutar el contenedor (pasando la API Key como variable de entorno)
docker run -d -p 5000:5000 -e API_KEY=tu_api_key llm-webapp
```

La app estará en `http://localhost:5000`.

---

## ☁️ Deploy en Heroku

```bash
heroku container:login
heroku create nombre-app
heroku config:set API_KEY=tu_api_key -a nombre-app
heroku container:push web -a nombre-app
heroku container:release web -a nombre-app
```

---

## 📂 Estructura del Proyecto

```
📦 LLM-WebApp
 ┣ 📜 app.py              # Aplicación Flask (rutas, lógica, integración Gemini)
 ┣ 📂 templates/
 ┃ ┗ 📜 index.html        # Interfaz de chat (HTML + CSS + JS + Marked.js)
 ┣ 📂 .flask_sessions/    # Archivos de sesión del servidor (generado automáticamente, en .gitignore)
 ┣ � model.ipynb         # Notebook de pruebas de la API de Gemini
 ┣ 📜 Dockerfile          # Imagen Docker con Gunicorn
 ┣ 📜 Procfile            # Comando de arranque para Heroku
 ┣ 📜 requirements.txt    # Dependencias de Python
 ┗ 📜 README.md
```

---

## 💡 Próximas Mejoras

- [ ] Soporte para más formatos de archivo (`.txt`, `.docx`).
- [ ] Opción para exportar la conversación en Markdown o PDF.
- [ ] Historial de conversaciones múltiples (multi-sesión).
- [ ] Syntax highlighting en bloques de código.
- [ ] Más opciones de configuración de modelos.

---

Hecho con ❤️ y Python.
