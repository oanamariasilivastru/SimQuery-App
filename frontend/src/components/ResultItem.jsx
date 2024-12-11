// src/components/ResultItem.jsx
import React, { useState, useEffect, useRef } from 'react';
import Stars from './Stars';

const ResultItem = ({ sentence, score, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.classList.add('fade-in');
      }
    }, 100 * index);

    return () => clearTimeout(timeout);
  }, [index]);

  // Split the sentence into title and body at the first hyphen
  const hyphenIndex = sentence.indexOf('-');
  let title = '';
  let body = '';

  if (hyphenIndex !== -1) {
    title = sentence.substring(0, hyphenIndex).trim();
    body = sentence.substring(hyphenIndex + 1).trim();
  } else {
    // If no hyphen, treat the entire sentence as body
    body = sentence;
  }

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <li
      ref={itemRef}
      className={`result-item p-3 rounded mb-2 ${index === 0 ? 'border-2 border-blue-500' : ''}`}
    >
      <div className="text-white font-medium">
        {title && <strong>{title} - </strong>}
        <span className={`sentence-body ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {body}
        </span>
      </div>
      {body.split('\n').length > 3 || body.length > 300 ? ( // Adjust condition as needed
        <button className="see-more-button" onClick={toggleExpand}>
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      ) : null}
      <div className="flex items-center text-gray-400 text-sm mt-1">
        <span className="mr-2">Score:</span>
        <Stars score={score} />
      </div>
    </li>
  );
};

export default ResultItem;
