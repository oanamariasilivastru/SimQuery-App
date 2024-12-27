// src/components/InputForm.jsx

import React from 'react';
import PropTypes from 'prop-types';

const InputForm = ({ inputText, handleInputChange, checkSimilarity }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    checkSimilarity();
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <textarea
        placeholder="Enter a phrase..."
        value={inputText}
        onChange={(e) => handleInputChange(e.target.value)}
        className="text-input"
        required
        rows={4}
        style={{ '::placeholder': { color: 'black' } }}
    />

      <button type="submit" className="check-button">
        Check similarity
      </button>
    </form>
  );
};

InputForm.propTypes = {
  inputText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  checkSimilarity: PropTypes.func.isRequired,
};

export default InputForm;
