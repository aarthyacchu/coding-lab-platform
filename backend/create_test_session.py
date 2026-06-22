#!/usr/bin/env python3
"""Create a valid test session in Firestore for pipeline testing"""

import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

load_dotenv()

# Initialize Firebase if not already done
if not firebase_admin._apps:
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'config/firebase_key.json')
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Create a test session with all required fields for ML pipeline
session_data = {
    'studentId': 'test_student_001',
    'programId': 'test_program_001',
    'startedAt': datetime.utcnow().isoformat(),
    'status': 'pending',
    'finalCode': '''
def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(5))
''',
    'errors': [
        {'message': 'IndexError: list index out of range', 'timestamp': '2024-01-01T10:00:00'},
        {'message': 'SyntaxError: invalid syntax', 'timestamp': '2024-01-01T10:01:00'},
        {'message': 'NameError: name x is not defined', 'timestamp': '2024-01-01T10:02:00'},
    ],
    'violations': [
        {'type': 'copy_paste', 'severity': 'medium', 'timestamp': '2024-01-01T10:05:00'}
    ],
    'quizScore': 0.75,
    'quizAnswers': [
        {'concept_tag': 'loops', 'correct': True},
        {'concept_tag': 'recursion', 'correct': True},
        {'concept_tag': 'arrays', 'correct': False},
        {'concept_tag': 'pointers', 'correct': True},
    ],
    'hintsUsed': 2,
    'runAttempts': 8,
    'timeTakenMs': 1800000,  # 30 minutes
}

# Add to Firestore
doc_ref = db.collection('sessions').add(session_data)
session_id = doc_ref[1].id

print(f"✅ Created test session: {session_id}")
print(f"Session data:")
print(f"  - Student ID: {session_data['studentId']}")
print(f"  - Program ID: {session_data['programId']}")
print(f"  - Quiz Score: {session_data['quizScore']}")
print(f"  - Errors: {len(session_data['errors'])}")
print(f"  - Violations: {len(session_data['violations'])}")
print(f"  - Hints Used: {session_data['hintsUsed']}")
print(f"  - Run Attempts: {session_data['runAttempts']}")
print(f"\nUse this session ID to test the pipeline:")
print(f"  {session_id}")
