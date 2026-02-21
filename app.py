from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_session import Session
from google import genai
from google.genai import types
import base64
import os
import html
from dotenv import load_dotenv

# Inicialización de la app Flask
app = Flask(__name__)
app.secret_key = os.urandom(24)  # clave secreta para firmar la cookie de sesión

# Sesiones del lado del servidor (filesystem) para evitar el límite de 4 KB de las cookies
# El PDF en base64 puede pesar varios MB, así que no puede ir en una cookie.
app.config["SESSION_TYPE"]           = "filesystem"
app.config["SESSION_FILE_DIR"]       = os.path.join(os.path.dirname(__file__), ".flask_sessions")
app.config["SESSION_FILE_THRESHOLD"] = 100   # máximo de archivos de sesión guardados
app.config["SESSION_PERMANENT"]      = False
Session(app)  # inicializa Flask-Session

# Carga de variables de entorno
load_dotenv()


# ── Funciones auxiliares ─────────────────────────────────────────────────────

def get_client(api_key: str) -> genai.Client:
    """Crea y devuelve un cliente de la nueva SDK google-genai."""
    return genai.Client(api_key=api_key)


def pdf_to_base64(pdf_file) -> str:
    """Lee un archivo PDF subido y lo codifica en base64 (igual que en el notebook)."""
    return base64.b64encode(pdf_file.read()).decode("utf-8")


def build_history_parts(history: list) -> list:
    """
    Convierte el historial serializado (lista de dicts) al formato de
    types.Content que espera la nueva SDK para client.chats.create().
    """
    contents = []
    for item in history:
        parts = []
        for p in item["parts"]:
            if isinstance(p, str):
                parts.append(types.Part.from_text(text=p))
            elif isinstance(p, dict) and p.get("type") == "document":
                # parte de tipo documento (PDF en base64)
                parts.append(
                    types.Part.from_bytes(
                        data=base64.b64decode(p["data"]),
                        mime_type=p["mime_type"],
                    )
                )
        contents.append(types.Content(role=item["role"], parts=parts))
    return contents


# ── Rutas ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    session.setdefault("messages", [])       # mensajes para la UI {"role", "content"}
    session.setdefault("gemini_history", []) # historial serializable {"role", "parts"}
    session.setdefault("settings", {})       # configuración del modelo y generación
    return render_template(
        "index.html",
        messages=session.get("messages", []),
        settings=session.get("settings") or None,
        env_key=bool(os.getenv("API_KEY")),
    )


@app.route("/send", methods=["POST"])
def send_message():
    prompt = request.form.get("prompt", "").strip()
    if not prompt:
        return redirect(url_for("index"))

    # ── En el primer mensaje: lee y guarda la configuración del formulario ──
    if not session.get("settings"):
        api_key = os.getenv("API_KEY") or request.form.get("api_key", "")
        session["settings"] = {
            "api_key":     api_key,
            "model":       request.form.get("model", "gemini-3-flash-preview"),
            "temperature": float(request.form.get("temperature", 0.7)),
            "top_p":       float(request.form.get("top_p", 0.95)),
            "top_k":       int(request.form.get("top_k", 40)),
            "max_tokens":  int(request.form.get("max_tokens", 8192)),
        }

        # Procesa el PDF opcional en el primer mensaje (base64, igual que en el notebook)
        pdf_file = request.files.get("pdf")
        if pdf_file and pdf_file.filename.endswith(".pdf"):
            try:
                base64_pdf = pdf_to_base64(pdf_file)
                # Guardamos el PDF como parte serializable en el historial inicial
                session["gemini_history"] = [
                    {
                        "role": "user",
                        "parts": [
                            {"type": "text",     "text": "Aquí te adjunto un documento PDF para analizar."},
                            {"type": "document", "data": base64_pdf, "mime_type": "application/pdf"},
                        ],
                    },
                    {
                        "role": "model",
                        "parts": [{"type": "text", "text": "Perfecto, recibí el PDF. ¿Qué querés saber sobre él?"}],
                    },
                ]
            except Exception as e:
                flash(f"Error al leer el PDF: {e}", "error")

    settings = session["settings"]

    if not settings.get("api_key"):
        flash("Por favor ingresá una API Key de Google válida.", "error")
        return redirect(url_for("index"))

    # ── Configuración de generación ──────────────────────────────────────────
    config = types.GenerateContentConfig(
        temperature=settings["temperature"],
        top_p=settings["top_p"],
        top_k=settings["top_k"],
        max_output_tokens=settings["max_tokens"],
    )

    # ── Reconstruye el chat desde el historial y envía el mensaje ───────────
    try:
        client = get_client(settings["api_key"])

        # Convierte el historial serializado al formato types.Content
        history_contents = build_history_parts(session.get("gemini_history", []))

        # Crea la sesión de chat con el historial previo
        chat = client.chats.create(
            model=settings["model"],
            config=config,
            history=history_contents,
        )

        response = chat.send_message(prompt)
        reply = response.text

    except Exception as e:
        flash(f"Error al generar la respuesta: {e}", "error")
        return redirect(url_for("index"))

    # ── Persiste el historial actualizado en formato serializable ────────────
    # La nueva SDK no expone chat.history como atributo público;
    # simplemente añadimos los turnos nuevos al historial que ya tenemos en sesión.
    current_history = session.get("gemini_history", [])
    current_history.append({"role": "user",  "parts": [{"type": "text", "text": prompt}]})
    current_history.append({"role": "model", "parts": [{"type": "text", "text": reply}]})
    session["gemini_history"] = current_history

    session.setdefault("messages", [])
    session["messages"].append({"role": "user",      "content": html.escape(prompt)})
    session["messages"].append({"role": "assistant", "content": reply})  # sin escapar: marked.js renderiza el markdown
    session.modified = True  # indica a Flask que el dict de sesión fue modificado

    return redirect(url_for("index"))


@app.route("/reset")
def reset_chat():
    session.pop("messages",       None)
    session.pop("gemini_history", None)
    session.pop("settings",       None)
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)