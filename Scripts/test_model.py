import os
import sys
import json

# Add project root to path so we can import the backend modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backend.app.ml.model import load_model, load_labels, predict_risk
from backend.app.ml.vectorizer import load_vectorizer
from sklearn.metrics import classification_report, accuracy_score

def evaluate_on_file(filepath: str):
    print(f"📂 Evaluating model on dataset: {filepath}...\n")
    try:
        # Load the trained artifacts
        vectorizer = load_vectorizer()
        model = load_model()
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("Please ensure you have run the training script first.")
        sys.exit(1)
        
    texts = []
    y_true = []
    
    # Load all records from the JSONL file
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip(): 
                continue
            row = json.loads(line)
            texts.append(row["message_text"])
            
            # Map labels identical to train_model.py mapping
            if int(row.get("label", 0)) == 1:
                y_true.append(row.get("label_type", "UNKNOWN"))
            else:
                y_true.append("BENIGN")

    print(f"   Loaded {len(texts)} samples for evaluation.")
    
    # Vectorize the data
    print("🔤 Vectorizing test data...")
    X_test_vec = vectorizer.transform(texts)
    
    # Run prediction
    print("🧠 Running inference...")
    y_pred = model.predict(X_test_vec)
    probas = model.predict_proba(X_test_vec)
    
    # Calculate performance metrics
    accuracy = accuracy_score(y_true, y_pred)
    print(f"\n📊 Accuracy: {accuracy:.4f}")
    print("\n📝 Classification Report:")
    print(classification_report(y_true, y_pred))
    
    # Prepare individual test results
    results = []
    misclassified = []
    flagged_correctly = []
    
    for i, (text, true_lbl, pred_lbl, proba) in enumerate(zip(texts, y_true, y_pred, probas)):
        # Calculate risk score (100 - benign probability)
        benign_idx = model.classes_.tolist().index("BENIGN")
        risk_score = round((1.0 - float(proba[benign_idx])) * 100, 2)
        
        result_item = {
            "index": i + 1,
            "text": text,
            "true_label": true_lbl,
            "predicted_label": pred_lbl,
            "risk_score": risk_score,
            "correct": true_lbl == pred_lbl
        }
        results.append(result_item)
        
        if true_lbl != pred_lbl:
            misclassified.append(result_item)
        elif true_lbl != "BENIGN":
            flagged_correctly.append(result_item)
            
    # Save all results to a companion JSONL file
    base, ext = os.path.splitext(filepath)
    output_path = f"{base}_predictions.jsonl"
    with open(output_path, "w", encoding="utf-8") as out_f:
        for item in results:
            out_f.write(json.dumps(item) + "\n")
    print(f"💾 Saved all {len(results)} individual test results to → {output_path}\n")

    # Print a sample of individual tests
    print("🔍 PREVIEW: First 10 Individual Test Predictions:")
    print("-" * 100)
    print(f"{'No.':<4} | {'True Label':<12} | {'Predicted':<12} | {'Risk':<6} | {'Status':<8} | {'Message Text Preview'}")
    print("-" * 100)
    for item in results[:10]:
        status = "✅ OK" if item["correct"] else "❌ WRONG"
        preview = item["text"][:60] + "..." if len(item["text"]) > 60 else item["text"]
        print(f"{item['index']:<4} | {item['true_label']:<12} | {item['predicted_label']:<12} | {item['risk_score']:>5}% | {status:<8} | {preview}")
    print("-" * 100)
    
    # Print some misclassifications if they exist
    if misclassified:
        print(f"\n❌ Sample of Misclassifications ({len(misclassified)} total):")
        print("-" * 100)
        for item in misclassified[:5]:
            preview = item["text"][:60] + "..." if len(item["text"]) > 60 else item["text"]
            print(f"Sample #{item['index']}:")
            print(f"  True:      {item['true_label']}")
            print(f"  Predicted: {item['predicted_label']} ({item['risk_score']}% risk)")
            print(f"  Message:   \"{preview}\"\n")
        print("-" * 100)
    else:
        print("\n🎉 Zero misclassifications in this dataset!")
        
    # Print some correctly flagged compliance violations
    if flagged_correctly:
        print(f"\n⚠️ Sample of Correctly Flagged Compliance Violations ({len(flagged_correctly)} total):")
        print("-" * 100)
        for item in flagged_correctly[:5]:
            preview = item["text"][:60] + "..." if len(item["text"]) > 60 else item["text"]
            print(f"#{item['index']} | Type: {item['predicted_label']} ({item['risk_score']}% risk) | \"{preview}\"")
        print("-" * 100)

def test_single_message(message: str):
    print(f"Testing message: \"{message}\"\n")
    
    try:
        vectorizer = load_vectorizer()
        model = load_model()
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("Please ensure you have run the training script first.")
        sys.exit(1)
    
    features = vectorizer.transform([message])
    result = predict_risk(model, features)
    
    print(f"🎯 Predicted Label: {result['predicted_label']}")
    print(f"⚠️ Risk Score:      {result['risk_score']}/100")
    print("\n📊 Probabilities:")
    for label, prob in result['probabilities'].items():
        print(f"  - {label}: {prob:.4f}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
        # Check if the target is a jsonl dataset
        if target.endswith('.jsonl') and os.path.exists(target):
            evaluate_on_file(target)
        else:
            test_single_message(target)
    else:
        print("No message or dataset provided. Running a default test...\n")
        print("Usage:")
        print("  Test single message: python3.11 Scripts/test_model.py \"Your message text\"")
        print("  Evaluate dataset:    python3.11 Scripts/test_model.py data/1.jsonl\n")
        
        test_single_message("I guarantee this investment will definitely outperform the benchmark!")
