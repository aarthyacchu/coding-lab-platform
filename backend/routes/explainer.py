# backend/routes/explainer.py
import os, json, re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from groq import Groq

router = APIRouter()
client = Groq(api_key=os.environ.get('GROQ_API_KEY'))


class ExplainerRequest(BaseModel):
    programTitle: str
    programDesc:  str
    concepts:     list[str]

class ExplainerStep(BaseModel):
    stepNumber:  int
    title:       str       # short label, e.g. 'Initialize base cases'
    narration:   str       # what gets spoken aloud -- plain spoken English
    visualHint:  str       # one of: 'input' | 'loop' | 'condition' | 'compute' | 'output'

class ExplainerResponse(BaseModel):
    steps: List[ExplainerStep]


EXPLAINER_SYSTEM_PROMPT = """
You are a programming tutor creating a step-by-step LOGIC walkthrough
for a college student, before they write any code.

STRICT RULES:
1. NEVER include actual code or syntax of any language.
2. Explain ALGORITHM LOGIC ONLY -- what happens conceptually, in order.
3. Produce between 4 and 7 steps. Not more, not fewer.
4. Each narration line should sound natural when spoken aloud --
   short sentences, no symbols, no code-like notation.
5. visualHint must be exactly one of: input, loop, condition, compute, output
   -- pick whichever best matches what that step represents conceptually.
6. Return ONLY valid JSON, no markdown fences, no commentary.

JSON format:
{
  "steps": [
    {
      "stepNumber": 1,
      "title": "short label",
      "narration": "one or two spoken sentences",
      "visualHint": "input"
    }
  ]
}
"""


def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    cleaned = re.sub(r'```json|```', '', text).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start, end = cleaned.find('{'), cleaned.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(cleaned[start:end])
        raise ValueError('Could not extract JSON from explainer response')


@router.post('/explainer/generate', response_model=ExplainerResponse)
def generate_explainer(req: ExplainerRequest):
    """
    Called when the student clicks 'Understand the logic' before coding.
    Produces a structured, code-free walkthrough of the algorithm.
    """
    user_message = f"""
Program: {req.programTitle}
Task: {req.programDesc}
Concepts: {', '.join(req.concepts)}

Create a step-by-step LOGIC walkthrough (no code) for a student
who has not started coding yet.
"""
    try:
        completion = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': EXPLAINER_SYSTEM_PROMPT},
                {'role': 'user',   'content': user_message},
            ],
            max_tokens=900,
            temperature=0.4,
        )
        data = extract_json(completion.choices[0].message.content)
        steps = data.get('steps', [])
        if not steps:
            raise ValueError('Empty steps list returned')
        return ExplainerResponse(steps=[ExplainerStep(**s) for s in steps])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Explainer generation failed: {str(e)}')
