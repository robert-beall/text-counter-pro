/**
 * Get the number of characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getCharCount = (text) => text.length;

/**
 * Get the number of non-whitespace characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getCharCountNoSpaces = (text) => text.replace(/\s/g, "").length;

/**
 * Get a list of words in the passed text string.
 *
 * @param {*} text - string
 * @returns string[]
 */
export const getWords = (text) => {
  return text
    .trim()
    .split(/\s+/g)
    .filter((w) => w.length > 0);
};

/**
 * Get the number of words in the passed text string.
 *
 * See {@link getWords}
 *
 * @param {*} text - string
 * @returns number
 */
export const getWordCount = (text) => getWords(text).length;

/**
 * Get a list of sentences in the passed text string.
 *
 * @param {*} text - string
 * @returns string[]
 */
export const getSentences = (text) => {
  // Input validation
  if (!text || typeof text !== "string") {
    return [];
  }

  // Expanded abbreviations set with common patterns
  const abbreviations = new Set([
    // Titles
    "mr",
    "mrs",
    "ms",
    "dr",
    "prof",
    "sr",
    "jr",
    "capt",
    "gen",
    "col",
    "maj",
    "lt",
    // Common abbreviations
    "vs",
    "etc",
    "inc",
    "ltd",
    "corp",
    "co",
    "llc",
    "llp",
    // Location abbreviations
    "st",
    "ave",
    "blvd",
    "rd",
    "apt",
    "no",
    "vol",
    "pp",
    "ch",
    "sec",
    "fig",
    "ref",
    // Academic/Scientific
    "i.e",
    "e.g",
    "cf",
    "al",
    "approx",
    "ca",
    "circa",
    "est",
    "max",
    "min",
    // Time/Date
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
    // Units and measurements
    "ft",
    "in",
    "lb",
    "oz",
    "kg",
    "cm",
    "mm",
    "km",
    "mph",
    "rpm",
    // Government/Legal
    "gov",
    "dept",
    "div",
    "assn",
    "org",
    "admin",
  ]);

  // Normalize text: handle multiple whitespace, but preserve structure
  const normalizedText = text.trim().replace(/\s+/g, " ");

  // Enhanced regex that captures the sentence-ending punctuation
  // This handles ellipses (...) and multiple punctuation marks
  const sentenceRegex = /([.!?]+|\.\.\.|…)/g;

  // Split while keeping the delimiters
  const parts = normalizedText
    .split(sentenceRegex)
    .filter((part) => part.trim());

  const sentences = [];
  let currentSentence = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();

    // If this part is punctuation
    if (/^[.!?]+$|^\.\.\.$|^…$/.test(part)) {
      currentSentence += part;

      // Check if we should end the sentence here
      if (shouldEndSentence(currentSentence, abbreviations)) {
        const cleanSentence = currentSentence.trim();
        if (cleanSentence && !isJustPunctuation(cleanSentence)) {
          sentences.push(cleanSentence);
        }
        currentSentence = "";
      } else {
        // Add a space after punctuation if there's more content
        if (i < parts.length - 1) {
          currentSentence += " ";
        }
      }
    } else {
      // This part is text content
      if (currentSentence && !currentSentence.endsWith(" ")) {
        currentSentence += " ";
      }
      currentSentence += part;
    }
  }

  // Handle any remaining content
  if (currentSentence.trim() && !isJustPunctuation(currentSentence.trim())) {
    sentences.push(currentSentence.trim());
  }

  return sentences;
};

/**
 * Get the number of sentences in the passed text string.
 *
 * See {@link getSentences}
 *
 * @param {*} text - string
 * @returns number
 */
export const getSentenceCount = (text) => getSentences(text).length;

/**
 * Get a list of paragraphs in the passed text string.
 *
 * @param {*} text - string
 * @returns string[]
 */
export const getParagraphs = (text) =>
  text.split(/\n\s*/).filter((p) => p.trim());

/**
 * Get the number of paragraphs in the passed text string.
 *
 * @param {*} text - string
 * @returns string[]
 */
export const getParagraphCount = (text) => getParagraphs(text).length;

/**
 * Calculate the total minutes it will take to read the passed text string given
 * a wordsPerMinute rate.
 *
 * @param {*} text - string
 * @param {*} wordsPerMinute - number
 * @returns number (float)
 */
export const calculateReadingTime = (text, wordsPerMinute = 250) =>
  getWordCount(text) / wordsPerMinute;

/**
 * Return a more readable representation of the calculated reading time of the passed
 * text string for a given wordsPerMinute rate.
 *
 * See {@link calculateReadingTime}
 *
 * @param {*} text - string
 * @param {*} wordsPerMinute - number
 * @returns string
 */
export const getReadingTimeReadable = (text, wordsPerMinute = 250) => {
  const totalTime = calculateReadingTime(text, wordsPerMinute);

  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let days = 0;

  minutes = Math.floor(totalTime);
  seconds = Math.round((totalTime - minutes) * 60);

  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes - hours * 60;
  }

  if (hours >= 24) {
    days = Math.floor(hours / 24);
    hours = minutes - days * 24;
  }

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
};

/**
 * Calculate the frequency of words in the passed text string.
 * 
 * @param {*} text - string
 * @returns object[]
 */
export const calculateWordFrequency = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const words = text.toLowerCase().match(/\b\w+(?:'\w+)?\b/g);
  if (!words || words.length === 0) {
    return [];
  }

  const wordFrequencies = new Map();

  for (const word of words) {
    wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1);
  }

  return Array.from(wordFrequencies.entries()).sort((a, b) => b[1] - a[1]);
};

/**
 * Helper function to determine if we should end a sentence.
 *
 * @param {*} sentence - string
 * @param {*} abbreviations - set
 * @returns boolean
 */
const shouldEndSentence = (sentence, abbreviations) => {
  // Handle ellipses - these typically end sentences
  if (sentence.endsWith("...") || sentence.endsWith("…")) {
    return true;
  }

  // Handle exclamation and question marks - these always end sentences
  if (/[!?]$/.test(sentence)) {
    return true;
  }

  // For periods, check for abbreviations
  if (sentence.endsWith(".")) {
    const words = sentence.replace(/[.!?]+$/, "").split(/\s+/);
    const lastWord = words[words.length - 1];

    if (!lastWord) return true;

    const cleanLastWord = lastWord.toLowerCase().replace(/[^a-z]/g, "");

    // Check if it's a known abbreviation
    if (abbreviations.has(cleanLastWord)) {
      return false;
    }

    // Check for patterns that suggest abbreviations
    // Single letter followed by period (A. B. C.)
    if (/^[a-z]$/i.test(cleanLastWord)) {
      return false;
    }

    // Common abbreviation patterns (2-4 letters, all caps in original)
    if (lastWord.length <= 4 && /^[A-Z]+$/.test(lastWord)) {
      return false;
    }

    // Check for numbered items (1. 2. etc.)
    if (/^\d+$/.test(cleanLastWord)) {
      return false;
    }

    return true;
  }

  return false;
};

/**
 * Helper function to check if string is just punctuation.
 *
 * @param {*} str - string
 * @returns boolean
 */
const isJustPunctuation = (str) => {
  return /^[.!?…\s]+$/.test(str);
};
