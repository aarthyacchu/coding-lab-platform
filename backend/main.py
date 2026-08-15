from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json
import firebase_admin
from firebase_admin import credentials

# Load environment variables FIRST
load_dotenv()

# Verify GROQ_API_KEY is loaded (masked for security)
groq_key = os.getenv('GROQ_API_KEY')
if groq_key:
    print(f"[OK] GROQ_API_KEY loaded: {groq_key[:10]}...{groq_key[-4:]}")
else:
    print("[ERROR] GROQ_API_KEY not found in environment")

# Initialize Firebase Admin SDK BEFORE importing routes
if not firebase_admin._apps:
    firebase_json = os.getenv('FIREBASE_KEY_JSON')
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'config/firebase_key.json')
    
    if firebase_json:
        try:
            cred_dict = json.loads(firebase_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("[OK] Firebase Admin initialized from FIREBASE_KEY_JSON env var")
        except Exception as e:
            print(f"[ERROR] Failed to initialize Firebase Admin from FIREBASE_KEY_JSON: {e}")
    elif os.path.exists(firebase_key_path):
        cred = credentials.Certificate(firebase_key_path)
        firebase_admin.initialize_app(cred)
        print(f"[OK] Firebase Admin initialized from file: {firebase_key_path}")
    else:
        print(f"[WARNING] Firebase key file not found at {firebase_key_path} and FIREBASE_KEY_JSON not set.")

# Now import routes (they can safely use firestore.client())
from routes import session, hints, quiz, reports, explainer, chatbot

app = FastAPI(title="CodeLab API", version="1.0.0")

# CORS setup for production deployments
allowed_origins_env = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173')
if allowed_origins_env == '*':
    origins = ['*']
else:
    origins = [origin.strip() for origin in allowed_origins_env.split(',') if origin.strip()]
    if 'http://localhost:5173' not in origins:
        origins.append('http://localhost:5173')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ['*'] else ['*'],
    allow_origin_regex=os.getenv('ALLOWED_ORIGIN_REGEX', r'https://.*\.vercel\.app'),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router, prefix="/api")
app.include_router(hints.router, prefix="/api")
app.include_router(quiz.router, prefix='/api')
app.include_router(reports.router, prefix="/api")
app.include_router(explainer.router, prefix='/api')
app.include_router(chatbot.router, prefix='/api')

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CodeLab API running"}