// Stars.jsx
import React from 'react';
import PropTypes from 'prop-types';

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

Stars.propTypes = {
  score: PropTypes.number.isRequired,
};

export default Stars;
