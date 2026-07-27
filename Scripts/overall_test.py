# import os
# # import sys

# # # Add project root to path so we can import the backend modules
# # sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# # from backend.app.ml.model import load_model, load_labels, predict_risk
# # from backend.app.ml.vectorizer import load_vectorizer

# # def test(message: str):
# #     print(f"Testing message: \"{message}\"\n")
    
# #     try:
# #         # Load the trained artifacts
# #         vectorizer = load_vectorizer()
# #         model = load_model()
# #     except FileNotFoundError as e:
# #         print(f"❌ Error: {e}")
# #         print("Please ensure you have run the training script first.")
# #         sys.exit(1)
    
# #     # Vectorize the incoming message
# #     features = vectorizer.transform([message])
    
# #     # Predict the risk!
# #     result = predict_risk(model, features)
    
# #     print(f"🎯 Predicted Label: {result['predicted_label']}")
# #     print(f"⚠️ Risk Score:      {result['risk_score']}/100")
# #     print("\n📊 Probabilities:")
# #     for label, prob in result['probabilities'].items():
# #         print(f"  - {label}: {prob:.4f}")

# # if __name__ == "__main__":
# #     if len(sys.argv) > 1:
# #         # If the user provides a message as an argument, use that
# #         test(sys.argv[1])
# #     else:
# #         # Otherwise, run a hardcoded test
# #         print("No message provided. Running a default test...\n")
# #         print("Usage: python3.11 Scripts/test_model.py \"Your message here\"\n")
        
# #         test("I guarantee this investment will definitely outperform the benchmark!")
