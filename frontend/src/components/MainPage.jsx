// src/components/MainPage.jsx

import React, { useState, useEffect } from 'react';
import '../theme/MainPage.css';
import Sidebar from './Sidebar';
import InputForm from './InputForm';
import ResultList from './ResultList';
import ToggleButton from './ToggleButton';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import SimilarContradictingList from './SimilarContradictingList';
import PropTypes from 'prop-types';

// Rezultate fallback în caz de eroare
const defaultResults = ['hurricaneIan', 'volcanoIceland', 'earthquakeJapan'];

function MainPage({ setIsAuthenticated }) {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'ExistingName',
    surname: 'ExistingSurname',
    role: 'journalist',
    image: null,
  });

  const token = localStorage.getItem('token');
  console.log("Token from localStorage:", token);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  console.log("API_BASE_URL:", API_BASE_URL);

  // La mount, citește istoricul local
  useEffect(() => {
    const localHistory = localStorage.getItem('localHistory');
    if (localHistory) {
      try {
        setHistory(JSON.parse(localHistory));
      } catch (e) {
        console.error('Error parsing local history:', e);
      }
    }
  }, []);

  // După validarea tokenului, fetch la istoricul din server (dacă dorești)
  useEffect(() => {
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate('/');
    } else {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleInputChange = (value) => {
    setInputText(value);
  };

  const handleUnauthorized = () => {
    console.error('Invalid or expired token. Logging out.');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const serverHistory = data.history || [];

        // Suprascriem istoricul local cu cel de la server
        setHistory(() => {
          localStorage.setItem('localHistory', JSON.stringify(serverHistory));
          return serverHistory;
        });
      } else {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        const errorData = await response.json();
        console.error('Failed to fetch history:', errorData.error || 'Unknown error');
        setError(errorData.error || 'Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Error fetching history');
    }
  };

  // Interogări predefinite -> chei
  const predefinedQueriesMap = {
    'impact of hurricane ian on florida': 'hurricaneIan',
    "volcanic eruption in iceland's reykjanes peninsula": 'volcanoIceland',
    'earthquake strikes tokyo - magnitude 7.3': 'earthquakeJapan',
  };

  // Prompturi scurte
  const scenarioData = {
    hurricaneIan: {
      prompt: 'impact of hurricane ian on florida',
    },
    volcanoIceland: {
      prompt: "volcanic eruption in iceland's reykjanes peninsula",
    },
    earthquakeJapan: {
      prompt: 'earthquake strikes tokyo - magnitude 7.3',
    },
  };

  const checkSimilarity = async () => {
    if (!inputText || inputText.trim() === '') {
      setError('The input text is empty.');
      return;
    }
  
    const normalizedInput = inputText.toLowerCase().trim();
    const matchedKey = predefinedQueriesMap[normalizedInput];
  
    if (matchedKey) {
      console.log("Frază recunoscută. Se vor afișa doar datele hardcodate:", matchedKey);
      
      // Setăm rezultatele fără prompt
      setResults([matchedKey]);
      setError(null);
  
      const newHistoryItem = {
        texts: inputText,
        date: new Date().toISOString(),
        results: [matchedKey],
        prompt: scenarioData[matchedKey].prompt, // <-- Adăugăm promptul
      };
  
      setHistory((prevHistory) => {
        const updatedHistory = [newHistoryItem, ...prevHistory];
        localStorage.setItem('localHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText }),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction error');
      }
  
      const data = await response.json();
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
        setError(null);
  
        const newHistoryItem = {
          texts: inputText,
          date: new Date().toISOString(),
          results: data.results,
        };
        setHistory((prevHistory) => {
          const updatedHistory = [newHistoryItem, ...prevHistory];
          localStorage.setItem('localHistory', JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      } else {
        console.error("Invalid response structure:", data);
        setError('Invalid response structure.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`${error.message}. Displaying default information.`);
      setResults(defaultResults);
  
      const fallbackHistoryItem = {
        texts: inputText,
        date: new Date().toISOString(),
        results: defaultResults,
      };
      setHistory((prevHistory) => {
        const updatedHistory = [fallbackHistoryItem, ...prevHistory];
        localStorage.setItem('localHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleHistoryItemClick = (historyItem) => {
    setInputText(historyItem.text);
    setResults(historyItem.results);
  };

  const handleProfileClick = () => {
    console.log("Profile button clicked.");
    setProfileModalOpen(true);
  };

  const handleProfileSave = (updatedProfile) => {
    console.log("Updated profile:", updatedProfile);
    setProfileData(updatedProfile);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Sidebar
        isOpen={sidebarOpen}
        history={history}
        user={{ name: `${profileData.name} ${profileData.surname}`, avatar: profileData.image }}
        onHistoryItemClick={handleHistoryItemClick}
        onProfileClick={handleProfileClick}
      />
      <ToggleButton isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <button
        onClick={toggleDarkMode}
        className="theme-toggle-button"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      <button onClick={handleLogout} className="logout-button" aria-label="Logout">
        <FiLogOut size={20} />
      </button>

      <div className="main-content">
        <h1 className="title">SimQuery</h1>
        <InputForm
          inputText={inputText}
          handleInputChange={handleInputChange}
          checkSimilarity={checkSimilarity}
        />
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Rezultatele (chei) + articole contradictorii */}
        <ResultList results={results} />
        <SimilarContradictingList results={results} />
      </div>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSave={handleProfileSave}
        initialProfile={profileData}
      />
    </div>
  );
}

MainPage.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default MainPage;
