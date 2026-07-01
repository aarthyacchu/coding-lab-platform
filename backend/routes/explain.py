# backend/routes/explain.py
# Logic explanation endpoints for "Understand the logic" page

import os
import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from typing import List

router = APIRouter()
groq_client = Groq(api_key=os.environ.get('GROQ_API_KEY'))


# ── Request models ──────────────────────────────────────────────

class ExplainLogicRequest(BaseModel):
    programTitle: str
    programDesc: str
    concepts: List[str]
    starterCode: str


class AskAboutProgramRequest(BaseModel):
    programTitle: str
    programDesc: str
    concepts: List[str]
    question: str


# ── Helper: Extract JSON from markdown fences ───────────────────

def extract_json(text: str) -> dict:
    """
    Extract JSON from Groq response, handling markdown code fences.
    Same pattern as quiz.py.
    """
    text = text.strip()
    
    # Try to find JSON in markdown code fence
    fence_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
    match = re.search(fence_pattern, text, re.DOTALL)
    if match:
        text = match.group(1)
    
    # Clean and parse
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse JSON: {str(e)}")


# ── POST /explain/logic ─────────────────────────────────────────

@router.post('/explain/logic')
def explain_logic(req: ExplainLogicRequest):
    """
    Generate a step-by-step conceptual breakdown of the program's logic.
    Returns real steps specific to the program - never generic placeholder text.
    """
    
    system_prompt = """You are an expert programming tutor helping students understand program logic conceptually.

Your task: Break down the program's approach into clear, sequential conceptual steps that guide understanding of HOW to think about solving this problem.

STRICT RULES:
- Provide 4-7 conceptual steps that explain the logical approach/algorithm
- Each step must be specific to THIS program's logic, never generic
- Focus on the "thinking process" and "logical flow", not implementation details
- NEVER include actual code snippets or complete solutions
- NEVER reveal the full answer - guide understanding of the approach only
- Use clear, student-friendly language
- Make each step build on the previous one logically

Return ONLY valid JSON in this exact format:
{
  "steps": [
    {
      "title": "Brief step title (5-8 words)",
      "explanation": "Clear explanation of this conceptual step (2-3 sentences)"
    }
  ]
}

Example for a Fibonacci program:
{
  "steps": [
    {"title": "Understand the input requirement", "explanation": "The program needs to know how many Fibonacci numbers to generate. This count determines how many terms of the sequence you'll compute."},
    {"title": "Recognize the base cases", "explanation": "The Fibonacci sequence starts with two known values: the first term is 0 and the second term is 1. These form the foundation for generating all subsequent terms."},
    {"title": "Understand the recursive relationship", "explanation": "Each Fibonacci number equals the sum of the two numbers before it. This pattern continues for as many terms as requested."},
    {"title": "Consider the iteration approach", "explanation": "To generate the sequence, you'll need to repeatedly calculate the next term using the previous two terms, keeping track as you go."},
    {"title": "Plan the output format", "explanation": "The program should display the generated Fibonacci numbers in a clear, readable way for the user to understand the sequence."}
  ]
}"""

    user_prompt = f"""Program: {req.programTitle}
Description: {req.programDesc}
Key concepts: {', '.join(req.concepts)}

Starter code context:
{req.starterCode}

Generate conceptual steps to understand this program's logic."""

    try:
        completion = groq_client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            max_tokens=800,
            temperature=0.5,
        )
        
        response_text = completion.choices[0].message.content.strip()
        result = extract_json(response_text)
        
        # Validate structure
        if 'steps' not in result or not isinstance(result['steps'], list):
            raise HTTPException(status_code=500, detail="Invalid response structure from AI")
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation: {str(e)}")


# ── POST /explain/ask ───────────────────────────────────────────

@router.post('/explain/ask')
def ask_about_program(req: AskAboutProgramRequest):
    """
    Answer a student's question about the program's logic/approach.
    Same constraints as hints: guide understanding, never reveal full solution.
    """
    
    system_prompt = """You are a programming tutor helping students understand program logic through guided questioning.

Your role: Answer the student's question about the program's approach/logic in a way that builds understanding without solving it for them.

STRICT RULES:
- Answer questions about concepts, logic flow, and problem-solving approaches
- NEVER provide complete code solutions or reveal the full answer
- If asked "how do I do X", explain the conceptual approach, not the exact code
- If asked for "the code" or "the answer", redirect: "I'm here to help you understand the approach - let me explain the concept..."
- Keep responses focused, clear, and student-friendly (2-4 sentences typically)
- Be specific to THIS program when relevant

Return ONLY valid JSON: {"answer": "your response here"}"""

    user_prompt = f"""Program: {req.programTitle}
Description: {req.programDesc}
Key concepts: {', '.join(req.concepts)}

Student's question: {req.question}

Provide a helpful answer that guides understanding without revealing the full solution."""

    try:
        completion = groq_client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            max_tokens=300,
            temperature=0.6,
        )
        
        response_text = completion.choices[0].message.content.strip()
        result = extract_json(response_text)
        
        # Validate structure
        if 'answer' not in result:
            raise HTTPException(status_code=500, detail="Invalid response structure from AI")
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")
