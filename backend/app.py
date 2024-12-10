from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import numpy as np
import json
from ai_model.utils import load_glove_embeddings, get_base_embedding, cosine_similarity
from ai_model.config import GLOVE_PATH, COSINE_WEIGHT
app = Flask(__name__)
CORS(app)

# ================================
# Load GloVe Embeddings
# ================================
try:
    glove_embeddings = load_glove_embeddings(GLOVE_PATH)
    print("GloVe embeddings loaded successfully.")
except Exception as e:
    print("Failed to load GloVe embeddings:", e)
    traceback.print_exc()
    raise

# ================================
# Load Precomputed Embeddings
# ================================
try:
    print("Loading precomputed embeddings...")
    with open("C:/facultate an 3/data/reference_embeddings.json", "r") as f:
        precomputed_data = json.load(f)

    reference_sentences = [item["sentence"] for item in precomputed_data]
    reference_embeddings = [np.array(item["embedding"]) for item in precomputed_data]

    print(f"Loaded {len(reference_embeddings)} precomputed embeddings.")
except Exception as e:
    print("Error loading precomputed embeddings:", e)
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

        print("\nReceived request for prediction.")
        data = request.get_json()
        print("Request data:", data)

        input_text = data.get("text", "").strip()
        if not input_text:
            print("Error: Input text is empty.")
            return jsonify({"error": "Textul introdus este gol."}), 400

        print(f"Preprocessing input text: {input_text}")
        input_emb = get_base_embedding(input_text, glove_embeddings)
        print("Input text embedding calculated.")

        # Compute similarities
        similarities = []
        print("Comparing input with precomputed embeddings...")
        for sentence, ref_emb in zip(reference_sentences, reference_embeddings):
            cos_sim = cosine_similarity(input_emb, ref_emb)
            # Scale the cosine similarity to a range of 1 to 5
            final_score = 1 + (cos_sim + 1) * 2  # Maps -1 -> 1 and +1 -> 5
            similarities.append((sentence, final_score))

        # Get top 5 similar sentences
        print("Selecting top 5 similar sentences...")
        top_5 = sorted(similarities, key=lambda x: x[1], reverse=True)[:5]
        top_5_dict = [{"sentence": s, "score": float(sc)} for s, sc in top_5]
        print("Top 5 similar sentences:", top_5_dict)

        # Return the results as JSON
        return jsonify({"results": top_5_dict}), 200

    except Exception as e:
        print("Error during prediction:", e)
        traceback.print_exc()
        return jsonify({"error": "An error occurred during prediction."}), 500

# ================================
# Run Flask App
# ================================
if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True, use_reloader=False)
