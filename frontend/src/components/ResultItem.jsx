import React, { useEffect, useRef } from 'react';
import Stars from './Stars';

const ResultItem = ({ sentence, score, index }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.classList.add('fade-in');
      }
    }, 100 * index);

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <li
      ref={itemRef}
      className={`result-item p-3 rounded mb-2 ${index === 0 ? 'border-2 border-blue-500' : ''}`}
    >
      <div className="text-white font-medium">
        <span>{sentence}</span>
      </div>
      <div className="flex items-center text-gray-400 text-sm mt-1">
        <span className="mr-2">Score:</span>
        <Stars score={score} />
      </div>
    </li>
  );
};

export default ResultItem;
