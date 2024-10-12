from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)
def load_sentences(filename):
    with open(filename, 'r') as file:
        sentences = [line.strip() for line in file.readlines()]
    return sentences

def calculate_similarity(input_text, sentences):
    vectorizer = CountVectorizer().fit_transform([input_text] + sentences)
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors)
    similarities = cosine_sim[0][1:]  
    scores = normalize_similarity(similarities)
    return scores

def normalize_similarity(similarities):
    min_sim = min(similarities)
    max_sim = max(similarities)
    range_sim = max_sim - min_sim
    if range_sim == 0:
        return [3 for _ in similarities]  
    scores = [1 + 4 * (sim - min_sim) / range_sim for sim in similarities]
    return [round(score) for score in scores]

@app.route('/', methods=['POST'])
def check_similarity():
    input_text = request.json.get('text')
    sentences = load_sentences('sentences.txt')  
    scores = calculate_similarity(input_text, sentences)
    scored_sentences = list(zip(sentences, scores))
    scored_sentences.sort(key=lambda x: x[1], reverse=True)  
    top_sentences = scored_sentences[:5]  
    return jsonify(top_sentences)

if __name__ == '__main__':
    app.run(debug=True)
