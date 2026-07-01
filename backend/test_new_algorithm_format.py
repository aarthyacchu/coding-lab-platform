import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 80)
print("TESTING NEW COMPACT ALGORITHM FORMAT")
print("=" * 80)

# Test with "Hello World" program
print("\n1. Testing 'Hello World' program")
print("-" * 80)
payload = {
    "programTitle": "Hello World",
    "programDesc": "Print a greeting message to the screen",
    "concepts": ["output", "strings"]
}

try:
    response = requests.post(f"{BASE_URL}/explainer/generate", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print(f"\nGenerated {len(data['steps'])} steps:\n")
        for step in data['steps']:
            indent = "    " if step.get('isBranch', False) else ""
            branch_marker = "↳ " if step.get('isBranch', False) else f"{step['stepNumber']}. "
            print(f"{indent}{branch_marker}{step['title']}")
            # Show narration in gray for reference
            print(f"{indent}   (narration: {step['narration'][:60]}...)")
        
        print("\n" + "=" * 80)
        print("FULL JSON RESPONSE:")
        print(json.dumps(data, indent=2))
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")

# Test with "Check Even or Odd" program
print("\n\n2. Testing 'Check Even or Odd' program")
print("-" * 80)
payload2 = {
    "programTitle": "Check Even or Odd",
    "programDesc": "Determine if a given number is even or odd",
    "concepts": ["conditionals", "modulo", "input"]
}

try:
    response = requests.post(f"{BASE_URL}/explainer/generate", json=payload2)
    print(f"Status Code: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print(f"\nGenerated {len(data['steps'])} steps:\n")
        for step in data['steps']:
            indent = "    " if step.get('isBranch', False) else ""
            branch_marker = "↳ " if step.get('isBranch', False) else f"{step['stepNumber']}. "
            print(f"{indent}{branch_marker}{step['title']}")
        
        print("\n" + "=" * 80)
        print("FULL JSON RESPONSE:")
        print(json.dumps(data, indent=2))
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 80)
