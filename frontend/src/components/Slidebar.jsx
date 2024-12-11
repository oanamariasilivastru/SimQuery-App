// Sidebar.jsx
import React from 'react';
import HistoryItem from './HistoryItem';
import { FiUser, FiEye } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, user, history, onHistoryItemClick }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Secțiunea de informații despre utilizator */}
      <div className="user-info">
        <div className="avatar">
          <FiUser size={36} />
        </div>
        <div className="user-name">{user.name}</div>
      </div>

      {/* Vizualizare Profil */}
      <div className="profile-view">
        <FiEye size={20} />
        <span>Vizualizare Profil</span>
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
              onClick={() => onHistoryItemClick(item)} // Apelarea handler-ului cu item-ul curent
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
  onHistoryItemClick: PropTypes.func.isRequired, // Adaugă PropType
};

export default Sidebar;
