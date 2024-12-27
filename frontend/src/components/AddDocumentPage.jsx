// src/components/AddDocumentPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import '../theme/AddDocumentPage.css'; // Creează acest fișier pentru stiluri

function AddDocumentPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSources([]);

    // Simulăm o întârziere de 2 secunde pentru a arăta indicatorul de loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Surse hardcodate în engleză
    const hardcodedSources = [
      {
        title: 'Source 1: The New York Times',
        location: 'Page 2, Line 15',
      },
      {
        title: 'Source 2: BBC News',
        location: 'Page 5, Line 3',
      },
      {
        title: 'Source 3: CNN',
        location: 'Page 3, Line 8',
      },
    ];

    // Setăm sursele hardcodate
    setSources(hardcodedSources);
    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1); // Navighează înapoi la pagina anterioară
  };

  return (
    <div className="add-document-container">
      <button onClick={handleBack} className="back-button" aria-label="Back">
        <FiArrowLeft size={24} /> Back
      </button>

      <h2>Add a Document</h2>

      <form onSubmit={handleSubmit} className="add-document-form">
        <div className="form-group">
          <label htmlFor="document">Selectează un document (PDF, DOCX):</label>
          <input
            type="file"
            id="document"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          <FiUpload size={20} /> Verifică
        </button>
      </form>

      {loading && <div className="loading-indicator">Procesare document...</div>}

      {error && <p className="error-message">{error}</p>}

      {sources.length > 0 && (
        <div className="sources-container">
          <h3>Detected Sources</h3>
          <ul>
            {sources.map((source, index) => (
              <li key={index}>
                <strong>{source.title}</strong> - {source.location}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddDocumentPage;
