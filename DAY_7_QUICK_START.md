# Day 7 - Quick Start Guide

## What Was Implemented

✅ **Landing Page** - Public homepage at `/` for logged-out visitors  
✅ **Signup Page** - Self-registration for students and teachers  
✅ **Department & Class Fields** - Students get `classId` (e.g., 'CS-2-A')  
✅ **Dashboard Polish** - Equal-height stat cards on both dashboards  
✅ **Updated Seed Data** - Test users now have department/classId fields  

## How to Test Right Now

### 1. Start the Frontend (if not running)
```bash
cd frontend
npm run dev
```
Visit: http://localhost:5173

### 2. Test Landing Page
1. **Log out** if you're currently logged in
2. Visit http://localhost:5173/
3. You should see the new landing page with:
   - "Learn to code by actually coding" hero
   - 4 feature cards
   - Login and Signup buttons

### 3. Test Student Signup
1. Click **"Sign up"** or **"Get started"**
2. Keep **"student"** role selected
3. Fill in the form:
   - Full name: `Test Student`
   - Email: `newstudent@test.com`
   - Password: `test123`
   - Department: `Computer Science`
   - Roll number: `CS2024999`
   - Year: `2`
   - Section: `A`
4. Click **"Create account"**
5. Should redirect to student dashboard
6. ✅ Check: Dashboard shows your name and "Computer Science • Year 2"

### 4. Test Teacher Signup
1. Log out
2. Visit http://localhost:5173/signup
3. Click **"teacher"** toggle
4. Notice: Roll number, Year, Section fields disappear
5. Fill in:
   - Full name: `Test Teacher`
   - Email: `newteacher@test.com`
   - Password: `test123`
   - Department: `Computer Science`
6. Click **"Create account"**
7. Should redirect to teacher dashboard

### 5. Verify Database (Optional)
1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to Firestore Database
3. Open `users` collection
4. Find your new student user
5. ✅ Check fields exist:
   - `department`: "Computer Science"
   - `year`: 2
   - `section`: "A"
   - `classId`: "CS-2-A" ← **This is the key field for Day 8!**
6. Find your new teacher user
7. ✅ Check: Has `department` but NO `classId`

### 6. Test Navigation Flow
- From `/login` → click "Create an account" → should go to `/signup`
- From `/signup` → click "Log in" → should go to `/login`
- When logged in, visiting `/` → redirects to appropriate dashboard
- When logged out, visiting `/` → shows landing page

### 7. Test Dashboard Layout
1. Log in as any user
2. Open browser DevTools (F12)
3. Toggle device toolbar (mobile view)
4. Resize between mobile and desktop widths
5. ✅ Check: All stat cards maintain equal heights at all sizes

## What Changed vs Day 6

### New Routes
- `/` - Now shows Landing page (was redirect to login)
- `/signup` - New signup form

### Updated Files
| File | What Changed |
|------|--------------|
| `App.jsx` | Added Landing and Signup routes |
| `Login.jsx` | Added "Create an account" link |
| `StudentDashboard.jsx` | Grid layout polish (equal heights) |
| `TeacherDashboard.jsx` | Grid layout polish (equal heights) |
| `seed.py` | Added `classId` to students |

### New Files
- `pages/Landing.jsx` - Marketing homepage
- `pages/Signup.jsx` - Registration form

## Common Questions

**Q: Do I need to update my existing seeded users?**  
A: If you want to test Day 8 features with them, yes. Either:
- Delete them in Firestore Console and run `python seed.py` again
- Manually add `classId` field in Firestore Console
- Just use newly signed-up users for testing

**Q: Will existing login still work?**  
A: Yes! Nothing about authentication changed. You can still log in with:
- `teacher@lab.com` / `teacher123`
- `student1@lab.com` / `student123`

**Q: What is classId used for?**  
A: Day 8 will use it to automatically show students only the programs assigned to their specific class. A program tagged for "CS-2-A" will only appear for students with `classId: "CS-2-A"`.

**Q: Can I change departments or add more?**  
A: Yes! Edit the `DEPARTMENTS` array in `Signup.jsx`. Keep them consistent with what teachers will use in Day 8's program upload.

**Q: Why is the landing page at / and not a separate domain?**  
A: This is a single-page app. The landing page serves as the entry point for new users, and authenticated users automatically bypass it via redirect.

## Next Steps

Once Day 7 testing is complete, you're ready for **Day 8**:
- Teacher program upload with subjects and test cases
- Department/class filtering in program library
- Programs grouped by subject
- Automatic matching via `classId`

## Need Help?

Check for these in browser console (F12):
- Firebase auth errors
- React Router warnings
- Firestore permission errors

If signup fails:
1. Check Firebase Console → Authentication → Sign-in method → Email/Password is enabled
2. Check Firestore → Rules → users collection has write permission for authenticated users
3. Check browser console for specific error codes

---

**Status**: ✅ Day 7 Implementation Complete  
**Breaking Changes**: None - all existing features work as before  
**Ready for Day 8**: Yes - classId field ready for program filtering
