import joblib

bundle = joblib.load("ml/ml_bundle.pkl")

print("Model loaded successfully!")
print(bundle.keys())