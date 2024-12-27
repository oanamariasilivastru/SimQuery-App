// src/components/SimilarContradictingList.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import { FaStar } from 'react-icons/fa';  // pentru stele
import '../theme/SimilarContradictingList.css';

/**
 * Component for expandable text (See More / See Less).
 * If text is shorter than `maxLength`, it shows it fully.
 * If it's longer, it displays up to `maxLength` characters,
 * plus a toggle button.
 */
function ExpandableText({ text, searchWords, maxLength = 300 }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    // Text scurt => afișăm tot, fără buton
    return (
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={text}
      />
    );
  }

  // Text lung => afișăm doar primele `maxLength` caractere
  const textToShow = expanded ? text : text.slice(0, maxLength) + '...';

  return (
    <div className="expandable-text">
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={textToShow}
      />
      <button className="see-more-button" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'See Less' : 'See More'}
      </button>
    </div>
  );
}

ExpandableText.propTypes = {
  text: PropTypes.string.isRequired,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxLength: PropTypes.number,
};

const SimilarContradictingList = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  // Date pentru 3 scenarii
  const data = {
    hurricaneIan: {
      prompt: 'Hurricane Ian Strikes Florida',
      searchWords: ['hurricane', 'ian', 'florida', 'evacuation', 'damage'],

      // 5 articole similare, cu sursă și scor
      similarArticles: [
        {
          source: 'The Florida Herald',
          score: 4.7,
          text: `As Hurricane Ian made landfall on Florida’s Gulf Coast, the region experienced catastrophic flooding 
alongside winds reaching over 150 mph. State officials declared a mandatory evacuation in low-lying areas, 
urging residents to find safe shelter...`,
        },
        {
          source: 'Miami Daily News',
          score: 4.5,
          text: `Local volunteers teamed up with the National Guard to distribute supplies and provide immediate relief 
to those who lost electricity, clean water, and basic necessities. While power companies struggled to restore service 
to millions of customers...`,
        },
        {
          source: 'Sunshine Observer',
          score: 4.3,
          text: `According to preliminary forecasts, the economic toll could climb into tens of billions of dollars, 
surpassing initial predictions. Infrastructure such as bridges, highways, and power grids took a severe hit...`,
        },
        {
          source: 'Gulf Coast Times',
          score: 4.2,
          text: `Even as the winds subsided, the aftermath revealed widespread devastation. 
Residents reported that certain neighborhoods looked almost unrecognizable, 
with streets clogged by debris, uprooted trees, and abandoned vehicles...`,
        },
        {
          source: 'National Weather Journal',
          score: 4.0,
          text: `Long-term effects could be felt for months or even years, 
as communities slowly rebuild schools, businesses, and residential districts. 
Environmental scientists also worry about saltwater intrusion into freshwater systems...`,
        },
      ],

      // 3 articole contradictorii, cu sursă, dar fără scor
      contradictingArticles: [
        {
          source: 'Coastal Beacon',
          text: `Contrary to widespread reports of devastation, a few local commentators argued 
that certain inland regions of Florida were largely unaffected, experiencing only moderate rain 
and brief power outages. They claimed the media overhyped...`,
        },
        {
          source: 'SocialBuzz TV',
          text: `A handful of social media influencers posted videos showing normal daily life 
in some neighborhoods, suggesting that evacuation orders might have been excessive. 
Local authorities disagreed, stating that evacuation measures prevented...`,
        },
        {
          source: 'Economic Insider',
          text: `Some economists insisted that the overall economic hit would be minimal 
because of Florida’s robust tourism sector. They believe that the state’s disaster-response infrastructure 
would expedite repairs and restore normal activity within weeks...`,
        },
      ],
    },

    volcanoIceland: {
      prompt: 'Volcanic Eruption in Iceland’s Reykjanes Peninsula',
      searchWords: ['volcano', 'iceland', 'eruption', 'lava', 'peninsula'],

      similarArticles: [
        {
          source: 'Reykjavik Post',
          score: 4.6,
          text: `A massive volcanic eruption began erupting along Iceland’s Reykjanes Peninsula, 
spewing large amounts of lava and ash into the atmosphere. Volcanologists had closely monitored 
seismic activity for months...`,
        },
        {
          source: 'Nordic Press Agency',
          score: 4.5,
          text: `Emergency evacuation procedures were activated in nearby fishing villages, 
as molten lava advanced within a few kilometers of the coastline. Although the eruption was 
initially contained to a single fissure...`,
        },
        {
          source: 'Global Geology Weekly',
          score: 4.4,
          text: `News outlets highlighted the dramatic visuals: rivers of lava creeping through desolate fields 
and striking fiery contrast against Iceland’s snowy landscapes. Drone footage captured how the magma...`,
        },
        {
          source: 'Travel Iceland Magazine',
          score: 4.3,
          text: `Local businesses, particularly in tourism and lodging, quickly adapted, offering special tours 
to observe the eruptions from a safe distance. Some entrepreneurs saw an opportunity...`,
        },
        {
          source: 'Icelandic Times',
          score: 4.1,
          text: `In a rare statement, Iceland’s government detailed a multi-phase plan 
to address potential long-term impacts, including lava diversion techniques and constant air-quality monitoring...`,
        },
      ],
      contradictingArticles: [
        {
          source: 'Peninsula Dispatch',
          text: `Some local observers challenged initial headlines claiming severe disruption. 
They noted that while dramatic, the eruption was largely confined to remote areas, 
posing minimal risk to major population centers...`,
        },
        {
          source: 'Fjords Critic',
          text: `A few government critics accused officials of overreacting, 
arguing that forced evacuations were expensive and largely unnecessary 
due to the slow-moving nature of the lava...`,
        },
        {
          source: 'EcoWatch Europe',
          text: `Environmental skeptics downplayed the ecological damage, 
suggesting that volcanic landscapes recover quickly 
and that global media outlets had sensationalized minor lava flows...`,
        },
      ],
    },

    earthquakeJapan: {
      prompt: 'Major Earthquake Rocks Tokyo Region - Magnitude 7.3',
      searchWords: ['earthquake', 'tokyo', 'magnitude', 'japan', 'tsunami'],

      similarArticles: [
        {
          source: 'Tokyo Daily',
          score: 4.7,
          text: `A powerful 7.3 magnitude earthquake struck just off the coast near Tokyo, Japan, 
sending high-rise buildings swaying and prompting immediate tsunami advisories...`,
        },
        {
          source: 'Japan News Wire',
          score: 4.5,
          text: `Local media reported that grocery stores and gas stations experienced brief surges 
of panic buying. However, the national emergency broadcast system quickly provided reassurance...`,
        },
        {
          source: 'Seismic Review Online',
          score: 4.4,
          text: `Seismologists, who had monitored an uptick in regional activity, suggested that aftershocks 
could continue for several days. Authorities set up temporary shelters...`,
        },
        {
          source: 'Kyodo Analysis',
          score: 4.2,
          text: `As the dust settled, Tokyo Governor’s office released a statement praising 
the city’s earthquake-resistant infrastructure and well-drilled emergency services...`,
        },
        {
          source: 'Global Finance Journal',
          score: 4.1,
          text: `Economic analysts predicted a temporary dip in stock markets 
and minor disruptions to manufacturing, but expected a quick rebound due to Japan’s robust 
contingency planning...`,
        },
      ],
      contradictingArticles: [
        {
          source: 'Urban Voices',
          text: `Various online posts suggested that the quake warnings were exaggerated, 
with some Tokyo residents sharing videos of normal life on social media. They insisted 
that the city was largely untouched...`,
        },
        {
          source: 'TrainLine Critics',
          text: `A number of commentators criticized the government’s decision to shut down train lines, 
arguing that the inconvenience and economic losses would far outweigh any real safety benefit...`,
        },
        {
          source: 'Local Biz Watch',
          text: `Some local business owners reported minimal impact and accused international media 
of sensationalism, claiming that the quake was not significantly different 
from frequent smaller tremors in the region...`,
        },
      ],
    },
  };

  // Selecție pe baza keys-urilor din `results`
  const selectedDatas = results.map((key) => data[key]).filter(Boolean);

  // Dacă nu e niciun scenariu valid
  if (selectedDatas.length === 0) {
    return <p>No valid results found.</p>;
  }

  return (
    <div className="similar-contradicting-list">
      {selectedDatas.map((scenario, idx) => (
        <div key={idx} className="scenario-section">
          {/* Prompt-ul (titlul) */}
          <h2 className="prompt-title">{scenario.prompt}</h2>

          <div className="columns-container">
            {/* 5 articole similare */}
            <div className="column similar-column">
              <h3>5 Most Similar Articles</h3>
              {scenario.similarArticles.slice(0, 5).map((article, i) => (
                <div key={i} className="article-item similar-article">
                  <p>
                    <strong>{article.source}</strong>
                  </p>
                  <ExpandableText
                    text={article.text}
                    searchWords={scenario.searchWords}
                    maxLength={400}
                  />
                  {/* Afișăm stele doar la cele similare */}
                  <div className="score-section">
                    {[...Array(Math.round(article.score))].map((_, k) => (
                      <FaStar key={k} color="gold" />
                    ))}
                    <span className="score-text"> {article.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 3 articole contradictorii */}
            <div className="column contradicting-column">
              <h3>3 Contradicting Articles</h3>
              {scenario.contradictingArticles.slice(0, 3).map((article, j) => (
                <div key={j} className="article-item contradicting-article">
                  <p>
                    <strong>{article.source}</strong>
                  </p>
                  <ExpandableText
                    text={article.text}
                    searchWords={scenario.searchWords}
                    maxLength={400}
                  />
                  {/* Fără stele la contradictorii */}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

SimilarContradictingList.propTypes = {
  // E.g. ['hurricaneIan', 'volcanoIceland', 'earthquakeJapan']
  results: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SimilarContradictingList;
