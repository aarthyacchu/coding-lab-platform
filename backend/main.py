from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import session

load_dotenv()

from routes import programs, session, hints, quiz

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

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CodeLab API running"}