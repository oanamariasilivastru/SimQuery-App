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
        placeholder="Introduceți o frază..."
        value={inputText}
        onChange={(e) => handleInputChange(e.target.value)} // Extrage valoarea inputului
        className="text-input"
        required
        rows={4}
      />
      <button type="submit" className="check-button">
        Verifică Similaritatea
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
