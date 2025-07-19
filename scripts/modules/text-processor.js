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
 * Count special characters in the passed text string, excluding letters, numbers, spaces, and punctuation.
 *
 * @param {*} text - string
 * @returns number
 */
export const getSpecialCharCount = (text) => {
  // Exclude letters, numbers, spaces, and common punctuation
  // Match any character that is NOT a letter, digit, whitespace, or punctuation
  // Punctuation: . , ; : ! ? ' " ( ) [ ] { } - _
  return (text.match(/[^a-zA-Z0-9\s.,;:!?'"()[\]{}\-_]/g) || []).length;
}

/** 
 * Get the number of letters (both uppercase and lowercase) in the passed text string.
 * @param {*} text - string
 * @returns number
 */
export const getLettersCharCount = (text) => {
  // Count letters (both uppercase and lowercase)
  return (text.match(/[a-zA-Z]/g) || []).length;
}

/**
 * Get the number of uppercase characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getUpperCaseCharCount = (text) => {
  // Count uppercase letters
  return (text.match(/[A-Z]/g) || []).length;
}

/**
 * Get the number of lowercase characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getLowerCaseCharCount = (text) => {
  // Count lowercase letters
  return (text.match(/[a-z]/g) || []).length;
}

/**
 * Get the number of numeric characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getNumbersCharCount = (text) => {
  // Count digits
  return (text.match(/\d/g) || []).length;
}

/** 
 * Get the number of whitespace characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getWhitespaceCharCount = (text) => {
  // Count whitespace characters (spaces, tabs, newlines)
  return (text.match(/\s/g) || []).length;
}

/** 
 * Get the number of space characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getSpaceCharCount = (text) => {
  // Count space characters specifically
  return (text.match(/ /g) || []).length;
}

/**
 * Get the number of tab characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getTabCharCount = (text) => {
  // Count tab characters specifically
  return (text.match(/\t/g) || []).length;
}

/**
 * Get the number of newline characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getNewLineCharCount = (text) => {
  // Count newline characters specifically
  return (text.match(/\n/g) || []).length;
}

/**
 * Get the number of punctuation characters in the passed text string.
 * @param {*} text - string
 * @returns number
 */
export const getPunctuationCharCount = (text) => {
  // Count punctuation characters (.,;:!?'"()[]{}-)
  return (text.match(/[.,;:!?'"()[\]{}-]/g) || []).length;
}

/** 
 * Get the number of emoji characters in the passed text string.
 * This function uses a regex pattern that matches a wide range of emoji characters.
 * Note: This may not cover all emojis, especially newer ones, as Unicode is constantly evolving.
 * @param {*} text - string
 * @returns number
 */
export const getEmojiCharCount = (text) => {
  // Count emoji characters using Unicode ranges
  return (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[^\w\s.,!?;:'"()\-_]/gu) || []).length;
}

/**
 * Get the number of vowel characters in the passed text string.
 *
 * @param {*} text - string
 * @returns number
 */
export const getVowelCharCount = (text) => {
  // Count vowels (both uppercase and lowercase)
  // Count vowels (A, E, I, O, U, and Y/y when used as a vowel)
  // Treat 'y' as a vowel when it is not at the start of a word and is surrounded by non-vowels
  const matches = text.match(/[aeiouAEIOU]/g) || [];
  // Match 'y' or 'Y' as a vowel: not at the start of a word and not surrounded by vowels
  const yMatches = text.match(/(?<!\b)[yY](?![aeiouAEIOU])/g) || [];
  return matches.length + yMatches.length;
}

/**
 * Get the number of consonant characters in the passed text string.
 * @param {*} text - string
 * @returns number
 */
export const getConsonantCharCount = (text) => {
  // Count consonants (both uppercase and lowercase), including 'Y'/'y' only when used as a consonant
  // 'Y' is a consonant when at the start of a word or when surrounded by vowels
  // First, count all consonant letters except 'Y'/'y'
  const consonantMatches = text.match(/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/g) || [];
  // Now, count 'Y'/'y' as consonant: at the start of a word or after a vowel
  const yConsonantMatches = text.match(/\b[yY]|[aeiouAEIOU][yY]/g) || [];
  return consonantMatches.length + yConsonantMatches.length;
}

/**
 * Get the number of ASCII characters in the passed text string.
 * @param {*} text - string
 * @returns number
 */
export const getAsciiCharCount = (text) => {
  // Count ASCII characters (0-127)
  return (text.match(/[\x00-\x7F]/g) || []).length;
}

/**  
 * Get the number of non-ASCII characters in the passed text string.
 * Non-ASCII characters are those with a code point of 128 or higher.
 * @param {*} text - string
 * @returns number
 */
export const getNonAsciiCharCount = (text) => {
  // Count non-ASCII characters (128 and above)
  return (text.match(/[^\x00-\x7F]/g) || []).length;
}

/**
 * Get a breakdown of special characters in the passed text string.
 * @param {*} text - string
 * @returns {Object} - breakdown of special character counts
 */
export const getSpecialCharCountBreakdown = (text) => {
  const numbers = (text.match(/\d/g) || []).length;
  const punctuation = (text.match(/[.,;:!?'"()[\]{}-]/g) || []).length;
  const symbols = (text.match(/[^a-zA-Z\d\s.,;:!?'"()[\]{}-]/g) || []).length;

  return {
    total: numbers + punctuation + symbols,
    numbers: numbers,
    punctuation: punctuation,
    symbols: symbols
  };
}

/**
 * Get a list of words in the passed text string.
 *
 * @param {*} text - string
 * @returns string[]
 */
export const getWords = (text) => {
  return text.match(/(?:\b|\\.)\w[\w.'-]*(?=\b|\\.|$)/gi) || [];
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
  if (!wordsPerMinute || +wordsPerMinute === 0) {
    return "0m 0s"; // avoid divide-by-zero infinity NaN display
  }

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

  const words = getWords(text.toLowerCase());
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
 * Calculate the average number of characters per word in the passed
 * text string. 
 * 
 * @param {*} text - string 
 * @returns number (float)
 */
export const getAverageWordsPerSentence = (text) => text.trim().length > 0 ? getWordCount(text) / getSentenceCount(text) : 0;

/**
 * Calculate the average number of characters per word in the passed
 * text string. 
 * 
 * @param {*} text - string 
 * @returns number (float)
 */
export const getAverageCharsPerWord = (text) => text.trim().length > 0 && getWordCount(text) > 0 ? getCharCountNoSpaces(text) / getWordCount(text) : 0;

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

export const getPassiveVoicePercentage = (text) => {
  if (!text || typeof text !== 'string') return 0;
  
  const sentences = getSentences(text);
  if (sentences.length === 0) return 0;
  
  let passiveCount = 0;
  
  // Common auxiliary verbs used in passive voice
  const auxiliaryVerbs = [
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have been', 'has been', 'had been', 'will be', 'would be',
    'can be', 'could be', 'may be', 'might be', 'must be',
    'should be', 'shall be', 'ought to be'
  ];
  
  // Common past participle endings for regular verbs
  const pastParticipleEndings = ['ed', 'en', 'ne', 'wn', 'nt'];
  
  // Irregular past participles (common ones)
  const irregularPastParticiples = [
    'done', 'gone', 'taken', 'given', 'seen', 'known', 'shown',
    'written', 'spoken', 'broken', 'chosen', 'frozen', 'stolen',
    'beaten', 'eaten', 'fallen', 'forgotten', 'hidden', 'ridden',
    'risen', 'driven', 'thrown', 'grown', 'blown', 'flown',
    'drawn', 'worn', 'torn', 'born', 'sworn', 'cut', 'hit',
    'put', 'shut', 'hurt', 'set', 'let', 'bet', 'cost',
    'burst', 'cast', 'split', 'spread', 'read', 'led', 'fed',
    'held', 'told', 'sold', 'built', 'sent', 'spent', 'lent',
    'bent', 'kept', 'slept', 'wept', 'swept', 'felt', 'dealt',
    'meant', 'learnt', 'burnt', 'heard', 'made', 'paid', 'laid',
    'said', 'stood', 'understood', 'found', 'bound', 'wound',
    'hung', 'sung', 'rung', 'won', 'run', 'begun', 'come',
    'become', 'overcome', 'brought', 'bought', 'thought',
    'fought', 'caught', 'taught', 'sought', 'wrought'
  ];
  
  const cleanWord = (word) => {
    return word.replace(/[^\w]/g, '').toLowerCase();
  };
  
  sentences.forEach(sentence => {
    const words = getWords(sentence.toLowerCase()).map(cleanWord).filter(w => w.length > 0);
    if (words.length < 2) return;
    
    let hasAuxiliary = false;
    let auxiliaryIndex = -1;
    
    // Check for auxiliary verbs
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Check single word auxiliaries
      if (auxiliaryVerbs.includes(word)) {
        hasAuxiliary = true;
        auxiliaryIndex = i;
        break;
      }
      
      // Check multi-word auxiliaries
      if (i < words.length - 1) {
        const twoWords = `${word} ${words[i + 1]}`;
        if (auxiliaryVerbs.includes(twoWords)) {
          hasAuxiliary = true;
          auxiliaryIndex = i;
          break;
        }
      }
      
      if (i < words.length - 2) {
        const threeWords = `${word} ${words[i + 1]} ${words[i + 2]}`;
        if (auxiliaryVerbs.includes(threeWords)) {
          hasAuxiliary = true;
          auxiliaryIndex = i;
          break;
        }
      }
    }
    
    if (!hasAuxiliary) return;
    
    // Look for past participle after auxiliary verb
    let hasPastParticiple = false;
    
    for (let i = auxiliaryIndex + 1; i < words.length; i++) {
      const word = words[i];
      
      // Skip adverbs and common words that might appear between auxiliary and participle
      if (['not', 'never', 'always', 'often', 'usually', 'sometimes', 
           'frequently', 'rarely', 'seldom', 'already', 'still', 'just',
           'recently', 'finally', 'completely', 'totally', 'fully',
           'partially', 'briefly', 'quickly', 'slowly', 'carefully',
           'properly', 'correctly', 'incorrectly', 'well', 'badly'].includes(word)) {
        continue;
      }
      
      // Check if word is a past participle
      if (irregularPastParticiples.includes(word)) {
        hasPastParticiple = true;
        break;
      }
      
      // Check for regular past participle endings
      for (const ending of pastParticipleEndings) {
        if (word.endsWith(ending) && word.length > ending.length) {
          // Additional check to avoid false positives
          if (ending === 'ed' && word.length > 3) {
            hasPastParticiple = true;
            break;
          } else if (ending !== 'ed' && word.length > 2) {
            hasPastParticiple = true;
            break;
          }
        }
      }
      
      if (hasPastParticiple) break;
      
      // If we hit a verb that's not a past participle, it's likely not passive
      if (word.match(/^(to|will|would|can|could|may|might|must|should|shall)$/)) {
        break;
      }
      
      // Stop searching after a reasonable distance
      if (i - auxiliaryIndex > 5) break;
    }
    
    if (hasPastParticiple) {
      passiveCount++;
    }
  });
  
  // Calculate percentage
  const percentage = (passiveCount / sentences.length) * 100;
  return Math.round(percentage * 100) / 100; // Round to 2 decimal places
};

export const getPassiveVoiceDescription = (text) => {
  const percentage = getPassiveVoicePercentage(text);
  
  if (percentage === 0) return "Not Passive";
  if (percentage <= 5) return "Minimal Passivity";
  if (percentage <= 10) return "Low Passivity";
  if (percentage <= 15) return "Moderate Passivity";
  if (percentage <= 25) return "High Passivity";
  if (percentage <= 35) return "Very High Passivity";
  return "Excessive Passivity";
};

export const getPassiveVoiceExtendedDescription = (text) => {
  const percentage = getPassiveVoicePercentage(text);
  
  if (percentage === 0) {
    return "This text contains no passive voice constructions, demonstrating excellent active voice usage. Active voice creates direct, clear sentences where the subject performs the action, making your writing more engaging and easier to follow. This approach helps readers immediately understand who is responsible for each action, creating stronger, more confident prose.";
  }
  
  if (percentage <= 5) {
    return "This text uses passive voice very sparingly, which represents optimal writing practice. With minimal passive voice usage, your writing maintains strong clarity and directness while occasionally using passive constructions where they serve a specific purpose. This balance creates engaging, readable content that keeps readers focused on the action and actors involved.";
  }
  
  if (percentage <= 10) {
    return "This text demonstrates good passive voice control with low usage that supports readability. Active voice dominates your writing, creating clear, direct sentences that engage readers effectively. The occasional passive voice likely serves specific purposes, such as emphasizing the action over the actor or maintaining flow between sentences. This level maintains strong reader engagement.";
  }
  
  if (percentage <= 15) {
    return "This text shows moderate passive voice usage that begins to impact readability. While still within acceptable ranges for most writing contexts, you may want to review passive constructions to ensure they serve specific purposes. Converting some passive sentences to active voice would create more direct, engaging prose and help readers more easily identify who is performing each action.";
  }
  
  if (percentage <= 25) {
    return "This text contains high levels of passive voice that likely reduce readability and reader engagement. Passive constructions can make writing feel indirect, wordy, and sometimes unclear about who is responsible for actions. Consider revising many of these passive sentences to active voice to create stronger, more direct communication that better connects with your audience.";
  }
  
  if (percentage <= 35) {
    return "This text exhibits very high passive voice usage that significantly impacts clarity and engagement. Excessive passive voice creates distance between readers and the content, often making writing feel academic, indirect, or evasive. Substantial revision toward active voice would dramatically improve readability, making your writing more compelling and easier to understand.";
  }
  
  return "This text contains excessive passive voice that severely hampers readability and engagement. Such heavy reliance on passive constructions creates wordy, indirect prose that obscures responsibility and action. Readers may struggle to follow your meaning and lose interest due to the indirect style. Comprehensive revision focusing on active voice construction would transform this text into clear, engaging communication.";
};