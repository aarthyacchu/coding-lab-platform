# Algorithm Tab Redesign - Compact Pseudocode Style

## Summary
Transformed the "Algorithm" tab from verbose title+paragraph cards to a compact numbered pseudocode-style list.

---

## BEFORE (Verbose Card Layout)

### Backend Output:
```json
{
  "stepNumber": 1,
  "title": "Start the program",
  "narration": "The program begins by starting up and getting ready to run. This is the first step where everything is initialized.",
  "visualHint": "input"
}
```

### Frontend Rendering:
```
┌─────────────────────────────────────────────────┐
│  [1]  Start the program                         │
│                                                  │
│  The program begins by starting up and getting  │
│  ready to run. This is the first step where     │
│  everything is initialized.                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  [2]  Define the greeting message               │
│                                                  │
│  A greeting message is defined, which will be   │
│  printed out to the screen later. This message  │
│  is a sequence of characters.                   │
└─────────────────────────────────────────────────┘
```

**Problems:**
- Takes up too much vertical space
- Verbose narration makes it hard to scan
- Doesn't look like pseudocode/algorithm
- Separate cards break the flow

---

## AFTER (Compact Pseudocode List)

### Backend Output:
```json
{
  "stepNumber": 4,
  "title": "If remainder is 0 → Even",
  "narration": "If there's no remainder, the number is even",
  "visualHint": "condition",
  "isBranch": false
},
{
  "stepNumber": 5,
  "title": "Else → Odd",
  "narration": "Otherwise, the number is odd",
  "visualHint": "condition",
  "isBranch": true
}
```

### Frontend Rendering:
```
┌────────────────────────────────────────────┐
│  [1] Start                                 │
│  [2] Get user input                        │
│  [3] Calculate remainder                   │
│  [4] If remainder is 0 → Even              │
│      ↳ Else → Odd                          │
│  [6] Display result                        │
│  [7] Stop                                  │
└────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Compact - all steps visible at once
- ✅ Easy to scan - one line per step
- ✅ Looks like pseudocode/algorithm
- ✅ Branch steps (Else) properly indented
- ✅ Maintained staggered fade-in animation
- ✅ Kept narration field for future voice features

---

## Technical Changes

### Backend (backend/routes/explainer.py)

#### 1. Updated Pydantic Model
```python
class ExplainerStep(BaseModel):
    stepNumber:  int
    title:       str       # single compact line (under 12 words)
    narration:   str       # kept for optional voice narration
    visualHint:  str       # 'input' | 'loop' | 'condition' | 'compute' | 'output'
    isBranch:    bool = False  # True for Else-branches (indented in UI)
```

#### 2. Rewrote System Prompt
- Changed from "verbose walkthrough" to "COMPACT PSEUDOCODE-STYLE"
- Title field: single line under 12 words (the main display)
- Narration field: kept for optional voice features
- Added conditional formatting rules:
  - If-steps: "If <condition> → <outcome>"
  - Else-steps: "Else → <outcome>" with `isBranch: true`
- Included complete worked example for "even/odd" program

### Frontend (frontend/src/pages/student/UnderstandLogic.jsx)

#### Changed Algorithm Tab Rendering
```jsx
// BEFORE: Verbose cards with title + paragraph
<div className='flex items-start gap-3'>
  <div className='badge'>{step.stepNumber}</div>
  <div className='flex-1'>
    <h3>{step.title}</h3>
    <p className='text-muted'>{step.narration}</p>
  </div>
</div>

// AFTER: Compact pseudocode list
<div className={`flex items-center gap-3 py-2 ${step.isBranch ? 'ml-10' : ''}`}>
  {step.isBranch ? (
    <span className='text-muted'>↳</span>
  ) : (
    <div className='badge-28px'>{step.stepNumber}</div>
  )}
  <p className='monospace'>{step.title}</p>
</div>
```

**Key styling changes:**
- Wrapped entire list in a bordered box with subtle background
- Reduced vertical spacing from `space-y-4` to `py-2` per row
- Branch steps indented with `ml-10` and show "↳" instead of number
- Single line display using only `step.title`
- Monospace/clean font for pseudocode feel
- Kept 28px teal number badges
- Maintained staggered fade-in animation

---

## Test Results

### Example 1: Hello World
```
1. Start
2. Define greeting message
3. Prepare output
4. Print greeting message
5. Stop program
6. End execution
7. Display completion
```

### Example 2: Check Even or Odd
```
1. Start
2. Get user input
3. Calculate remainder
4. If remainder is 0 → Even
    ↳ Else → Odd
6. Display result
7. Stop
```

---

## Verification Steps

1. ✅ Backend server auto-reloaded with new system prompt
2. ✅ API endpoint returns compact step titles (under 12 words)
3. ✅ Branch steps properly marked with `isBranch: true`
4. ✅ Frontend renders as compact numbered list
5. ✅ Else-branches show "↳" and are indented

## Next Steps for Testing

1. Open your frontend at `http://localhost:5173`
2. Navigate to any program and click "Crack the Logic"
3. View the "Algorithm" tab (tab #4 in the step navigation)
4. Verify the compact pseudocode format matches the reference output above

The narration field is still generated and available for future features like voice narration in LogicExplainer.jsx, but it's no longer displayed in the Algorithm tab.
