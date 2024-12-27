// src/components/HistoryItem.jsx

import React from 'react';
import { format } from 'date-fns';
import { FiClock } from 'react-icons/fi';
import PropTypes from 'prop-types';

const HistoryItem = ({ text = '', date, prompt = '', onClick }) => {
  let formattedDate;

  try {
    formattedDate = format(new Date(date), 'dd MMM yyyy, HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    formattedDate = 'Data invalidă';
  }

  // Exemplu: "Titlu - body text"
  // (doar dacă vrei să separi textul prin cratimă)
  const hyphenIndex = text.indexOf('-');
  let title = '';
  let body = '';

  if (hyphenIndex !== -1) {
    title = text.substring(0, hyphenIndex).trim();
    body = text.substring(hyphenIndex + 1).trim();
  } else {
    body = text;
  }

  return (
    <div className="history-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <p className="history-text">
        {title && <strong>{title} - </strong>}
        <span className="history-body">{body}</span>
      </p>

      {/* Afișăm promptul dacă există */}
      {prompt && (
        <p className="history-prompt">
          <em>{prompt}</em>
        </p>
      )}

      <div className="history-date">
        <FiClock className="mr-1" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

HistoryItem.propTypes = {
  text: PropTypes.string,
  date: PropTypes.string.isRequired,
  prompt: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default HistoryItem;
