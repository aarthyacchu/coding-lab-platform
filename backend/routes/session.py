from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RunCodeRequest(BaseModel):
    code: str
    language: str

class SubmitSessionRequest(BaseModel):
    sessionId: str
    studentId: str
    programId: str

@router.post("/session/run")
def run_code(req: RunCodeRequest):
    return {
        "stdout": "Code runner not yet implemented - Day 2",
        "stderr": "",
        "exitCode": 0
    }

@router.post("/session/submit")
def submit_session(req: SubmitSessionRequest):
    return {
        "status": "received",
        "message": "Pipeline connects in Day 5"
    }