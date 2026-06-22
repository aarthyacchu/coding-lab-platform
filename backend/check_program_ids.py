#!/usr/bin/env python3
"""Check program IDs in sessions and verify they exist in programs collection"""

import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

# Initialize Firebase
if not firebase_admin._apps:
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'config/firebase_key.json')
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("=" * 80)
print("CHECKING PROGRAM IDs IN SESSIONS")
print("=" * 80)

# Check the test sessions
test_sessions = ['8X4SFRPl9dJLCZ99l7YL', 'mfBalQAuXN1OO8XeKCdf']

for session_id in test_sessions:
    print(f"\n{'=' * 80}")
    print(f"Session: {session_id}")
    print("=" * 80)
    
    session_doc = db.collection('sessions').document(session_id).get()
    if session_doc.exists:
        data = session_doc.to_dict()
        program_id = data.get('programId')
        print(f"programId in session: {program_id}")
        
        # Check if this program exists
        print(f"\nChecking: programs/{program_id}")
        program_doc = db.collection('programs').document(program_id).get()
        
        if program_doc.exists:
            program_data = program_doc.to_dict()
            print(f"✅ Program EXISTS")
            print(f"   Title: {program_data.get('title')}")
            print(f"   Description: {program_data.get('description')}")
        else:
            print(f"❌ Program DOES NOT EXIST in Firestore")
            print(f"   Path checked: programs/{program_id}")
    else:
        print(f"❌ Session does not exist")

print("\n" + "=" * 80)
print("LISTING ALL PROGRAMS IN FIRESTORE")
print("=" * 80)

programs = db.collection('programs').get()
print(f"\nTotal programs: {len(programs)}")

for i, doc in enumerate(programs, 1):
    data = doc.to_dict()
    print(f"\n{i}. Document ID: {doc.id}")
    print(f"   Title: {data.get('title')}")
    print(f"   Active: {data.get('active')}")

print("\n" + "=" * 80)
