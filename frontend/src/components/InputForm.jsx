// src/components/InputForm.jsx
import React from 'react';

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
        onChange={handleInputChange}
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

export default InputForm;
