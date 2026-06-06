from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HintRequest(BaseModel):
    programId: str
    userCode: str

@router.post("/hints/ask")
def ask_hint(req: HintRequest):
    return {
        "hint": "Grok API connects here in Day 4.",
        "hintsRemaining": 3
    }