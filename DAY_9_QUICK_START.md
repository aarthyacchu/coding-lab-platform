# Day 9 Quick Start Guide

## 🚀 Start the Application

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn main:app --reload
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

---

## ✅ Quick Test Flow (5 minutes)

### 1. Access the Logic Explainer
1. Open http://localhost:5173
2. Log in as a student
3. Go to Program Library
4. Click **"Understand the logic"** on any program

### 2. Test the Explainer
- Click **Play** button → Should hear narration
- Narration auto-advances to next step
- Try **Skip Forward/Back** buttons
- Click **step indicator dots** to jump
- Try **Mute** button

### 3. Test the Chatbot
Scroll down to the chatbot and ask:
- "Why does this program need a loop?"
- "What is the main concept here?"
- "Give me the full code" ← Should decline politely

### 4. Test Navigation
- Click **"I'm ready -- start coding"**
- Should navigate to normal Session.jsx
- Go back to library
- Click **"Start coding"** directly
- Confirm this also works (original Day 1-8 flow)

---

## 🎯 What You Should See

### Logic Explainer
- 4-7 steps with visual icons
- Play/Pause controls
- Auto-narration using browser speech
- Smooth step transitions

### Chatbot
- Chat interface below explainer
- Helpful responses that explain concepts
- Refuses to provide complete solutions
- Remembers conversation context

### Program Library
- Each program now has 2 buttons:
  - Purple: "Understand the logic"
  - Blue: "Start coding"

---

## 🐛 If Something Doesn't Work

### No sound on Play
- **Cause:** Browsers block auto-play audio
- **Fix:** Ensure you click Play button manually (not auto-triggered)

### Import errors in backend
- **Cause:** Missing Groq package
- **Fix:** `pip install groq` in backend directory

### "Explainer generation failed"
- **Cause:** Missing/invalid GROQ_API_KEY
- **Fix:** Check `backend/.env` has valid key

### Routes not found (404)
- **Cause:** Backend not restarted after adding routers
- **Fix:** Restart uvicorn server

---

## 📋 Files to Check If Issues

- `backend/main.py` - Should import explainer, chatbot
- `backend/routes/explainer.py` - Should exist
- `backend/routes/chatbot.py` - Should exist
- `frontend/src/App.jsx` - Should have `/student/understand/:programId` route
- `frontend/src/services/api.js` - Should have generateExplainer, askChatbot functions

---

## ✨ That's It!

Day 9 is complete. Both the explainer and chatbot should work seamlessly with your existing Days 1-8 functionality.

**No existing features were broken in this implementation.**
