// ToggleButton.jsx
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';

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

ToggleButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default ToggleButton;
