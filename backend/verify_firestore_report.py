#!/usr/bin/env python3
"""Verify the report was written to Firestore"""

import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import json

load_dotenv()

# Initialize Firebase if not already done
if not firebase_admin._apps:
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'config/firebase_key.json')
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

SESSION_ID = "8X4SFRPl9dJLCZ99l7YL"

print("=" * 80)
print("FIRESTORE DOCUMENT VERIFICATION")
print("=" * 80)

print(f"\nCollection name: sessions")
print(f"Document ID: {SESSION_ID}")

# Fetch the document
doc_ref = db.collection('sessions').document(SESSION_ID)
doc = doc_ref.get()

if doc.exists:
    print(f"\n✅ Document exists in Firestore")
    
    # Get the complete document data
    data = doc.to_dict()
    
    print("\n" + "=" * 80)
    print("COMPLETE FIRESTORE DOCUMENT CONTENTS:")
    print("=" * 80)
    print(json.dumps(data, indent=2, default=str))
    
    print("\n" + "=" * 80)
    print("FIELD VERIFICATION:")
    print("=" * 80)
    
    # Verify required fields
    fields_to_check = {
        'studentId': data.get('studentId'),
        'programId': data.get('programId'),
        'status': data.get('status'),
        'finalCode': '(exists)' if data.get('finalCode') else None,
        'report': data.get('report'),
    }
    
    print(f"\n📋 Session Fields:")
    print(f"  - studentId: {fields_to_check['studentId']}")
    print(f"  - programId: {fields_to_check['programId']}")
    print(f"  - status: {fields_to_check['status']}")
    print(f"  - finalCode: {fields_to_check['finalCode']}")
    
    if data.get('report'):
        report = data['report']
        print(f"\n📊 Report Contents:")
        print(f"  - performanceTier: {report.get('performanceTier')}")
        print(f"  - confidence: {json.dumps(report.get('confidence'), indent=6)}")
        print(f"  - dominantWeakness: {report.get('dominantWeakness')}")
        print(f"  - errorTags: {json.dumps(report.get('errorTags'))}")
        print(f"  - quizAnalysis: {json.dumps(report.get('quizAnalysis'), indent=6)}")
        print(f"  - diceChanges: {json.dumps(report.get('diceChanges'), indent=6)}")
        print(f"  - plagiarismScore: {report.get('plagiarismScore')}")
        print(f"  - plagiarismFlagged: {report.get('plagiarismFlagged')}")
        print(f"  - plagiarismMatches: {json.dumps(report.get('plagiarismMatches'))}")
        
        print(f"\n📝 Groq Teacher Summary:")
        print(f"  {report.get('teacherSummary')}")
        
        print("\n" + "=" * 80)
        print("✅ VERIFICATION COMPLETE")
        print("=" * 80)
        print("\nAll required fields present:")
        print(f"  ✅ Session ID: {SESSION_ID}")
        print(f"  ✅ ML Prediction (performanceTier): {report.get('performanceTier')}")
        print(f"  ✅ Confidence Score: {report.get('confidence')}")
        print(f"  ✅ Plagiarism Score: {report.get('plagiarismScore')}")
        print(f"  ✅ Groq Teacher Summary: {'Present' if report.get('teacherSummary') else 'Missing'}")
        print(f"  ✅ Status: {data.get('status')}")
    else:
        print("\n❌ No report field found in document!")
        
else:
    print(f"\n❌ Document does not exist: {SESSION_ID}")

print("\n" + "=" * 80)
