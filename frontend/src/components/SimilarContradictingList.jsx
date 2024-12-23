// src/components/SimilarContradictingList.jsx

import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import PropTypes from 'prop-types';
import '../theme/SimilarContradictingList.css'; // Asigură-te că creezi acest fișier CSS
import { FaStar } from 'react-icons/fa'; // Pentru afișarea stelelor

const SimilarContradictingList = ({ queries }) => {
  // Verifică dacă queries este definit și este un array
  if (!queries || !Array.isArray(queries) || queries.length === 0) {
    return null; // Nu afișa nimic dacă nu sunt query-uri valide
  }

  // Datele hardcodate în limba română
  const data = {
    ophelia: {
      prompt: 'Impactul Furtunii Ophelia asupra Bucureștiului',
      searchWords: ['Ophelia', 'București', 'furtună', 'praf', 'Sahara', 'incendii'],
      similarSentences: [
        {
          sentence: 'BUCUREȘTI (Reuters) - Cerul de deasupra Bucureștiului a căpătat o nuanță neobișnuită de galben luni, pe măsură ce Furtuna Ophelia a adus praf din Sahara și fum din incendiile din Europa de Sud, filtrând anumite lungimi de undă ale luminii solare. Reducându-se de la un uragan peste noapte, Ophelia a provocat două decese în Irlanda luni, unde a fost cea mai gravă furtună din jumătate de secol. În timp ce vânturile au fost moderate în capitala românească, cerul galben a surprins locuitorii Bucureștiului, mulți dintre aceștia postând poze pe rețelele sociale. Pe măsură ce Ophelia avansa din Azore, furtuna a adunat praf saharian din Africa de Nord și praf din incendiile din Spania și Portugalia, potrivit unei purtătoare de cuvânt a Oficiului Meteorologic din România. Această nuanță galbenă provine din praful din atmosferă, care dispersează lungimile de undă albastre ale luminii solare, permițând trecerea roșului și făcând ca soarele să pară mai roșu, creând o tentă galbenă.',
          score: 4.51,
        },
        {
          sentence: 'Impactul Furtunii Ophelia s-a resimțit în multiple regiuni din România, unde vânturile puternice și precipitațiile abundente au cauzat pagube semnificative infrastructurii și mediului înconjurător. Autoritățile au declarat stare de alertă și au mobilizat echipe de intervenție pentru a gestiona situația de urgență.',
          score: 4.35,
        },
        {
          sentence: 'Comunitățile locale din București s-au adaptat rapid la condițiile generate de Furtunii Ophelia, instalând adăposturi temporare și distribuind resurse esențiale pentru locuitori. Transportul public a suferit modificări pentru a asigura siguranța pasagerilor, iar autoritățile au implementat măsuri suplimentare pentru a preveni inundațiile în zonele vulnerabile.',
          score: 4.20,
        },
        {
          sentence: 'Pe măsură ce Furtunii Ophelia își continuă drumul prin Europa de Est, experții în meteorologie monitorizează îndeaproape evoluția acesteia. Previziunile indică posibilitatea ca furtuna să se atenueze în următoarele zile, dar autoritățile rămân vigilente pentru a răspunde rapid la orice schimbare a situației climatice.',
          score: 4.10,
        },
        {
          sentence: 'Reacția rapidă a populației și a autorităților a redus impactul negativ al Furtunii Ophelia asupra Bucureștiului. Mulți locuitori au participat la programele de voluntariat pentru a ajuta persoanele afectate și pentru a asigura restabilirea normalității în comunitate. Inițiativele locale au fost esențiale în gestionarea crizei și în minimizarea pagubelor materiale.',
          score: 4.00,
        },
      ],
      contradictingSources: [
        {
          source: 'BBC News România',
          sentence: 'Contrar unor rapoarte, Furtuna Ophelia nu a adus praf semnificativ din Sahara în București, iar cerul galben a fost o manifestare naturală atmosferică nelegată de furtună.',
          score: 4.45,
        },
        {
          source: 'Adevărul',
          sentence: 'Deși unele surse afirmă că Ophelia a afectat sever Bucureștiul, datele meteorologice arată că impactul a fost moderat și localizat în anumite zone.',
          score: 4.30,
        },
        {
          source: 'Realitatea TV',
          sentence: 'Analizele recente arată că Furtuna Ophelia a avut un impact limitat asupra Bucureștiului, iar autoritățile au gestionat eficient situația fără necesitatea unor intervenții masive.',
          score: 4.25,
        },
        {
          source: 'G4Media',
          sentence: 'Sursele meteorologice confirmă că Furtuna Ophelia a avut o influență redusă asupra Bucureștiului, iar cerul galben a fost datorat factorilor atmosferici locali.',
          score: 4.15,
        },
        {
          source: 'HotNews.ro',
          sentence: 'Contrar temerilor inițiale, Ophelia a avut un impact limitat asupra Bucureștiului, iar autoritățile au gestionat eficient situația fără necesitatea unor intervenții masive.',
          score: 4.05,
        },
      ],
    },
    mountagung: {
      prompt: 'Efectele Vulcanului Mount Agung asupra Clujului',
      searchWords: ['Mount Agung', 'vulcan', 'Cluj', 'evacuare', 'sacru', 'erupție'],
      similarSentences: [
        {
          sentence: 'Vulcanul Mount Agung, un vulcan zgomotos care domină insula centrală a României, a forțat evacuarea a peste 140.000 de persoane, pe măsură ce autoritățile avertizează că ar putea erupă în orice moment. Oamenii de turiști evită zona după ce oamenii de știință au emis cel mai înalt nivel de alertă pentru vulcan, care a ucis peste 1.000 de persoane în ultima erupție din 1963. Cu o înălțime de peste 3.000 de metri, Mount Agung este cel mai înalt și cel mai sacru vulcan al insulei, găzduind complexul de temple Pura Besakih care a scăpat cu greu de erupția precedentă. Clujul este mai bine pregătit de această dată, impunând o zonă de excludere de 12 km în jurul vulcanului și stocând alimente și provizii de urgență la adăposturile temporare. Oamenii de știință monitorizează îndeaproape activitatea seismică, prezicând că orice schimbare semnificativă ar putea semnala o erupție iminentă.',
          score: 4.45,
        },
        {
          sentence: 'În ciuda avertismentelor, unele comunități locale din Cluj continuă să trăiască în apropierea vulcanului Mount Agung, subestimând riscurile potențiale. Experții recomandă respectarea zonelor de siguranță și evacuarea imediată în cazul oricăror semne de activitate intensificată.',
          score: 4.20,
        },
        {
          sentence: 'Autoritățile locale au intensificat măsurile de securitate în zonele adiacente vulcanului Mount Agung, asigurându-se că toate resursele sunt disponibile pentru a răspunde rapid la orice situație de urgență. Campaniile de informare publică au fost lansate pentru a educa locuitorii despre importanța respectării protocoalelor de siguranță.',
          score: 4.10,
        },
        {
          sentence: 'Impactul potențial al unei erupții a vulcanului Mount Agung asupra Clujului a generat îngrijorări semnificative în rândul populației. Instituțiile de învățământ și companiile locale au implementat planuri de evacuare și au organizat exerciții pentru a asigura că toți cetățenii sunt pregătiți în eventualitatea unei situații de urgență.',
          score: 4.00,
        },
        {
          sentence: 'Monitorizarea continuă a activității vulcanice Mount Agung a permis identificarea timpurie a semnelor de erupție, permițând autorităților să ia măsuri preventive eficiente. Tehnologia avansată și colaborarea internațională au jucat un rol crucial în gestionarea riscurilor asociate acestui vulcan activ.',
          score: 3.95,
        },
      ],
      contradictingSources: [
        {
          source: 'National Geographic România',
          sentence: 'Datele recente prin satelit indică faptul că activitatea Mount Agung\'s a stabilizat, reducând amenințarea imediată a erupției și liniștind îngrijorările legate de evacuări.',
          score: 4.50,
        },
        {
          source: 'Ziarul Financiar',
          sentence: 'Contrar unor zvonuri, vulcanul Mount Agung nu prezintă semne iminente de erupție, iar autoritățile confirmă că situația este sub control.',
          score: 4.25,
        },
        {
          source: 'HotNews.ro',
          sentence: 'Analizele geologice recente sugerează că Mount Agung este într-o fază de repaus, iar riscul unei erupții majore este considerabil redus.',
          score: 4.10,
        },
        {
          source: 'Realitatea TV',
          sentence: 'Sursele oficiale confirmă că Mount Agung nu prezintă semne de activitate intensificată, iar populația din Clujul rămâne în siguranță.',
          score: 4.00,
        },
        {
          source: 'G4Media',
          sentence: 'Vulcanul Mount Agung își menține stabilitatea geologică, iar autoritățile nu estimează necesară măsuri suplimentare de evacuare în momentul de față.',
          score: 3.90,
        },
      ],
    },
    // Poți adăuga mai multe prompturi după necesitate
  };

  // Funcție pentru a selecta datele în funcție de query-uri
  const getDataForQueries = (queries) => {
    const lowerCaseQueries = queries.map(q => q.toLowerCase());
    const selectedData = [];

    lowerCaseQueries.forEach(query => {
      // Verifică dacă query-ul include termeni specifici pentru fiecare prompt
      if (query.includes('ophelia') || query.includes('furtună ophelia') || query.includes('impactul furtunii ophelia')) {
        selectedData.push(data.ophelia);
      }
      if (query.includes('mount agung') || query.includes('vulcan mount agung') || query.includes('erupție mount agung')) {
        selectedData.push(data.mountagung);
      }
      // Adaugă alte condiții după necesitate
    });

    return selectedData;
  };

  const selectedDatas = getDataForQueries(queries);

  if (selectedDatas.length === 0) {
    return (
      <div className="similar-contradicting-list">
        <p>Nu au fost găsite rezultate valide.</p>
      </div>
    );
  }

  return (
    <div className="similar-contradicting-list">
      {selectedDatas.map((selectedData, idx) => (
        <div key={idx} className="prompt-section">
          <h2 className="prompt-title">{selectedData.prompt}</h2>
          <div className="columns-container">
            <div className="column similar-column">
              <h3>Top 5 Știri Similare</h3>
              {selectedData.similarSentences.map((sim, index) => (
                <SentenceItem
                  key={index}
                  sentence={sim.sentence}
                  score={sim.score}
                  searchWords={selectedData.searchWords}
                />
              ))}
            </div>
            <div className="column contradicting-column">
              <h3>Surse Contrazicătoare</h3>
              {selectedData.contradictingSources.map((contr, index) => (
                <ContradictingSourceItem
                  key={index}
                  source={contr.source}
                  sentence={contr.sentence}
                  score={contr.score}
                  searchWords={selectedData.searchWords}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SentenceItem = ({ sentence, score, searchWords }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSeeMore = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLength = 300; // Poți ajusta după necesitate
  const isLong = sentence.length > maxLength;
  const displayedSentence = isExpanded || !isLong ? sentence : sentence.slice(0, maxLength) + '...';

  // Calculăm numărul de stele
  const starCount = Math.round(score);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < starCount) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else {
      stars.push(<FaStar key={i} className="star" />);
    }
  }

  return (
    <div className="sentence-item">
      <div className="stars">
        {stars}
      </div>
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={displayedSentence}
      />
      {isLong && (
        <button className="see-more-button" onClick={toggleSeeMore}>
          {isExpanded ? 'Vezi mai puțin' : 'Vezi mai mult'}
        </button>
      )}
      <p className="score">Scor: {score.toFixed(2)}</p>
    </div>
  );
};

const ContradictingSourceItem = ({ source, sentence, score, searchWords }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSeeMore = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLength = 200; // Poți ajusta după necesitate
  const isLong = sentence.length > maxLength;
  const displayedSentence = isExpanded || !isLong ? sentence : sentence.slice(0, maxLength) + '...';

  // Calculăm numărul de stele
  const starCount = Math.round(score);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < starCount) {
      stars.push(<FaStar key={i} className="star filled" />);
    } else {
      stars.push(<FaStar key={i} className="star" />);
    }
  }

  return (
    <div className="sentence-item">
      <div className="stars">
        {stars}
      </div>
      <p className="source-name">{source}:</p>
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={displayedSentence}
      />
      {isLong && (
        <button className="see-more-button" onClick={toggleSeeMore}>
          {isExpanded ? 'Vezi mai puțin' : 'Vezi mai mult'}
        </button>
      )}
      <p className="score">Scor: {score.toFixed(2)}</p>
    </div>
  );
};

SimilarContradictingList.propTypes = {
  queries: PropTypes.arrayOf(PropTypes.string).isRequired,
};

SentenceItem.propTypes = {
  sentence: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ContradictingSourceItem.propTypes = {
  source: PropTypes.string.isRequired,
  sentence: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SimilarContradictingList;
