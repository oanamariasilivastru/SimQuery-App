// src/utils/synonyms.js

const synonymCache = {};

/**
 * Fetch synonyms for a given word using the Datamuse API.
 * @param {string} word - The word to find synonyms for.
 * @returns {Promise<string[]>} - A promise that resolves to an array of synonyms.
 */
export async function fetchSynonyms(word) {
  const lowerCaseWord = word.toLowerCase();

  // Verifică în cache-ul localStorage
  const cachedSynonyms = localStorage.getItem(`synonyms_${lowerCaseWord}`);
  if (cachedSynonyms) {
    synonymCache[lowerCaseWord] = JSON.parse(cachedSynonyms);
    return synonymCache[lowerCaseWord];
  }

  // Verifică dacă sinonimele sunt deja în cache-ul memoriei
  if (synonymCache[lowerCaseWord]) {
    return synonymCache[lowerCaseWord];
  }

  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${lowerCaseWord}`);
    if (!response.ok) {
      console.error(`Eșec la obținerea sinonimelor pentru "${word}"`);
      return [];
    }
    const data = await response.json();
    const synonyms = data.slice(0, 5).map(item => item.word); // Limitează la 5 sinonime
    // Stochează în cache-ul memoriei și în localStorage
    synonymCache[lowerCaseWord] = synonyms;
    localStorage.setItem(`synonyms_${lowerCaseWord}`, JSON.stringify(synonyms));
    return synonyms;
  } catch (error) {
    console.error(`Eroare la obținerea sinonimelor pentru "${word}":`, error);
    return [];
  }
}
