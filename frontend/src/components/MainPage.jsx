// MainPage.jsx
import React, { useState, useEffect } from 'react';
import '../theme/MainPage.css';
import Sidebar from './Slidebar'; // Corrected import name
import InputForm from './InputForm';
import ResultList from './ResultList';
import ToggleButton from './ToggleButton';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function MainPage({ setIsAuthenticated }) {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Toggle dark mode class on body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Load history, results, and dark mode state from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('history');
    const storedResults = localStorage.getItem('results');
    const storedDarkMode = localStorage.getItem('isDarkMode');

    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedResults) setResults(JSON.parse(storedResults));
    if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode));
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  // Save dark mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Handle input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle similarity check
  const checkSimilarity = async () => {
    if (!inputText.trim()) {
      setError('Textul introdus este gol.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        let errorMessage = 'Eroare la predicție';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // **Key Change:** Extract the 'results' array from the response
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        console.error("Invalid response structure:", data);
        setError('Structura răspunsului este invalidă.');
      }

      // Update history with the new query
      setHistory((prevHistory) => [
        { text: inputText, date: new Date().toISOString() },
        ...prevHistory,
      ]);

      // Clear the input field
      setInputText('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} history={history} user={{ name: 'Utilizator Test' }} />
      <ToggleButton isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <button
        onClick={toggleDarkMode}
        className="theme-toggle-button"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      <button
        onClick={handleLogout}
        className="logout-button"
        aria-label="Logout"
      >
        <FiLogOut size={20} />
      </button>

      <div className="main-content">
        <h1 className="title">SimQuery</h1>

        <InputForm
          inputText={inputText}
          handleInputChange={handleInputChange}
          checkSimilarity={checkSimilarity}
        />

        {loading && <p>Se încarcă...</p>}
        {error && <p className="error-message">{error}</p>}

        <ResultList results={results} />

        <div className="debug-results">
          <h2>Debugging Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
