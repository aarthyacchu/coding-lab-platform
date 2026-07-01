import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 80)
print("TESTING BACKEND ENDPOINTS")
print("=" * 80)

# Test 1: Chatbot endpoint
print("\n1. Testing POST /api/chatbot/ask")
print("-" * 80)
chatbot_payload = {
    "programTitle": "Hello World",
    "programDesc": "A simple program that prints Hello World",
    "concepts": ["output", "strings"],
    "history": [],
    "question": "What does this program do?"
}
try:
    response = requests.post(f"{BASE_URL}/chatbot/ask", json=chatbot_payload)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Raw Response: {response.text[:500]}")
    if response.ok:
        print(f"JSON Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Explainer/generate endpoint
print("\n\n2. Testing POST /api/explainer/generate")
print("-" * 80)
explainer_payload = {
    "programTitle": "Hello World",
    "programDesc": "Print a greeting message to the screen",
    "concepts": ["output", "strings"]
}
try:
    response = requests.post(f"{BASE_URL}/explainer/generate", json=explainer_payload)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Raw Response: {response.text[:500]}")
    if response.ok:
        print(f"JSON Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: Explainer/flowchart endpoint
print("\n\n3. Testing POST /api/explainer/flowchart")
print("-" * 80)
flowchart_payload = {
    "programTitle": "Hello World",
    "programDesc": "Print a greeting message to the screen",
    "concepts": ["output", "strings"],
    "starterCode": "print('Hello, World!')"
}
try:
    response = requests.post(f"{BASE_URL}/explainer/flowchart", json=flowchart_payload)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Raw Response: {response.text[:500]}")
    if response.ok:
        print(f"JSON Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 80)
