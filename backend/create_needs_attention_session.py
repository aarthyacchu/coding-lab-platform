#!/usr/bin/env python3
"""Create a session that should be classified as needs_attention to test DICE"""

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

# Create a session with poor performance (should be needs_attention)
session_data = {
    'studentId': 'test_student_002_poor',
    'programId': 'test_program_002',
    'startedAt': datetime.utcnow().isoformat(),
    'status': 'pending',
    'finalCode': '''
def broken_function(n):
    # This has many errors
    x = [1, 2, 3
    for i in range(n)
        print(x[i+10])  # Index error
    return y  # Name error
''',
    'errors': [
        {'message': 'IndexError: list index out of range', 'timestamp': '2024-01-01T10:00:00'},
        {'message': 'IndexError: list index out of range', 'timestamp': '2024-01-01T10:01:00'},
        {'message': 'SyntaxError: invalid syntax', 'timestamp': '2024-01-01T10:02:00'},
        {'message': 'SyntaxError: expected colon', 'timestamp': '2024-01-01T10:03:00'},
        {'message': 'NameError: name y is not defined', 'timestamp': '2024-01-01T10:04:00'},
        {'message': 'IndexError: list index out of range', 'timestamp': '2024-01-01T10:05:00'},
        {'message': 'SyntaxError: invalid syntax', 'timestamp': '2024-01-01T10:06:00'},
        {'message': 'NameError: name z is not defined', 'timestamp': '2024-01-01T10:07:00'},
        {'message': 'IndexError: array index out of bounds', 'timestamp': '2024-01-01T10:08:00'},
        {'message': 'SyntaxError: unexpected token', 'timestamp': '2024-01-01T10:09:00'},
        {'message': 'TypeError: cannot convert int to string', 'timestamp': '2024-01-01T10:10:00'},
        {'message': 'IndexError: list index out of range', 'timestamp': '2024-01-01T10:11:00'},
        {'message': 'SyntaxError: invalid syntax', 'timestamp': '2024-01-01T10:12:00'},
        {'message': 'NameError: undefined variable', 'timestamp': '2024-01-01T10:13:00'},
        {'message': 'IndexError: out of bounds', 'timestamp': '2024-01-01T10:14:00'},
        {'message': 'SyntaxError: missing parenthesis', 'timestamp': '2024-01-01T10:15:00'},
        {'message': 'TypeError: wrong type', 'timestamp': '2024-01-01T10:16:00'},
        {'message': 'IndexError: list index out of range', 'timestamp': '2024-01-01T10:17:00'},
        {'message': 'SyntaxError: invalid syntax', 'timestamp': '2024-01-01T10:18:00'},
        {'message': 'NameError: name not defined', 'timestamp': '2024-01-01T10:19:00'},
        {'message': 'IndexError: out of range', 'timestamp': '2024-01-01T10:20:00'},
        {'message': 'SyntaxError: parse error', 'timestamp': '2024-01-01T10:21:00'},
        {'message': 'TypeError: type mismatch', 'timestamp': '2024-01-01T10:22:00'},
        {'message': 'IndexError: bounds error', 'timestamp': '2024-01-01T10:23:00'},
        {'message': 'SyntaxError: invalid token', 'timestamp': '2024-01-01T10:24:00'},
    ],
    'violations': [
        {'type': 'copy_paste', 'severity': 'high', 'timestamp': '2024-01-01T10:05:00'},
        {'type': 'tab_switch', 'severity': 'high', 'timestamp': '2024-01-01T10:10:00'},
        {'type': 'suspicious_activity', 'severity': 'high', 'timestamp': '2024-01-01T10:15:00'},
    ],
    'quizScore': 0.25,  # Very low quiz score
    'quizAnswers': [
        {'concept_tag': 'loops', 'correct': False},
        {'concept_tag': 'recursion', 'correct': False},
        {'concept_tag': 'arrays', 'correct': False},
        {'concept_tag': 'pointers', 'correct': True},
    ],
    'hintsUsed': 3,  # Used all hints
    'runAttempts': 25,  # Many attempts
    'timeTakenMs': 5400000,  # 90 minutes
}

# Add to Firestore
doc_ref = db.collection('sessions').add(session_data)
session_id = doc_ref[1].id

print(f"✅ Created needs_attention session: {session_id}")
print(f"Session characteristics (should trigger needs_attention):")
print(f"  - Quiz Score: {session_data['quizScore']} (LOW)")
print(f"  - Errors: {len(session_data['errors'])} (HIGH)")
print(f"  - Violations: {len(session_data['violations'])} (HIGH)")
print(f"  - Hints Used: {session_data['hintsUsed']} (MAX)")
print(f"  - Run Attempts: {session_data['runAttempts']} (HIGH)")
print(f"\nUse this session ID to test DICE:")
print(f"  {session_id}")
