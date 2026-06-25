# Day 9 User Flow Diagram

## 📍 Student Journey - Two Paths

```
┌─────────────────────────────────────────────────────────────────┐
│                      Program Library Page                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Program Card: "Fibonacci Sequence"                     │   │
│  │  Description: Generate first N Fibonacci numbers        │   │
│  │  Difficulty: Medium | 5 test cases | loops, recursion  │   │
│  │                                                          │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐   │   │
│  │  │ 🟣 Understand logic │  │ 🔵 Start coding     │   │   │
│  │  └──────────────────────┘  └──────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                    │                          │
                    │                          │
         ┌──────────┴────────┐        ┌───────┴──────────┐
         │  PATH 1: LEARN    │        │  PATH 2: DIRECT  │
         │  FIRST (NEW)      │        │  (DAY 1-8 FLOW)  │
         └──────────┬────────┘        └───────┬──────────┘
                    │                          │
                    ▼                          │
    ┌───────────────────────────────┐         │
    │  UnderstandLogic Page         │         │
    │                               │         │
    │  ┌─────────────────────────┐ │         │
    │  │  Logic Explainer        │ │         │
    │  │  ─────────────────      │ │         │
    │  │  Step 1: Input data     │ │         │
    │  │  Step 2: Initialize     │ │         │
    │  │  Step 3: Loop & compute │ │         │
    │  │  Step 4: Return result  │ │         │
    │  │                         │ │         │
    │  │  [Play] [Skip] [Mute]  │ │         │
    │  │  🔊 Narration speaks    │ │         │
    │  └─────────────────────────┘ │         │
    │                               │         │
    │  ┌─────────────────────────┐ │         │
    │  │  Program Chatbot        │ │         │
    │  │  ─────────────────      │ │         │
    │  │  💬 Ask questions       │ │         │
    │  │  🤖 AI guides without   │ │         │
    │  │     giving solution     │ │         │
    │  └─────────────────────────┘ │         │
    │                               │         │
    │  [I'm ready - start coding]  │         │
    └───────────────┬───────────────┘         │
                    │                          │
                    └──────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │    Session Page (Day 2-3)    │
                │                              │
                │  • Fullscreen proctored      │
                │  • Code editor               │
                │  • Test case verification    │
                │  • Hint system (Day 4)       │
                │  • Submit session            │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │      Quiz Page (Day 4)       │
                │                              │
                │  • Post-session quiz         │
                │  • 5 questions               │
                │  • Submit answers            │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │   Dashboard (Days 1-6)       │
                │                              │
                │  • View badges               │
                │  • Check streak              │
                │  • See progress              │
                └──────────────────────────────┘
```

---

## 🔄 Flow Comparison: Before vs. After Day 9

### Before Day 9 (Days 1-8)
```
Program Library → Session → Quiz → Dashboard
     (click)        ↓
```

### After Day 9 (Two Paths)
```
Program Library → Choice:
                    │
                    ├─→ "Understand logic" → Explainer + Chatbot → Session → Quiz → Dashboard
                    │
                    └─→ "Start coding" ─────────────────────────→ Session → Quiz → Dashboard
                                                (original Day 1-8 path preserved)
```

---

## 🎯 Logic Explainer - Step Flow

```
┌────────────────────────────────────────────────────────────────┐
│  Logic Explainer Component                                      │
│                                                                 │
│  Student clicks PLAY                                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────┐              │
│  │  Step 1: Read the input values              │              │
│  │  🔵 [input icon]                            │              │
│  │  "First, we need to get how many Fibonacci  │              │
│  │   numbers the user wants to generate."      │              │
│  │  🔊 Browser speaks this aloud               │              │
│  └─────────────────────────────────────────────┘              │
│         │                                                       │
│         │ (auto-advance when narration ends)                   │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────┐              │
│  │  Step 2: Initialize base cases              │              │
│  │  🟢 [compute icon]                          │              │
│  │  "We start with the first two numbers,      │              │
│  │   zero and one, as our foundation."         │              │
│  │  🔊 Browser speaks this aloud               │              │
│  └─────────────────────────────────────────────┘              │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────┐              │
│  │  Step 3: Loop and calculate                 │              │
│  │  🟣 [loop icon]                             │              │
│  │  "For each remaining position, add the      │              │
│  │   previous two numbers to get the next."    │              │
│  │  🔊 Browser speaks this aloud               │              │
│  └─────────────────────────────────────────────┘              │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────┐              │
│  │  Step 4: Return the sequence                │              │
│  │  🟠 [output icon]                           │              │
│  │  "Finally, we return all the numbers we     │              │
│  │   calculated as a complete list."           │              │
│  │  🔊 Browser speaks this aloud               │              │
│  └─────────────────────────────────────────────┘              │
│         │                                                       │
│         ▼                                                       │
│  [Auto-stops at end] or [Student clicks Skip]                 │
│                                                                 │
│  Controls: [◀ Skip Back] [▶️ Play/Pause] [▶ Skip] [🔇 Mute]   │
│  Dots:     ●━━━━  (click any dot to jump)                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 💬 Chatbot - Conversation Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  Program Chatbot Component                                        │
│                                                                   │
│  [Initial State - Empty]                                          │
│  🤖 "Ask anything about the logic -- I'll guide you,             │
│      not solve it for you."                                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Student: "Why do I need a loop?"                      │ ➤   │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🤖 Bot: "A loop is needed because we're generating    │ ◀   │
│  │     multiple Fibonacci numbers. Each number depends    │     │
│  │     on the previous two, so we repeat the calculation  │     │
│  │     for each position in the sequence."                │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Student: "Can I use recursion instead?"               │ ➤   │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🤖 Bot: "Yes! Recursion is another valid approach.    │ ◀   │
│  │     Each function call would calculate one Fibonacci   │     │
│  │     number by calling itself for the two previous      │     │
│  │     numbers. However, think about efficiency..."       │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Student: "Just give me the code"                      │ ➤   │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🤖 Bot: "I can't provide the complete solution,       │ ◀   │
│  │     but I'd be happy to explain the concept of loops   │     │
│  │     or recursion in more detail. What specific part    │     │
│  │     are you struggling with?"                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  [Enter your question...]                              [Send ➤]  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Answer-Blocking Examples

### ✅ ALLOWED - Concept Explanation
```
Student: "What is recursion?"
Bot: "Recursion is when a function calls itself to solve 
      smaller versions of the same problem. Each call handles 
      one piece, and the results combine to solve the whole."
```

### ✅ ALLOWED - Logic Guidance
```
Student: "How do I know when to stop the loop?"
Bot: "Think about what defines 'done' for this task. You're 
      generating N numbers, so when you have N numbers in your 
      result, you're done."
```

### ❌ BLOCKED - Complete Solution
```
Student: "Write the function for me"
Bot: "I can't write the complete solution for you, but I can 
      help you understand the steps needed. What part would 
      you like me to explain?"
```

### ❌ BLOCKED - Direct Code
```
Student: "Show me the loop code"
Bot: "Instead of showing code, let me explain the logic: 
      You need to repeat an action N times, each time adding 
      the last two numbers. Would you like to discuss how 
      loops work in general?"
```

---

## 🎨 Visual Design - Color Scheme

### Logic Explainer Icons
```
🔵 Input     → Blue   (bg-blue-900/40, text-blue-400)
🟣 Loop      → Purple (bg-purple-900/40, text-purple-400)
🟡 Condition → Yellow (bg-yellow-900/40, text-yellow-400)
🟢 Compute   → Green  (bg-green-900/40, text-green-400)
🟠 Output    → Orange (bg-orange-900/40, text-orange-400)
```

### Program Library Buttons
```
🟣 Understand the logic → Purple (bg-purple-50, text-purple-700)
🔵 Start coding         → Blue   (bg-blue-600, text-white)
```

### Chat Messages
```
User message:      Blue background  (bg-blue-600, text-white)
Assistant message: Gray background  (bg-gray-700, text-gray-200)
```

---

## 📱 Responsive Layout

### Desktop (> 768px)
```
┌─────────────────────────────────────────────────┐
│  Navbar                                         │
├─────────────────────────────────────────────────┤
│                                                 │
│    ┌───────────────────────────────────┐       │
│    │  Back to programs         ←       │       │
│    ├───────────────────────────────────┤       │
│    │  Program Title                    │       │
│    │  Description                      │       │
│    ├───────────────────────────────────┤       │
│    │                                   │       │
│    │  Logic Explainer                 │       │
│    │  (visual + controls)             │       │
│    │                                   │       │
│    ├───────────────────────────────────┤       │
│    │                                   │       │
│    │  Program Chatbot                 │       │
│    │  (chat interface)                │       │
│    │                                   │       │
│    ├───────────────────────────────────┤       │
│    │  [I'm ready - start coding]      │       │
│    └───────────────────────────────────┘       │
│                                                 │
└─────────────────────────────────────────────────┘
        Max-width: 672px (max-w-2xl)
```

---

## 🔄 Data Flow

### Explainer Generation
```
Frontend (UnderstandLogic.jsx)
    │
    │ useEffect on mount
    ▼
LogicExplainer Component
    │
    │ calls generateExplainer()
    ▼
api.js
    │
    │ POST /api/explainer/generate
    │ { programTitle, programDesc, concepts }
    ▼
Backend (explainer.py)
    │
    │ Groq API call
    │ System prompt + user message
    ▼
Groq LLM (llama-3.3-70b-versatile)
    │
    │ Generates structured JSON
    ▼
Backend (extract_json)
    │
    │ Parse and validate
    ▼
Response: { steps: [
    { stepNumber, title, narration, visualHint },
    ...
]}
    │
    ▼
Frontend (setSteps)
    │
    │ Renders steps
    │ Plays narration
    ▼
Student sees/hears walkthrough
```

### Chatbot Conversation
```
Student types question
    │
    ▼
ProgramChatbot Component
    │
    │ Add to messages state
    │ calls askChatbot()
    ▼
api.js
    │
    │ POST /api/chatbot/ask
    │ { programTitle, programDesc, concepts, history, question }
    ▼
Backend (chatbot.py)
    │
    │ Build messages array with system prompt
    │ Include last 10 history turns
    │ Add new question
    ▼
Groq LLM (llama-3.3-70b-versatile)
    │
    │ Generate response with guardrails
    ▼
Backend validates response
    │
    ▼
Response: { answer: "..." }
    │
    ▼
Frontend (add to messages)
    │
    ▼
Student sees response
```

---

**This visual guide helps understand the complete Day 9 user flow!** 🎨
