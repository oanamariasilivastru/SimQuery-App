# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import torch

from model.config import GLOVE_PATH, MODEL_PATH, SENTENCES_PATH, MODEL_WEIGHT, COSINE_WEIGHT
from model.model import load_trained_model
from model.utils import load_glove_embeddings, load_sentences, preprocess_text, get_base_embedding, cosine_similarity

app = Flask(__name__)
CORS(app)

# ================================
# Load Embeddings
# ================================

try:
    glove_embeddings = load_glove_embeddings(GLOVE_PATH)
    print("GloVe embeddings loaded successfully.")
except Exception as e:
    print("Failed to load GloVe embeddings:", e)
    traceback.print_exc()
    raise

# ================================
# Load Model
# ================================

try:
    model = load_trained_model(MODEL_PATH)
    model.eval()  # Set model to evaluation mode
    print("Model loaded successfully from:", MODEL_PATH)
except FileNotFoundError:
    print(f"Error: Model file not found at path: {MODEL_PATH}")
    traceback.print_exc()
    raise
except Exception as e:
    print("Error loading model:", e)
    traceback.print_exc()
    raise

# ================================
# Load Reference Sentences
# ================================

try:
    reference_sentences = load_sentences(SENTENCES_PATH)
    if not reference_sentences:
        print("Error: No reference sentences loaded. Check sentences.txt file.")
        raise ValueError("No reference sentences loaded.")
    print(f"Loaded {len(reference_sentences)} reference sentences.")
except Exception as e:
    print("Error loading reference sentences:", e)
    traceback.print_exc()
    raise

# ================================
# Prediction Route
# ================================

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    try:
        # Handle CORS preflight request
        if request.method == 'OPTIONS':
            return jsonify({'status': 'OK'}), 200

        print("Received request for prediction.")
        data = request.get_json()
        print("Request data:", data)

        input_text = data.get("text", "").strip()
        if not input_text:
            print("Error: Input text is empty.")
            return jsonify({"error": "Textul introdus este gol."}), 400

        # Preprocess input text
        input_tensor = preprocess_text(input_text, glove_embeddings)
        input_emb = get_base_embedding(input_text, glove_embeddings)

        similarities = []
        for ref_sentence in reference_sentences:
            ref_tensor = preprocess_text(ref_sentence, glove_embeddings)
            ref_emb = get_base_embedding(ref_sentence, glove_embeddings)

            combined_input = input_tensor - ref_tensor

            with torch.no_grad():
                raw_score = model(combined_input).item()
                model_score = raw_score * 5  # Assuming scaling factor

            cos_sim = cosine_similarity(input_emb, ref_emb)
            final_score = MODEL_WEIGHT * model_score + COSINE_WEIGHT * (cos_sim * 5)  # Assuming scaling factor

            similarities.append((ref_sentence, final_score))

        # Get top 5 similar sentences
        top_5 = sorted(similarities, key=lambda x: x[1], reverse=True)[:5]
        print("Top 5 similar sentences:", top_5)

        # Convert similarity scores to native Python floats
        top_5_dict = [{"sentence": s, "score": float(sc)} for s, sc in top_5]

        # Option A: Return the array directly
        # return jsonify(top_5_dict), 200

        # Option B: Wrap the array with a key (e.g., "results")
        return jsonify({"results": top_5_dict}), 200

    except Exception as e:
        print("Error during prediction:", e)
        traceback.print_exc()
        return jsonify({"error": "An error occurred during prediction."}), 500

# ================================
# Run Flask App
# ================================

if __name__ == "__main__"
    print("Starting Flask server...")
    app.run(debug=True, use_reloader=False)
