from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials

# Load environment variables FIRST
load_dotenv()

# Initialize Firebase Admin SDK BEFORE importing routes
if not firebase_admin._apps:
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'config/firebase_key.json')
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

# Now import routes (they can safely use firestore.client())
from routes import programs, session, hints, quiz, reports, explainer, chatbot, explain

app = FastAPI(title="CodeLab API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(programs.router, prefix="/api")
app.include_router(session.router, prefix="/api")
app.include_router(hints.router, prefix="/api")
app.include_router(quiz.router, prefix='/api')
app.include_router(reports.router, prefix="/api")
app.include_router(explainer.router, prefix='/api')
app.include_router(chatbot.router, prefix='/api')
app.include_router(explain.router, prefix='/api')

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CodeLab API running"}