# Quick Test Checklist - Badges/Streak Fix

## Pre-Test Setup
- [ ] Backend running on port 8000 (`python -m uvicorn main:app --reload --port 8000`)
- [ ] Frontend running on port 5173 (`npm run dev`)
- [ ] Logged in as a student account
- [ ] Backend terminal visible to watch logs

---

## Test: Complete One Program End-to-End

### Phase 1: Start Session
- [ ] Navigate to "Browse Programs"
- [ ] Select any program (suggest: "Hello World")
- [ ] Click "Start Session"
- [ ] Enter fullscreen mode

### Phase 2: Write & Submit Code
- [ ] Write or paste working code
- [ ] Click "Run" and verify output
- [ ] Click "Submit" button
- [ ] Click "Confirm Submit" button

### Phase 3: Complete Quiz
- [ ] Quiz page loads with questions
- [ ] Answer all questions (any answers work for testing)
- [ ] Click "Submit Quiz"
- [ ] See results page with score

### Phase 4: Check Browser Console
Open DevTools → Console tab, verify:
- [ ] ✅ Message: `"Pipeline triggered successfully"`
- [ ] ❌ No errors about missing `studentId` or `programId`

### Phase 5: Check Backend Terminal
Look for these log lines in order:
```
- [ ] [Submit] Received submission for session: <sessionId>
- [ ] [Submit] Session <sessionId> marked as submitted in Firestore
- [ ] [Submit] Pipeline queued for session: <sessionId>
- [ ] [Pipeline] Starting for session: <sessionId>
- [ ] [Pipeline] Running ML analysis...
- [ ] [Pipeline] Updating student streak...
- [ ] [Pipeline] Checking and awarding badges...
- [ ] [Pipeline] Complete for session: <sessionId>
```

### Phase 6: Check Firestore
Open Firebase Console → Firestore:

**Sessions collection:**
- [ ] Session doc has `status: 'complete'` (not 'submitted')
- [ ] Session doc has `report` field with ML analysis

**Users collection:**
- [ ] User doc `streak` field = 1 (or incremented)
- [ ] User doc `badges` array includes `"first_program"`
- [ ] User doc `lastActivity` timestamp is recent

### Phase 7: Check Dashboard
- [ ] Click "Back to Dashboard" or navigate to `/student/dashboard`
- [ ] **Day Streak** counter shows 1 or more (not 0)
- [ ] **Badges Earned** counter shows 1 or more (not 0)
- [ ] **Sessions Completed** counter shows 1 or more (not 0)
- [ ] Scroll to "Your Badges" section
- [ ] "First Program" badge is colored/unlocked
- [ ] Other badges are grayed out/locked

---

## Success Criteria

✅ **PASS if ALL of these are true:**
1. Backend logs show complete pipeline execution
2. Firestore session status = 'complete'
3. Firestore user streak incremented
4. Firestore user badges array has at least one badge
5. Dashboard shows non-zero values for all three counters
6. Badge grid shows at least one unlocked badge

❌ **FAIL if ANY of these occur:**
1. Browser console shows error about missing studentId/programId
2. Backend shows no pipeline logs
3. Session status stays 'submitted'
4. User streak stays 0
5. User badges array is empty
6. Dashboard still shows all zeros

---

## Common Issues & Quick Fixes

### Issue: "Pipeline triggered successfully" but no backend logs
→ Backend not running or on wrong port
→ Check `http://localhost:8000/api/health` responds

### Issue: Browser error "studentId is undefined"
→ Hard refresh the frontend (Ctrl+Shift+R)
→ Clear cache and reload

### Issue: Backend error 422 validation error
→ Check API payload in Network tab
→ Verify sessionId, studentId, programId all present

### Issue: Pipeline runs but streak stays 0
→ Wait 5-10 seconds for background task to complete
→ Check Firestore directly to see if it updated
→ Hard refresh dashboard

---

## Expected Timeline

| Action | Expected Time | What Happens |
|--------|---------------|--------------|
| Submit Quiz | < 1 second | updateDoc() saves quiz results |
| Trigger Pipeline | < 1 second | Backend receives POST request |
| Pipeline Execution | 5-30 seconds | Background task runs ML, updates streak/badges |
| Dashboard Load | < 2 seconds | Queries Firestore for stats |
| Counter Animation | 0.6 seconds | Animated count-up to real values |

**Total time from quiz submit to seeing updated dashboard: ~10-40 seconds**

---

## Multiple Test Runs

To test streak continuation:
1. Complete first program (streak = 1)
2. **Option A (Real):** Wait until tomorrow, complete another (streak = 2)
3. **Option B (Testing):** Manually edit Firestore user doc, set `lastActivity` to yesterday, then complete another program

To test multiple badges:
- Complete program in < 5 min → `quick_solve`
- Get 100% on quiz → `perfectionist`
- Complete 3 programs on consecutive days → `streak_3`

---

## Debugging Commands

**Check backend health:**
```bash
curl http://localhost:8000/api/health
```

**Check if frontend can reach backend:**
```bash
curl -X POST http://localhost:8000/api/session/submit \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","studentId":"test","programId":"test"}'
```

**Check Firestore from terminal (if you have Firebase CLI):**
```bash
firebase firestore:get sessions/<sessionId>
firebase firestore:get users/<userId>
```

---

## After Testing

If everything passes:
- ✅ Badges now work correctly
- ✅ Streak increments after completing programs
- ✅ Sessions completed counter shows real data
- ✅ Dashboard is fully functional

If anything fails, check `BADGES_STREAK_FIX.md` for detailed troubleshooting.
