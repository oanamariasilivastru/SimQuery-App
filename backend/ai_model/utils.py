import spacy
import numpy as np
import traceback
import torch
from ai_model.config import GLOVE_PATH, EMBEDDING_DIM, INPUT_DIM, MODEL_PATH, SENTENCES_PATH

try:
    nlp = spacy.load("en_core_web_sm")
    print("spaCy model loaded successfully.")
except Exception as e:
    print("Error loading spaCy model:", e)
    raise

def load_glove_embeddings(file_path):
    print("Loading GloVe embeddings...")
    embeddings = {}
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                values = line.strip().split()
                if len(values) != EMBEDDING_DIM + 1:
                    continue
                word = values[0]
                try:
                    vector = np.array(values[1:], dtype="float32")
                    embeddings[word] = vector
                except ValueError:
                    continue
        print(f"Loaded {len(embeddings)} word vectors from GloVe.")
        return embeddings
    except FileNotFoundError:
        print(f"Error: GloVe file not found at path: {file_path}")
        raise
    except Exception as e:
        print("Error loading GloVe embeddings:", e)
        raise

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

def tokenize(s, nlp_model=nlp):
    return [token.text.lower() for token in nlp_model(s)]

def sentence_to_glove_embedding(sentence, glove_embeddings):
    tokens = tokenize(sentence)
    vectors = []
    for token in tokens:
        if token in glove_embeddings:
            vectors.append(glove_embeddings[token])
        else:
            vectors.append(np.zeros(EMBEDDING_DIM))
    if vectors:
        return np.mean(vectors, axis=0)
    return np.zeros(EMBEDDING_DIM)

def normalize_embedding(embedding):
    norm = np.linalg.norm(embedding)
    return embedding / norm if norm > 0 else embedding

def preprocess_text(text, glove_embeddings):
    embedding = sentence_to_glove_embedding(text, glove_embeddings)
    embedding = normalize_embedding(embedding)

    repeat_count = (INPUT_DIM // len(embedding)) + 1
    expanded_embedding = np.tile(embedding, repeat_count)[:INPUT_DIM]

    tensor = torch.tensor(expanded_embedding, dtype=torch.float32).unsqueeze(0)
    return tensor

def get_base_embedding(text, glove_embeddings):
    emb = sentence_to_glove_embedding(text, glove_embeddings)
    norm = np.linalg.norm(emb)
    return emb / norm if norm > 0 else emb

def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_a = np.linalg.norm(vec1)
    norm_b = np.linalg.norm(vec2)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)
