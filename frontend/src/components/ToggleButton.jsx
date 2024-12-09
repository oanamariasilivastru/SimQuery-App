// src/components/ToggleButton.jsx
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const ToggleButton = ({ isOpen, toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="toggle-button"
      aria-label="Toggle Sidebar"
    >
      {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>
  );
};

export default ToggleButton;
