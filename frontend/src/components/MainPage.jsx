// MainPage.jsx
import React, { useState, useEffect } from 'react';
import '../theme/MainPage.css';
import Sidebar from './Sidebar'; // Asigură-te că calea este corectă
import InputForm from './InputForm';
import ResultList from './ResultList';
import ToggleButton from './ToggleButton';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

function MainPage({ setIsAuthenticated }) {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Preia token-ul din localStorage
  const token = localStorage.getItem('token');
  console.log("Token from localStorage:", token);

  // Stări pentru modal profil
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'NumeExistent',
    surname: 'PrenumeExistent',
    role: 'jurnalist',
    image: null,
  });

  // Verifică prezența token-ului la montarea componentei și preia istoricul
  useEffect(() => {
    if (!token) {
      console.log("No token found, redirecting to login.");
      navigate('/'); // Redirecționează la pagina de login
    } else {
      fetchHistory();
    }
  }, [token, navigate]);

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
  const handleInputChange = (e) => {
    setInputText(e.target.value);
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
      const response = await fetch('http://localhost:5000/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText }),
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

      // Extrage array-ul 'results' din răspuns
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        console.error("Structura răspunsului este invalidă:", data);
        setError('Structura răspunsului este invalidă.');
      }

      // Creează un nou istoric
      const newHistoryItem = {
        text: inputText,
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
      const response = await fetch('http://localhost:5000/save_history', {
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
  const handleHistoryItemClick = (historyItem) => {
    setInputText(historyItem.text);
    setResults(historyItem.results);
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
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        history={history}
        user={{ name: `${profileData.name} ${profileData.surname}`, avatar: profileData.image }}
        onHistoryItemClick={handleHistoryItemClick}
        onProfileClick={handleProfileClick} // Adaugă prop-ul
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
        {loading && <p>Se încarcă...</p>}
        {error && <p className="error-message">{error}</p>}
        <ResultList results={results} />
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
