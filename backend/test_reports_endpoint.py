#!/usr/bin/env python3
"""Test the reports/sessions/recent endpoint"""

import requests
import json

response = requests.get('http://localhost:8000/api/reports/sessions/recent')

print("=" * 80)
print("GET /api/reports/sessions/recent")
print("=" * 80)
print(f"\nStatus Code: {response.status_code}")
print(f"\nResponse JSON (formatted):")
print("=" * 80)

data = response.json()
print(f"\nTop-level structure: {list(data.keys())}")
print(f"Number of sessions: {len(data.get('sessions', []))}")

print("\n" + "=" * 80)
print("Sample Session Objects (first 3):")
print("=" * 80)

for i, session in enumerate(data.get('sessions', [])[:3], 1):
    print(f"\nSession {i}:")
    print(json.dumps(session, indent=2))

print("\n" + "=" * 80)
print("Field Verification for All Sessions:")
print("=" * 80)

required_fields = ['sessionId', 'studentId', 'programId', 'status', 
                   'quizScore', 'hintsUsed', 'flagged']

all_sessions = data.get('sessions', [])
if all_sessions:
    first_session = all_sessions[0]
    print("\nRequired fields present:")
    for field in required_fields:
        present = field in first_session
        print(f"  {'✅' if present else '❌'} {field}: {present}")
    
    print("\nBonus fields present:")
    bonus_fields = ['performanceTier', 'startedAt']
    for field in bonus_fields:
        present = field in first_session
        print(f"  {'✅' if present else '❌'} {field}: {present}")

print("\n" + "=" * 80)
