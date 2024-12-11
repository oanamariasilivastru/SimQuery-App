// HistoryItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { FiClock } from 'react-icons/fi';
import PropTypes from 'prop-types';

const HistoryItem = ({ text, date, onClick }) => {
  let formattedDate;

  try {
    formattedDate = format(new Date(date), 'dd MMM yyyy, HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    formattedDate = 'Data invalida';
  }

  // Split the text into title and body at the first hyphen
  const hyphenIndex = text.indexOf('-');
  let title = '';
  let body = '';

  if (hyphenIndex !== -1) {
    title = text.substring(0, hyphenIndex).trim();
    body = text.substring(hyphenIndex + 1).trim();
  } else {
    // If no hyphen, treat the entire text as body
    body = text;
  }

  return (
    <div className="history-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <p className="history-text">
        {title && <strong>{title} - </strong>}
        <span className="history-body">{body}</span>
      </p>
      <div className="history-date">
        <FiClock className="mr-1" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

HistoryItem.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired, // Adaugă PropType
};

export default HistoryItem;
