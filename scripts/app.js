class App {
  /**
   * Constructor establishes required DOM elements and records
   * any that are not found.
   */
  constructor() {
    const elementIdList = [
      "text-input",
      "wpm-input",
      "word-count",
      "char-count",
      "char-no-space-count",
      "sentence-count",
      "paragraph-count",
      "reading-time",
      "readability-score",
      "readability-explanation",
      "grade-level",
      "avg-words-sentence",
      "avg-chars-word",
      "paste-btn",
      "clear-btn",
      "word-frequency-chart",
      "unique-word-count",
    ];

    this.elements = {};
    this.missingElements = [];
    this.readabilityModule = null;

    this.wordFrequency = [];

    elementIdList.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        this.elements[id] = element;
      } else {
        this.missingElements.push(id);
      }
    });

    // Log missing elements for debugging
    if (this.missingElements.length > 0) {
      console.warn("Missing DOM elements:", this.missingElements);
    }
  }

  /**
   * Application initialization logic.
   *
   * @returns boolean
   */
  async init() {
    if (!this.isReady()) {
      console.error("Cannot initialize app: missing required DOM elements");
      /*
       * Additional error logic.
       */
      return false;
    }

    // Load readability library
    // await this.loadReadabilityLibrary();

    console.log("App initialized successfully");

    const textInput = this.getElement("text-input");
    const wpmInput = this.getElement("wpm-input");
    const pasteBtn = this.getElement("paste-btn");
    const clearBtn = this.getElement("clear-btn");

    if (textInput) {
      textInput.value = "";
      textInput.addEventListener("input", this.handleInput.bind(this));
    }

    if (wpmInput) {
      wpmInput.addEventListener("input", this.handleWpmInput.bind(this));
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", this.handleClear.bind(this));
    }

    if (pasteBtn) {
      pasteBtn.addEventListener("click", this.handlePaste.bind(this));
    }

    return true;
  }

  /**
   * Simple helper method to check if application is ready.
   *
   * @returns boolean
   */
  isReady() {
    return this.missingElements.length === 0 && window.textProcessor !== null;
  }

  /**
   * Get a cached DOM element with the passed id parameter.
   *
   * @param {*} id
   * @returns DOM element or null
   */
  getElement(id) {
    if (this.elements[id]) {
      return this.elements[id];
    }

    console.warn(`Element with id="${id} not found in DOM`);
    return null;
  }

  /**
   * Event handler used to call all analysis logic on
   * user input.
   *
   * @param {*} event - user input to handle
   */
  handleInput(event) {
    try {
      const text = event.target.value;
      const clearBtn = this.getElement("clear-btn");
      const wpmInput = this.getElement("wpm-input");

      if (clearBtn) {
        if (text) {
          clearBtn.removeAttribute("disabled");
        } else {
          clearBtn.setAttribute("disabled", true);
        }
      }

      /* Cheap calculations */
      this.showCharCount(text);
      this.showCharCountNoSpaces(text);

      const wpm = wpmInput ? wpmInput.value : 250;

      this.showReadingTime(text, wpm);

      this.showAvgCharsPerWord(text);
      this.showAvgWordsPerSentence(text);

      /* Debounce heavier operations */
      this.mediumLoadAnalysis(text);
      this.heavyLoadAnalysis(text);
    } catch (e) {
      console.error("Error handling input:", e);
    }
  }

  handleWpmInput(event) {
    const textInput = this.getElement("text-input");

    if (!textInput) {
      return;
    }

    const text = textInput.value;
    const wpm = event.target.value;

    this.showReadingTime(text, wpm);
  }

  handleClear() {
    const clearBtn = this.getElement("clear-btn");
    const textInput = this.getElement("text-input");

    if (textInput) {
      textInput.value = "";
      textInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    if (clearBtn) {
      clearBtn.setAttribute("disabled", true);
    }
  }

  async handlePaste() {
    const pasteBtn = this.getElement("paste-btn");
    const textInput = this.getElement("text-input");

    if (pasteBtn && textInput) {
      try {
        const text = await navigator.clipboard.readText();
        textInput.value += text;

        // Trigger the input event to run calculations
        textInput.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (e) {
        console.error("Cannot paste user content:", e);
      }
    }
  }

  /**
   * Debounce function for better performance.
   *
   * @param {*} func to debounce
   * @param {*} timeout before func is called
   * @returns debounced version of passed function for given timeout.
   */
  debounce(func, timeout) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  /**
   * Debounced function for running slightly resource-intensive operations while preserving user
   * performance.
   */
  mediumLoadAnalysis = this.debounce((text) => {
    this.showWordCount(text);
    this.showSentenceCount(text);
    this.showParagraphCount(text);
    this.showReadabilityScore(text);
    this.showGradeLevel(text);
  }, 100);

  /**
   * Debounced function for running heavier resource-intensive operations while preserving user
   * performance.
   */
  heavyLoadAnalysis = this.debounce((text) => {
    this.wordFrequency = window.textProcessor.calculateWordFrequency(text);
    this.showWordFrequency();
  }, 300);

  /**
   * Calculates the number of words in the passed text and
   * displays the value in the 'word-count' element.
   *
   * @param {*} text input by user
   */
  showWordCount(text) {
    const wordCount = this.getElement("word-count");

    if (wordCount) {
      wordCount.textContent = window.textProcessor
        .getWordCount(text)
        .toLocaleString();
    }
  }

  /**
   * Calculates the number of characters in the passed text and
   * displays the value in the 'char-count' element.
   *
   * @param {*} text input by user
   */
  showCharCount(text) {
    const charCount = this.getElement("char-count");

    if (charCount) {
      charCount.textContent = window.textProcessor
        .getCharCount(text)
        .toLocaleString();
    }
  }

  /**
   * Calculates the number of non-whitespace characters in the passed text and
   * displays the value in the 'char-no-space-count' element.
   *
   * @param {*} text input by user
   */
  showCharCountNoSpaces(text) {
    const charNoSpaceCount = this.getElement("char-no-space-count");

    if (charNoSpaceCount) {
      charNoSpaceCount.textContent = window.textProcessor
        .getCharCountNoSpaces(text)
        .toLocaleString();
    }
  }

  /**
   * Calculates the number of sentences in the passed text, excluding
   * most common abbreviations from consideration, displaying the value
   * in the 'sentence-count' element.
   *
   * @param {*} text input by user
   */
  showSentenceCount(text) {
    const sentenceCount = this.getElement("sentence-count");

    if (sentenceCount) {
      sentenceCount.textContent = window.textProcessor
        .getSentenceCount(text)
        .toLocaleString();
    }
  }

  /**
   * Calculates the number of paragraphs in the passed text and displays
   * it in the 'paragraph-count' element.
   *
   * @param {*} text input by user
   */
  showParagraphCount(text) {
    const paragraphCount = this.getElement("paragraph-count");

    if (paragraphCount) {
      paragraphCount.textContent = window.textProcessor
        .getParagraphCount(text)
        .toLocaleString();
    }
  }

  /**
   * Calculates the estimated reading time for the passed text and displays
   * it in the 'reading-time' element.
   *
   * @param {*} text input by user
   * @param {*} wordsPerMinute optional parameter for more personalized calculation
   */
  showReadingTime(text, wordsPerMinute = 250) {
    const readingTime = this.getElement("reading-time");

    if (readingTime) {
      readingTime.textContent = window.textProcessor.getReadingTimeReadable(
        text,
        wordsPerMinute
      );
    }
  }

  showReadabilityScore(text) {
    const readabilityScore = this.getElement("readability-score");
    const readabilityExplanation = this.getElement("readability-explanation");

    if (readabilityScore && readabilityExplanation) {
      if (text.trim().length === 0) {
        readabilityScore.textContent = "0";
        readabilityExplanation.textContent = "Enter text above to analyze reading difficulty and get instant feedback on readability.";
        readabilityScore.classList.remove("text-red-500", "text-orange-500", "text-yellow-500", "text-green-500", "text-primary");
        return;
      }

      const score = window.textReadability.fleschReadingEase(text);
      let explanation = "";

      if (score < 10) {
        explanation = "Extremely difficult to read. Best suited for academic papers, legal documents, or technical literature.";
        readabilityScore.classList.add("text-red-500");
      } else if (score < 30) {
        explanation = "Very difficult to read. Appropriate for scholarly articles, professional journals, and complex technical documentation.";
        readabilityScore.classList.add("text-red-500");
      } else if (score < 50) {
        explanation = "Difficult to read. Suitable for academic textbooks, business reports, and professional communications.";
        readabilityScore.classList.add("text-orange-500");
      } else if (score < 60) {
        explanation = "Somewhat challenging. Good for educational content, news articles, and business writing.";
        readabilityScore.classList.add("text-yellow-500");
      } else if (score < 70) {
        explanation = "Plain English. Ideal for general audiences, web content, and most business communications.";
        readabilityScore.classList.add("text-green-500");
      } else if (score < 80) {
        explanation = "Easy to read. Perfect for marketing copy, blog posts, and content targeting broad audiences.";
        readabilityScore.classList.add("text-green-500");
      } else {
        explanation = "Very easy to read. Excellent for children's content, simple instructions, and maximum accessibility.";
        readabilityScore.classList.add("text-primary");
      }

      readabilityScore.textContent = score.toLocaleString();
      readabilityExplanation.textContent = explanation;
    }
  }

  showGradeLevel(text) {
    const gradeLevel = this.getElement("grade-level");

    if (gradeLevel) {
      if (text.trim().length === 0) {
        gradeLevel.textContent = "N/A";
        return;
      }

      const score = Math.floor(window.textReadability.fleschKincaidGrade(text));

      if (score <= 1) {
        gradeLevel.textContent = "1st Grade or Lower";
      } else if (score > 12) {
        gradeLevel.textContent = "College Level or Higher";
      } else {
        gradeLevel.textContent = `${score}th Grade`;
      }
    }
  }

  showAvgCharsPerWord(text) {
    const avgCharsWord = this.getElement("avg-chars-word");

    if (avgCharsWord) {
      avgCharsWord.textContent = window.textProcessor
        .getAverageCharsPerWord(text)
        .toLocaleString();
    }
  }

  showAvgWordsPerSentence(text) {
    const avgWordsSentence = this.getElement("avg-words-sentence");

    if (avgWordsSentence) {
      avgWordsSentence.textContent = window.textProcessor
        .getAverageWordsPerSentence(text)
        .toLocaleString();
    }
  }

  showWordFrequency(hideStopWords = true, limit = 10) {
    const sortedEntries = hideStopWords ? this.filterStopWords() : this.wordFrequency;

    if (!sortedEntries || sortedEntries.length === 0) {
      this.clearWordFrequencyChart();
      return;
    }

    // Update unique word count
    const uniqueWordCountElement = this.getElement("unique-word-count");
    uniqueWordCountElement.textContent = sortedEntries.length;

    // Get chart container and toggle button
    const chartContainer = this.getElement("word-frequency-chart");

    // Clear existing chart content
    chartContainer.innerHTML = "";

    // Create bars container with improved structure
    const barsContainer = document.createElement("div");
    barsContainer.className = "frequency-bars collapsed";
    barsContainer.id = "frequency-bars";
    barsContainer.setAttribute("role", "list");
    barsContainer.setAttribute("aria-label", "Word frequency chart");

    // Performance: Use DocumentFragment for batch DOM operations
    const fragment = document.createDocumentFragment();

    // Find the maximum frequency for scaling bars
    const maxFrequency = sortedEntries.length > 0 ? sortedEntries[0][1] : 1;
    const totalWords = sortedEntries.reduce((sum, [, count]) => sum + count, 0);

    // Performance: Limit initial render to improve performance
    const initialRenderLimit = limit;
    const itemsToRender = Math.min(sortedEntries.length, initialRenderLimit);

    // Create frequency bars for visible items
    for (let i = 0; i < itemsToRender; i++) {
      const [word, count] = sortedEntries[i];
      const barItem = this.createFrequencyBarItem(
        word,
        count,
        maxFrequency,
        totalWords,
        i
      );
      fragment.appendChild(barItem);
    }

    barsContainer.appendChild(fragment);
    chartContainer.appendChild(barsContainer);
  }

  createFrequencyBarItem(word, count, maxFrequency, totalWords, index) {
    const barItem = document.createElement("div");
    barItem.className = "frequency-bar-item";
    barItem.setAttribute("role", "listitem");
    barItem.style.setProperty("--animation-delay", `${index * 0.05}s`);

    // Calculate bar width and percentage
    const barWidth = (count / maxFrequency) * 100;
    const percentage = ((count / totalWords) * 100).toFixed(1);

    // Escape word for HTML safety
    const safeWord = this.escapeHtml(word);

    barItem.innerHTML = `
      <div class="frequency-word" aria-label="Word: ${safeWord}">${safeWord}</div>
      <div class="frequency-bar-container">
        <div class="frequency-bar" 
             style="width: ${barWidth}%" 
             role="img" 
             aria-label="${safeWord}: ${count} occurrences, ${percentage}% of total">
          <span class="frequency-count" aria-hidden="true">${count}</span>
        </div>
      </div>
      <div class="frequency-percentage" aria-hidden="true">${percentage}%</div>
    `;

    return barItem;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Enhanced helper method to clear the word frequency chart
  clearWordFrequencyChart() {
    const chartContainer = this.getElement("word-frequency-chart");
    const uniqueWordCountElement = this.getElement("unique-word-count");

    // Reset unique word count
    uniqueWordCountElement.textContent = "0";

    // Show enhanced placeholder
    chartContainer.innerHTML = `
      <div class="chart-placeholder">
        <div class="placeholder-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            <path d="M8 14l2-2 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h4>Word Frequency Analysis</h4>
        <p>Enter text above to see which words appear most frequently</p>
      </div>
    `;
  }

  filterStopWords() {
    const stopWords = new Set([
      "a",
      "an",
      "and",
      "are",
      "as",
      "at",
      "be",
      "by",
      "for",
      "from",
      "has",
      "he",
      "in",
      "is",
      "it",
      "its",
      "of",
      "on",
      "that",
      "the",
      "to",
      "was",
      "will",
      "with",
      "be",
      "to",
      "of",
      "and",
      "a",
      "in",
      "that",
      "have",
      "i",
      "it",
      "for",
      "not",
      "on",
      "with",
      "as",
      "you",
      "do",
      "at",
      "this",
      "but",
      "his",
      "by",
      "from",
      "they",
      "we",
      "say",
      "her",
      "she",
      "or",
      "an",
      "will",
      "my",
      "one",
      "all",
      "would",
      "there",
      "their",
      "what",
      "so",
      "up",
      "out",
      "if",
      "about",
      "who",
      "get",
      "which",
      "go",
      "me",
      "when",
      "make",
      "can",
      "like",
      "time",
      "no",
      "just",
      "him",
      "know",
      "take",
      "people",
      "into",
      "year",
      "your",
      "good",
      "some",
      "could",
      "them",
      "see",
      "other",
      "than",
      "then",
      "now",
      "look",
      "only",
      "come",
      "its",
      "over",
      "think",
      "also",
      "work",
      "life",
      "still",
      "should",
      "after",
      "being",
      "made",
      "before",
      "here",
      "through",
      "where",
      "much",
      "way",
      "well",
      "new",
      "want",
      "because",
      "any",
      "these",
      "give",
      "day",
      "most",
      "us",
      "may",
      "say",
      "each",
      "which",
      "she",
      "how",
      "two",
      "more",
      "very",
      "what",
      "know",
      "just",
      "first",
      "get",
      "over",
      "think",
      "where",
      "much",
      "go",
      "good",
      "new",
      "write",
      "our",
      "used",
      "me",
      "man",
      "too",
      "any",
      "day",
      "same",
      "right",
      "look",
      "think",
      "also",
      "around",
      "another",
      "came",
      "three",
      "high",
      "upon",
      "show",
      "again",
      "change",
      "off",
      "went",
      "old",
      "number",
      "great",
      "tell",
      "men",
      "say",
      "small",
      "every",
      "found",
      "still",
      "between",
      "name",
      "should",
      "home",
      "big",
      "give",
      "air",
      "line",
      "set",
      "own",
      "under",
      "read",
      "last",
      "never",
      "us",
      "left",
      "end",
      "why",
      "while",
      "might",
      "next",
      "sound",
      "below",
      "saw",
      "something",
      "thought",
      "both",
      "few",
      "those",
      "always",
      "looked",
      "show",
      "large",
      "often",
      "together",
      "asked",
      "house",
      "don't",
      "world",
      "going",
      "want",
      "school",
      "important",
      "until",
      "form",
      "food",
      "keep",
      "children",
      "feet",
      "land",
      "side",
      "without",
      "boy",
      "once",
      "animal",
      "life",
      "enough",
      "took",
      "sometimes",
      "four",
      "head",
      "above",
      "kind",
      "began",
      "almost",
      "live",
      "page",
      "got",
      "earth",
      "need",
      "far",
      "hand",
      "high",
      "year",
      "mother",
      "light",
      "country",
      "father",
      "let",
      "night",
      "picture",
      "being",
      "study",
      "second",
      "soon",
      "story",
      "since",
      "white",
      "ever",
      "paper",
      "hard",
      "near",
      "sentence",
      "better",
      "best",
      "across",
      "during",
      "today",
      "however",
      "sure",
      "knew",
      "it's",
      "try",
      "told",
      "young",
      "sun",
      "thing",
      "whole",
      "hear",
      "example",
      "heard",
      "several",
      "change",
      "answer",
      "room",
      "sea",
      "against",
      "top",
      "turned",
      "learn",
      "point",
      "city",
      "play",
      "toward",
      "five",
      "himself",
      "usually",
      "money",
      "seen",
      "didn't",
      "car",
      "morning",
      "i'm",
      "body",
      "upon",
      "family",
      "later",
      "turn",
      "move",
      "face",
      "door",
      "cut",
      "done",
      "group",
      "true",
      "leave",
      "color",
      "red",
      "friend",
      "pretty",
      "eat",
      "far",
      "sea",
      "really",
      "open",
    ]);

    const filtered = [];
    for (let i = 0; i < this.wordFrequency.length; i++) {
      const [word, frequency] = this.wordFrequency[i];
      if (!stopWords.has(word.toLowerCase())) {
        filtered.push(this.wordFrequency[i]);
      }
    }
    return filtered;
  }
}

(() => {
  const appInstance = new App();
  appInstance.init();
})();
