from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Program(BaseModel):
    title: str
    description: str
    language: str
    difficulty: str
    concepts: List[str] = []
    hintLimit: int = 3
    active: bool = True

@router.get("/programs")
def get_programs():
    return {
        "programs": [],
        "message": "Connect to Firestore in Day 2"
    }