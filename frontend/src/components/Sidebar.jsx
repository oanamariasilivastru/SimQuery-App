// Sidebar.jsx
import React from 'react';
import HistoryItem from './HistoryItem';
import { FiUser, FiEye } from 'react-icons/fi';
import PropTypes from 'prop-types';
import '../theme/Sidebar.css';

const Sidebar = ({ isOpen, user, history, onHistoryItemClick, onProfileClick }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Secțiunea de informații despre utilizator */}
      <div className="user-info">
        <div className="avatar">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="avatar-image" />
          ) : (
            <FiUser className="avatar-icon" />
          )}
        </div>
        <div className="user-name">{user.name}</div>
      </div>

      {/* Vizualizare Profil */}
      <div className="profile-view" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
        <FiEye size={20} />
        <span>Vizualizează Profil</span>
      </div>

      {/* Istoric Căutări */}
      <div className="history">
        <h2>Istoricul Căutărilor</h2>
        {history.length === 0 ? (
          <p>Nu există căutări efectuate.</p>
        ) : (
          history.map((item, index) => (
            <HistoryItem
              key={index}
              text={item.text}
              date={item.date}
              onClick={() => onHistoryItemClick(item)}
            />
          ))
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
  onHistoryItemClick: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired, // Adaugă PropType
};

export default Sidebar;
