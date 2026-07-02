# backend/routes/hints.py
# Log2Base2-style tiered hint system (Conceptual → Pseudocode → Partial Solution)

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq

router = APIRouter()

# Groq client — loaded once when server starts
client = Groq(api_key=os.environ.get('GROQ_API_KEY'))

# ── Models ──────────────────────────────────────────────────────

class HintRequest(BaseModel):
    programId:    str
    programTitle: str              # e.g. 'Fibonacci Series'
    programDesc:  str              # full description
    concepts:     list[str]        # e.g. ['loops', 'variables']
    userCode:     str              # student's current code
    hintNumber:   int              # which hint is this (1, 2, or 3)

class HintResponse(BaseModel):
    hint:           str
    hintsRemaining: int
    tierName:       str            # 'Conceptual', 'Pseudocode', or 'Partial Solution'


# ── Tiered hint system prompts ───────────────────────────────────

def get_tier_prompt(hint_number: int) -> dict:
    """
    Returns the system prompt for each hint tier.
    Tier 1: Conceptual guidance
    Tier 2: Pseudocode/logic breakdown
    Tier 3: Partial solution with code hints
    """
    
    tiers = {
        1: {
            'name': 'Conceptual',
            'prompt': """You are a programming tutor providing TIER 1 (Conceptual) hints.

Your role: Guide the student's THINKING without revealing the solution.

STRICT RULES for Tier 1:
- Focus on the HIGH-LEVEL APPROACH and problem-solving strategy
- Ask guiding questions that make the student think
- Explain WHAT needs to be done, not HOW to code it
- NO pseudocode, NO code snippets, NO specific syntax
- Keep it under 100 words
- Be encouraging and Socratic

Example Tier 1 hint:
"Think about how you would manually calculate this step-by-step. What information do you need to start? What pattern or relationship exists between the numbers? Consider breaking the problem into smaller pieces - maybe start with just two numbers first, then expand that logic."
"""
        },
        2: {
            'name': 'Pseudocode',
            'prompt': """You are a programming tutor providing TIER 2 (Pseudocode) hints.

Your role: Provide LOGICAL STRUCTURE without complete code.

STRICT RULES for Tier 2:
- Show the LOGIC FLOW in plain language or pseudocode
- Break down the algorithm step-by-step
- Use phrases like "for each item" or "while condition is true"
- NO actual Python/Java syntax
- NO complete solutions
- Keep it under 120 words
- Format as numbered steps

Example Tier 2 hint:
"Here's the logical flow:
1. Start with two initial values (first and second number)
2. For each position you need to fill:
   - Calculate the next value by adding the two previous values
   - Update your 'previous values' to move forward
3. Keep track of which position you're at
4. Stop when you've generated enough terms
Think about how to store and update these values as you loop."
"""
        },
        3: {
            'name': 'Partial Solution',
            'prompt': """You are a programming tutor providing TIER 3 (Partial Solution) hints.

Your role: Provide CODE GUIDANCE while leaving key parts for the student.

STRICT RULES for Tier 3:
- Show PARTIAL code snippets (2-4 lines max)
- Use placeholders like "???" or "# your code here" for key logic
- Provide the structure but not the complete solution
- Focus on ONE specific part the student is stuck on
- Keep it under 150 words
- Include brief comments explaining the structure

Example Tier 3 hint:
"Here's a structure to get you started:

```python
a, b = 0, 1  # First two Fibonacci numbers
for i in range(???):  # How many terms?
    print(a)
    # Calculate next term using a and b
    next_term = ???
    # Update a and b for next iteration
    a, b = ???, ???
```

Fill in the ??? parts. Think about:
- How many times should the loop run?
- How do you calculate the next Fibonacci number?
- How do you shift the values forward?"
"""
        }
    }
    
    return tiers.get(hint_number, tiers[1])


# ── Main hint endpoint ───────────────────────────────────────────

@router.post('/hints/ask', response_model=HintResponse)
def ask_hint(req: HintRequest):
    """
    Log2Base2-style tiered hints:
    - Tier 1: Conceptual guidance
    - Tier 2: Pseudocode/logic
    - Tier 3: Partial solution
    """
    HINT_LIMIT = 3

    if req.hintNumber > HINT_LIMIT:
        raise HTTPException(
            status_code=400,
            detail='Hint limit reached. No more hints for this session.'
        )

    # Get the appropriate tier prompt
    tier_info = get_tier_prompt(req.hintNumber)
    system_prompt = tier_info['prompt']
    tier_name = tier_info['name']

    # Build the user message with context
    user_message = f"""Program: {req.programTitle}
Task: {req.programDesc}
Concepts involved: {', '.join(req.concepts)}
This is TIER {req.hintNumber} hint ({tier_name}).

Student's current code:
```python
{req.userCode[:1500]}
```

Provide a {tier_name} hint that helps the student progress without solving it for them."""

    try:
        completion = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user',   'content': user_message},
            ],
            max_tokens=250,
            temperature=0.5,   # Balanced creativity
        )

        hint_text = completion.choices[0].message.content.strip()

        return HintResponse(
            hint=hint_text,
            hintsRemaining=HINT_LIMIT - req.hintNumber,
            tierName=tier_name
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f'Groq API error: {str(e)}'
        )