// src/components/Sidebar.jsx
import React from 'react';
import HistoryItem from './HistoryItem';
import { FiUser, FiEye } from 'react-icons/fi';

const Sidebar = ({ isOpen, user, history }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Secțiunea cu informațiile utilizatorului */}
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

      {/* Istoricul căutărilor */}
      <div className="history">
        <h2>Istoricul Căutărilor</h2>
        {history.length === 0 ? (
          <p>Nu există căutări efectuate.</p>
        ) : (
          history.map((item, index) => (
            <HistoryItem key={index} text={item.text} date={item.date} />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
