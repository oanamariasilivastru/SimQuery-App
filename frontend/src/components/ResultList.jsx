import React from 'react';
import PropTypes from 'prop-types';
import ResultItem from './ResultItem';

const ResultList = ({ results }) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return <p>No results to display.</p>;
  }

  return (
    <div className="results-container">
      <h2 className="results-title">Top 5 Similar Sentences:</h2>
      <ul className="results-list">
        {results.map((item, index) => (
          <ResultItem
            key={index}
            sentence={item.sentence}
            score={item.score}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};
ResultList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      sentence: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ResultList;
