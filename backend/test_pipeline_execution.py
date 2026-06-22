#!/usr/bin/env python3
"""Test the full Day 5 pipeline with a real session"""

import requests
import json
import time

SESSION_ID = "8X4SFRPl9dJLCZ99l7YL"
BASE_URL = "http://127.0.0.1:8000/api"

print("=" * 70)
print("TESTING DAY 5 PIPELINE EXECUTION")
print("=" * 70)

print(f"\n📋 Session ID: {SESSION_ID}")
print(f"🌐 Endpoint: POST {BASE_URL}/session/submit")

payload = {
    "sessionId": SESSION_ID,
    "studentId": "test_student_001",
    "programId": "test_program_001"
}

print(f"\n📤 Sending request...")
print(f"Payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(
        f"{BASE_URL}/session/submit",
        json=payload,
        timeout=10
    )
    
    print(f"\n✅ Response Status: {response.status_code}")
    print(f"Response Body: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n" + "=" * 70)
        print("✅ SUBMISSION SUCCESSFUL")
        print("=" * 70)
        print("\n🔍 Check backend terminal for pipeline logs:")
        print("   Expected log sequence:")
        print("   1. [Submit] Received submission for session: ...")
        print("   2. [Submit] Session marked as submitted in Firestore")
        print("   3. [Submit] Pipeline queued for session: ...")
        print("   4. [Pipeline] Starting for session: ...")
        print("   5. [Pipeline] Running ML analysis...")
        print("   6. [Pipeline] Running plagiarism check...")
        print("   7. [Pipeline] Generating Groq teacher summary...")
        print("   8. [Pipeline] Writing report to Firestore...")
        print("   9. [Pipeline] Complete for session: ...")
        print("\n⏳ Pipeline runs in background. Check terminal in 5-10 seconds.")
    else:
        print(f"\n❌ FAILED: Status {response.status_code}")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")

print("\n" + "=" * 70)
