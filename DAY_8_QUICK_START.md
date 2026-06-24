# Day 8 Quick Start Guide

## Starting the Application

### 1. Start Backend
```cmd
cd backend
python -m uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### 2. Start Frontend (in a new terminal)
```cmd
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Testing Day 8 Features

### Step 1: Upload a Program as Teacher

1. **Log in as teacher** (teacher1@lab.com / password)
2. Click **"Upload program"** button on dashboard
3. Fill in program details:
   - **Title**: "Sum Two Numbers"
   - **Description**: "Write a program that reads two numbers and prints their sum"
   - **Subject**: "Python Basics"
   - **Difficulty**: "easy"
   - **Concepts**: "input, arithmetic"
   - **Starter Code**: (optional)
   ```python
   # Read two numbers and print their sum
   ```
   - **Hint Limit**: 3
   
4. **Select Target Class**:
   - Department: Computer Science
   - Year: 2
   - Section: A
   - (Results in classId: `CS-2-A`)

5. **Add Test Cases**:
   - **Test Case 1**:
     - Label: "Basic case"
     - Input: `5\n3`
     - Expected Output: `8`
   
   - Click "Add test case"
   - **Test Case 2**:
     - Label: "Negative numbers"
     - Input: `-5\n-3`
     - Expected Output: `-8`

6. Click **"Publish program"**

### Step 2: View Programs as Student

1. **Log out** and log in as student (student1@lab.com / password)
   - Make sure student1 has `classId: "CS-2-A"` in Firestore
2. Go to **"Browse Programs"**
3. You should see:
   - Programs grouped by subject ("Python Basics")
   - "Sum Two Numbers" program
   - Badge showing "2 test cases"

### Step 3: Test the Program

1. **Click on the program** to start session
2. **Enter fullscreen**
3. **Write code**:
   ```python
   a = int(input())
   b = int(input())
   print(a + b)
   ```
4. Click **"Run"** to see regular output
5. Click **"Check (2)"** to run test cases
6. You should see:
   - "Test cases: 2 / 2 passed" (if code is correct)
   - Green checkmarks for passed tests
   - Or red X's with expected vs actual output for failures

### Step 4: Test Failing Code

1. **Modify the code** to produce wrong output:
   ```python
   a = int(input())
   b = int(input())
   print(a - b)  # Wrong: subtracting instead of adding
   ```
2. Click **"Check (2)"**
3. You should see:
   - "Test cases: 0 / 2 passed"
   - Red background on failed tests
   - Expected: `8`, Got: `2`
   - Expected: `-8`, Got: `-2`

## Firestore Index Setup

When you first query programs filtered by classId, Firestore will show an error in the browser console with a link.

**Click the link** to auto-create the composite index for:
- Collection: `programs`
- Fields: `active` (Ascending), `classId` (Ascending)

Or create it manually in Firebase Console → Firestore → Indexes.

## Verifying Student classId

Make sure your test students have the `classId` field:

1. Go to Firebase Console → Firestore
2. Open `users` collection
3. Find `student1@lab.com`
4. Check/add field: `classId: "CS-2-A"`

If students were created before Day 7, re-run seed script or manually add classId.

## Common Issues

### Program doesn't appear for student
- **Check**: Student's `classId` exactly matches program's `classId` (case-sensitive)
- **Check**: Program has `active: true`
- **Check**: Firestore composite index is created

### Test cases always fail
- **Check**: Expected output exactly matches (including whitespace)
- **Tip**: The comparison uses `.strip()` on both sides
- **Check**: Code exits with code 0 (no errors)

### "Check" button doesn't appear
- **Check**: Program has `testCases` array with at least one test case
- **Check**: Test case has non-empty `expectedOutput`

## What's New in Day 8

✅ Teachers can upload programs with:
- Subject classification
- Target class selection
- Multiple test cases with input/output

✅ Students see only programs for their class
- Programs grouped by subject
- Test case count displayed

✅ Test case validation:
- "Check" button runs all test cases
- Pass/fail indicator per test
- Expected vs actual output for failures
- Visual feedback (green/red)

✅ All existing features still work:
- Code execution (Run)
- Hint system
- Quiz generation
- Proctoring with violations
- ML pipeline and reports

## Next: Day 9

Day 9 will add:
- AI logic explainer for student code
- Program-specific chatbot for help
- Uses existing Groq integration from Day 4
