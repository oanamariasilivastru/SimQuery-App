from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import spacy
import numpy as np
import traceback

app = Flask(__name__)
CORS(app)

# Încarcă spaCy
try:
    nlp = spacy.load("en_core_web_sm")
    print("spaCy model loaded successfully.")
except Exception as e:
    print("Error loading spaCy model:", e)
    raise

# Funcție pentru încărcarea embedding-urilor GloVe
def load_glove_embeddings(file_path):
    print("Loading GloVe embeddings...")
    embeddings = {}
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                values = line.strip().split()
                if len(values) != 301:  # 1 cuvânt + 300 dimensiuni
                    print(f"Skipping line {line_num}: expected 301 values, got {len(values)}")
                    continue
                word = values[0]
                try:
                    vector = np.array(values[1:], dtype="float32")
                    embeddings[word] = vector
                except ValueError:
                    print(f"Skipping line {line_num}: non-numeric values found.")
                    continue
        print(f"Loaded {len(embeddings)} word vectors from GloVe.")
        return embeddings
    except FileNotFoundError:
        print(f"Error: GloVe file not found at path: {file_path}")
        raise
    except Exception as e:
        print("Error loading GloVe embeddings:", e)
        raise

# Specifică calea către fișierul GloVe
GLOVE_PATH = r"C:\facultate an 3\projects-simquery\GloVe\glove.840B.300d.txt"

# Încarcă embedding-urile GloVe
try:
    glove_embeddings = load_glove_embeddings(GLOVE_PATH)
except Exception as e:
    print("Failed to load GloVe embeddings:", e)
    raise

def tokenize(s):
    return [token.text.lower() for token in nlp(s)]

# Definim clasa modelului
class MyModel(nn.Module):
    def __init__(self):
        super(MyModel, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(16384, 512),
            nn.ReLU(),
            nn.Linear(512, 1),
            nn.Sigmoid()
        )
        print("Model initialized.")

    def forward(self, x):
        print(f"Running forward pass for input with shape: {x.shape}")
        return self.fc(x)

# Încarcă modelul salvat
MODEL_PATH = "trained_model.pth"
try:
    model = MyModel()
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device("cpu")))
    model.eval()
    print("Model loaded successfully from:", MODEL_PATH)
except FileNotFoundError:
    print(f"Error: Model file not found at path: {MODEL_PATH}")
    traceback.print_exc()
    raise
except Exception as e:
    print("Error loading model:", e)
    traceback.print_exc()
    raise

# Încarcă frazele de referință din fișier
def load_sentences(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            sentences = [line.strip() for line in f.readlines()]
        print(f"Loaded {len(sentences)} sentences from {file_path}")
        return sentences
    except FileNotFoundError:
        print(f"Error: Sentences file not found at path: {file_path}")
        traceback.print_exc()
        return []
    except Exception as e:
        print("Error loading sentences file:", e)
        traceback.print_exc()
        return []

reference_sentences = load_sentences("sentences.txt")
if not reference_sentences:
    print("Error: No reference sentences loaded. Check sentences.txt file.")
    raise ValueError("No reference sentences loaded.")

def sentence_to_glove_embedding(sentence, glove_embeddings):
    tokens = tokenize(sentence)
    vectors = []
    for token in tokens:
        if token in glove_embeddings:
            vectors.append(glove_embeddings[token])
        else:
            vectors.append(np.zeros(300))
    if vectors:
        return np.mean(vectors, axis=0)
        return np.zeros(300)

def normalize_embedding(embedding):
    norm = np.linalg.norm(embedding)
    return embedding / norm if norm > 0 else embedding

def preprocess_text(text):
    print(f"Preprocessing text: {text}")
    try:
        embedding = sentence_to_glove_embedding(text, glove_embeddings)

        embedding = normalize_embedding(embedding)

        repeat_count = (16384 // len(embedding)) + 1
        expanded_embedding = np.tile(embedding, repeat_count)[:16384]

        tensor = torch.tensor(expanded_embedding, dtype=torch.float32).unsqueeze(0)
        print(f"Generated tensor with shape: {tensor.shape}")
        return tensor
    except Exception as e:
        print("Error during text preprocessing:", e)
        traceback.print_exc()
        raise


@app.route("/predict", methods=["POST"])
def predict():
    print("Received request for prediction.")
    data = request.json
    print("Request data:", data)

    input_text = data.get("text", "")
    if not input_text.strip():
        print("Error: Input text is empty.")
        return jsonify({"error": "Textul introdus este gol."}), 400

    try:
        input_tensor = preprocess_text(input_text)

        similarities = []
        for i, ref_sentence in enumerate(reference_sentences):
            print(f"Processing reference sentence {i + 1}/{len(reference_sentences)}: {ref_sentence}")
            ref_tensor = preprocess_text(ref_sentence)

            combined_input = input_tensor - ref_tensor

            with torch.no_grad():
                raw_score = model(combined_input).item()
                normalized_score = 1 + (raw_score * 4)
                similarities.append((ref_sentence, normalized_score))
                print(f"Raw score: {raw_score}, Normalized score: {normalized_score}")

        top_5 = sorted(similarities, key=lambda x: x[1], reverse=True)[:5]
        print("Top 5 similar sentences:", top_5)

        return jsonify(top_5)
    except Exception as e:
        print("Error during prediction:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)
