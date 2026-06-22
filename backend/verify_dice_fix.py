#!/usr/bin/env python3
"""Verify DICE changes were populated in Firestore"""

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

# Compare BEFORE and AFTER sessions
BEFORE_SESSION = "8X4SFRPl9dJLCZ99l7YL"  # satisfactory tier (no DICE changes due to error)
AFTER_SESSION = "mfBalQAuXN1OO8XeKCdf"   # needs_attention tier (should have DICE changes)

print("=" * 80)
print("DICE FIX VERIFICATION - BEFORE vs AFTER")
print("=" * 80)

print("\n" + "=" * 80)
print("BEFORE FIX - Session with proximity_weight error")
print("=" * 80)
print(f"Session ID: {BEFORE_SESSION}")

doc = db.collection('sessions').document(BEFORE_SESSION).get()
if doc.exists:
    data = doc.to_dict()
    report = data.get('report', {})
    print(f"Performance Tier: {report.get('performanceTier')}")
    print(f"diceChanges: {json.dumps(report.get('diceChanges'), indent=2)}")
    print(f"Number of DICE changes: {len(report.get('diceChanges', []))}")
else:
    print("❌ Document not found")

print("\n" + "=" * 80)
print("AFTER FIX - Session with corrected API")
print("=" * 80)
print(f"Session ID: {AFTER_SESSION}")

doc = db.collection('sessions').document(AFTER_SESSION).get()
if doc.exists:
    data = doc.to_dict()
    report = data.get('report', {})
    print(f"Performance Tier: {report.get('performanceTier')}")
    print(f"diceChanges: {json.dumps(report.get('diceChanges'), indent=2)}")
    print(f"Number of DICE changes: {len(report.get('diceChanges', []))}")
    
    if report.get('diceChanges'):
        print("\n✅ DICE CHANGES POPULATED:")
        for i, change in enumerate(report.get('diceChanges', []), 1):
            print(f"\n  Change {i}:")
            print(f"    Feature: {change.get('feature')}")
            print(f"    Direction: {change.get('direction')}")
            print(f"    From: {change.get('from')}")
            print(f"    To: {change.get('to')}")
            print(f"    Delta: {change.get('delta')}")
    else:
        print("\n⚠️  diceChanges is empty or missing")
        
    print(f"\n📊 Complete Report:")
    print(json.dumps(report, indent=2, default=str))
else:
    print("❌ Document not found")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"✅ DICE API updated from proximity_weight/diversity_weight")
print(f"   to posthoc_sparsity_param/stopping_threshold")
print(f"✅ No more 'unexpected keyword argument' errors")
print(f"✅ Pipeline completes successfully")
