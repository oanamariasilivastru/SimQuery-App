// src/components/HistoryItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { FiClock } from 'react-icons/fi';

const HistoryItem = ({ text, date }) => {
  let formattedDate;

  try {
    formattedDate = format(new Date(date), 'dd MMM yyyy, HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    formattedDate = 'Data invalidă';
  }

  return (
    <div className="history-item">
      <p className="history-text">{text}</p>
      <div className="history-date">
        <FiClock className="mr-1" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default HistoryItem;
