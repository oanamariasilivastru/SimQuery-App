from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import numpy as np
import json
from datetime import timedelta
from ai_model.utils import load_glove_embeddings, get_base_embedding, cosine_similarity
from ai_model.config import GLOVE_PATH, COSINE_WEIGHT
from repos.utils.database import get_db_connection
from repos.utils.auth import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

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
# REGISTER ROUTE
# ================================
@app.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not username or not email or not password:
            return jsonify({"error": "Username, email și password sunt obligatorii."}), 400

        conn = get_db_connection()
        user_exists = conn.execute("SELECT * FROM users WHERE username = ? OR email = ?", (username, email)).fetchone()
        if user_exists:
            conn.close()
            return jsonify({"error": "Username sau email deja înregistrat."}), 400

        hashed = hash_password(password)
        conn.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", (username, email, hashed))
        conn.commit()
        conn.close()

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": username}, expires_delta=access_token_expires)
        return jsonify({"access_token": access_token, "token_type": "bearer"}), 200

    except Exception as e:
        print("Error during user registration:", e)
        traceback.print_exc()
        return jsonify({"error": "An error occurred during registration."}), 500

# ================================
# LOGIN ROUTE
# ================================
@app.route("/login", methods=["POST"])
def login_user():
    try:
        data = request.get_json()
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        if not username or not password:
            return jsonify({"error": "Username și password sunt obligatorii."}), 400

        conn = get_db_connection()
        db_user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()
        if not db_user:
            return jsonify({"error": "Username sau password invalide."}), 401

        if not verify_password(password, db_user["password_hash"]):
            return jsonify({"error": "Username sau password invalide."}), 401

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": db_user["username"]}, expires_delta=access_token_expires)
        return jsonify({"access_token": access_token, "token_type": "bearer"}), 200

    except Exception as e:
        print("Error during login:", e)
        traceback.print_exc()
        return jsonify({"error": "An error occurred during login."}), 500

# ================================
# PREDICT ROUTE
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
