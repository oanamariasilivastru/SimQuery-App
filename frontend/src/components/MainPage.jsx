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
import { fetchSynonyms } from '../utils/synonyms';
import SimilarContradictingList from './SimilarContradictingList';

function MainPage({ setIsAuthenticated }) {
  const [inputTexts, setInputTexts] = useState(['Furtuna Ophelia', 'Mount Agung', '']);
  const [queries, setQueries] = useState(['Furtuna Ophelia', 'Mount Agung', '']); // Array de stringuri
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'NumeExistent',
    surname: 'PrenumeExistent',
    role: 'jurnalist',
    image: null,
  });

  // Preia token-ul din localStorage
  const token = localStorage.getItem('token');
  console.log("Token from localStorage:", token);

  // Definește baza URL-ului API folosind variabile de mediu
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  console.log("API_BASE_URL:", API_BASE_URL); // Pentru verificare

  // Verifică prezența token-ului la montarea componentei și preia istoricul
  useEffect(() => {
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate('/'); // Redirecționează la pagina de login
    } else {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Elimină `navigate` din dependențe pentru a preveni avertismentele

  // Toggle dark mode class on body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Load dark mode state from localStorage on mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode));
  }, []);

  // Save dark mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Handle input text change
  const handleInputChange = (index, value) => {
    const newInputs = [...inputTexts];
    newInputs[index] = value;
    setInputTexts(newInputs);
  };

  // Funcție generică pentru a trata răspunsurile 401 (token invalid)
  const handleUnauthorized = () => {
    console.error('Invalid or expired token. Logging out.');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Fetch history from backend
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
        setHistory(data.history || []);
      } else {
        if (response.status === 401) {
          // Token invalid sau expirat
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

  // Handle similarity check
  const checkSimilarity = async () => {
    if (!inputTexts[0].trim()) { // Verifică primul input pentru exemplu
      setError('Textul introdus este gol.');
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
        body: JSON.stringify({ text: inputTexts }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
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

      // Verifică structura răspunsului
      if (data.results && Array.isArray(data.results)) {
        // Procesare și obținere sinonime
        const enhancedResults = await Promise.all(data.results.map(async (item) => {
          if (item.article && item.matched_words && Array.isArray(item.matched_words)) {
            const synonymsPromises = item.matched_words.map(word => fetchSynonyms(word));
            const synonymsArrays = await Promise.all(synonymsPromises);
            const synonyms = synonymsArrays.flat();
            const allMatchedWords = Array.from(new Set([...item.matched_words, ...synonyms]));
            return { ...item, all_matched_words: allMatchedWords };
          }
          // Dacă `article` sau `matched_words` lipsesc, returnează `null` pentru a fi filtrat ulterior
          console.warn('Item invalid detected:', item);
          return null;
        }));

        // Filtrează rezultatele valide
        const validResults = enhancedResults.filter(item => 
          item && item.article && typeof item.score === 'number' && Array.isArray(item.all_matched_words)
        );

        console.log('Valid Results:', validResults); // Log pentru debugging

        if (validResults.length === 0) {
          setError('Nu au fost găsite rezultate valide.');
        }

        setResults(validResults);
      } else {
        console.error("Structura răspunsului este invalidă:", data);
        setError('Structura răspunsului este invalidă.');
      }

      // Creează un nou istoric
      const newHistoryItem = {
        texts: inputTexts, // Folosește `texts` în loc de `text` pentru a corespunde structurilor actuale
        date: new Date().toISOString(),
        results: data.results,
      };

      // Actualizează istoricul cu noua căutare și rezultatele asociate
      setHistory((prevHistory) => [
        newHistoryItem,
        ...prevHistory,
      ]);

      // Trimite noul istoric la backend
      await saveHistory(newHistoryItem);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Save history to backend
  const saveHistory = async (historyItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(historyItem),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const errorData = await response.json();
        console.error('Failed to save history:', errorData.error || 'Unknown error');
        setError(errorData.error || 'Failed to save history');
      } else {
        const data = await response.json();
        console.log('History saved:', data.message);
      }
    } catch (error) {
      console.error('Error saving history:', error);
      setError('Error saving history');
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle user logout
  const handleLogout = () => {
    // Elimină token-ul din localStorage
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Handler pentru selectarea unui element din istoric
  const handleHistoryItemClick = async (historyItem) => {
    setInputTexts(historyItem.texts);
    setQueries(historyItem.texts); // Actualizează `queries` cu textele din istoric
    // Poți extinde funcționalitatea pentru a încărca rezultatele istoricului dacă dorești
  };

  // Deschide modalul de profil
  const handleProfileClick = () => {
    console.log("Profile button clicked."); // Debugging
    setProfileModalOpen(true);
  };

  // Salvează profilul actualizat
  const handleProfileSave = (updatedProfile) => {
    console.log("Profil actualizat:", updatedProfile);
    setProfileData(updatedProfile);
    // Opțional: Trimite actualizările la backend
    // Implementați un endpoint pentru actualizarea profilului și apelați-l aici
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
          inputTexts={inputTexts}
          handleInputChange={handleInputChange}
          checkSimilarity={checkSimilarity}
        />
        {loading && <p>Se încarcă...</p>}
        {error && <p className="error-message">{error}</p>}
        <ResultList results={results} />
        {/* Transmite `queries` ca array */}
        <SimilarContradictingList queries={queries} />
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

export default MainPage;
