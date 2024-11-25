// frontend/src/App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const checkSimilarity = async () => {
    if (!inputText.trim()) {
      setError('Te rog să introduci un text.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        text: inputText,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error checking similarity:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (score) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < score ? 'filled' : ''}`}>★</span>
    ));
  };

  useEffect(() => {
    const items = document.querySelectorAll('.result-item');
    if (results.length > 0) {
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('fade-in');
        }, index * 200); 
      });
    }
  }, [results]);

  return (
    <div className="app-container">
      <h1 className="title">SimQuery</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter text here"
          value={inputText}  
          onChange={handleInputChange}
          className="text-input"
        />
        <button onClick={checkSimilarity} className="check-button">Check Similarity</button>
      </div>
      <div className="results">
        {loading && <p className="loading-message">Checking for similar sentences...</p>}
        {error && <p className="error-message">{error}</p>}
        {results.length > 0 && <h2 className="results-title">Top 5 Similar Sentences:</h2>}
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} className="result-item">
              '{item[0]}' - <strong>Score:</strong> {renderStars(item[1])}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
