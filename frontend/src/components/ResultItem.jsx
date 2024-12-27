// src/components/ResultItem.jsx
import React, { useState, useEffect, useRef } from 'react';
import Stars from './Stars';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';

const ResultItem = ({ sentence, score, searchWords, index }) => {
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

  // Tot textul e "body", fără split
  const body = sentence;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <li
      ref={itemRef}
      className={`result-item p-3 rounded mb-2 ${index === 0 ? 'border-2 border-blue-500' : ''}`}
    >
      <div className="text-black font-medium">
        <span className={`sentence-body ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <Highlighter
            highlightClassName="highlight"
            searchWords={searchWords}
            autoEscape={true}
            textToHighlight={body}
          />
        </span>
      </div>

      {body.length > 100 && (
        <button className="see-more-button" onClick={toggleExpand}>
          {isExpanded ? 'Vezi mai puțin' : 'Vezi mai mult'}
        </button>
      )}

      <div className="flex items-center text-gray-400 text-sm mt-1">
        <span className="mr-2">Scor:</span>
        <Stars score={score} />
      </div>
    </li>
  );
};

ResultItem.propTypes = {
  sentence: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
};

export default ResultItem;
