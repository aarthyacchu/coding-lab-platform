#!/usr/bin/env python3
"""Test DICE fix with needs_attention session"""

import requests
import json
import time

SESSION_ID = "mfBalQAuXN1OO8XeKCdf"
BASE_URL = "http://127.0.0.1:8000/api"

print("=" * 80)
print("TESTING DICE FIX - NEEDS_ATTENTION SESSION")
print("=" * 80)

print(f"\n📋 Session ID: {SESSION_ID}")
print(f"Expected: needs_attention tier → DICE should generate counterfactuals")

payload = {
    "sessionId": SESSION_ID,
    "studentId": "test_student_002_poor",
    "programId": "test_program_002"
}

print(f"\n📤 Submitting session...")

try:
    response = requests.post(
        f"{BASE_URL}/session/submit",
        json=payload,
        timeout=30
    )
    
    print(f"\n✅ Response Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n⏳ Waiting 10 seconds for pipeline to complete...")
        time.sleep(10)
        
        print("\n🔍 Check backend terminal for:")
        print("   - [Pipeline] Running ML analysis...")
        print("   - DICE counterfactual generation (should NOT fail)")
        print("   - [Pipeline] Complete for session: ...")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")

print("\n" + "=" * 80)
