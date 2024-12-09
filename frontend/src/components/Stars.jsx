// src/components/Stars.jsx
import React from 'react';

const Stars = ({ score }) => {
  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={`star ${index < score ? 'filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
};

export default Stars;
