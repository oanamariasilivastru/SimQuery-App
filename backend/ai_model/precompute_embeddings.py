import json
import numpy as np
from ai_model.utils import load_glove_embeddings, load_sentences, get_base_embedding
from ai_model.config import GLOVE_PATH, SENTENCES_PATH

# Load GloVe embeddings
glove_embeddings = load_glove_embeddings(GLOVE_PATH)

# Load reference sentences
reference_sentences = load_sentences(SENTENCES_PATH)

# Compute embeddings
reference_embeddings = []
for sentence in reference_sentences:
    embedding = get_base_embedding(sentence, glove_embeddings)
    reference_embeddings.append({
        "sentence": sentence,
        "embedding": embedding.tolist()  # Convert to list for JSON serialization
    })

# Save embeddings to a JSON file
with open("reference_embeddings.json", "w") as f:
    json.dump(reference_embeddings, f)

print(f"Precomputed embeddings saved for {len(reference_embeddings)} sentences.")
