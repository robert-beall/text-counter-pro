class App {
  /**
   * Constructor establishes required DOM elements and records
   * any that are not found.
   */
  constructor() {
    const elementIdList = [
      "text-input",
      "word-count",
      "char-count",
      "char-no-space-count",
      "sentence-count",
      "paragraph-count",
      "reading-time",
      "paste-btn",
      "clear-btn",
      "word-frequency-chart",
      "frequency-toggle",
      "unique-word-count",
    ];

    this.elements = {};
    this.missingElements = [];

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
  init() {
    if (!this.isReady()) {
      console.error("Cannot initialize app: missing required DOM elements");
      /*
       * Additional error logic.
       */
      return false;
    }

    console.log("App initialized successfully");

    const textInput = this.getElement("text-input");
    const pasteBtn = this.getElement("paste-btn");
    const clearBtn = this.getElement("clear-btn");

    if (textInput) {
      textInput.value = "";
      textInput.addEventListener("input", this.handleInput.bind(this));
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
    return this.missingElements.length === 0;
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
   * @param event to handle
   */

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

      if (clearBtn) {
        if (text) {
          clearBtn.removeAttribute("disabled");
        } else {
          clearBtn.setAttribute("disabled", true);
        }
      }

      /* Cheap calculations */
      this.calculateCharCount(text);
      this.calculateCharCountNoSpaces(text);
      this.calculateReadingTime(text);

      /* Debounce heavier operations */
      this.mediumLoadAnalysis(text);
    } catch (e) {
      console.error("Error handling input:", e);
    }
  }

  handleClear() {
    const clearBtn = this.getElement("clear-btn");
    const textInput = this.getElement("text-input");

    if (textInput) {
      textInput.value = "";
    }

    if (clearBtn) {
      clearBtn.setAttribute("disabled", true);
    }

    this.resetStatistics();
    this.clearWordFrequencyChart();
  }

  async handlePaste() {
    const pasteBtn = this.getElement("paste-btn");
    const textInput = this.getElement("text-input");

    if (pasteBtn && textInput) {
      try {
        const text = await navigator.clipboard.readText();
        textInput.value += text;
      } catch (e) {
        console.error("Cannot paste user content:", e);
      }
    }
  }

  resetStatistics() {
    const charCount = this.getElement("char-count");
    const charNoSpaceCount = this.getElement("char-no-space-count");
    const wordCount = this.getElement("word-count");
    const sentenceCount = this.getElement("sentence-count");
    const paragraphCount = this.getElement("paragraph-count");
    const readingTime = this.getElement("reading-time");

    if (charCount) {
      charCount.textContent = "0";
    }

    if (charNoSpaceCount) {
      charNoSpaceCount.textContent = "0";
    }

    if (wordCount) {
      wordCount.textContent = "0";
    }

    if (sentenceCount) {
      sentenceCount.textContent = "0";
    }

    if (paragraphCount) {
      paragraphCount.textContent = "0";
    }

    if (readingTime) {
      readingTime.textContent = "0s";
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
   * Calculates the number of words in the passed text and
   * displays the value in the 'word-count' element.
   *
   * @param {*} text input by user
   */
  calculateWordCount(text) {
    const wordCount = this.getElement("word-count");

    if (wordCount) {
      wordCount.textContent = text
        .trim()
        .split(/\s+/g)
        .filter((w) => w.length > 0)
        .length.toLocaleString();
    }
  }

  /**
   * Calculates the number of characters in the passed text and
   * displays the value in the 'char-count' element.
   *
   * @param {*} text input by user
   */
  calculateCharCount(text) {
    const charCount = this.getElement("char-count");

    if (charCount) {
      charCount.textContent = text.length.toLocaleString();
    }
  }

  /**
   * Calculates the number of sentences in the passed text, excluding
   * most common abbreviations from consideration, displaying the value
   * in the 'sentence-count' element.
   *
   * @param {*} text input by user
   */
  calculateSentenceCount(text) {
    const sentenceCount = this.getElement("sentence-count");

    if (sentenceCount) {
      // Common abbreviations that shouldn't end sentences
      const abbreviations = new Set([
        "mr",
        "mrs",
        "ms",
        "dr",
        "prof",
        "sr",
        "jr",
        "vs",
        "etc",
        "inc",
        "ltd",
        "corp",
        "co",
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
        "i.e",
        "e.g",
        "cf",
        "al",
        "approx",
      ]);

      let sentences = text
        .trim()
        .split(/[.!?]/g)
        .filter((s) => s.length > 0);

      const validSentences = [];

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];

        const words = sentence.split(/\s+/);
        const lastWord = words[words.length - 1]?.toLowerCase();

        if (abbreviations.has(lastWord) && i < sentences.length - 1) {
          sentences[i + 1] = sentence + ". " + sentences[i + 1];

          continue;
        }

        validSentences.push(sentence);
      }

      sentenceCount.textContent = validSentences.length.toLocaleString();
    }
  }

  /**
   * Calculates the number of paragraphs in the passed text and displays
   * it in the 'paragraph-count' element.
   *
   * @param {*} text input by user
   */
  calculateParagraphCount(text) {
    const paragraphCount = this.getElement("paragraph-count");

    if (paragraphCount) {
      paragraphCount.textContent = text
        .split(/\n\s*/)
        .filter((p) => p.trim())
        .length.toLocaleString();
    }
  }

  /**
   * Calculates the estimated reading time for the passed text and displays
   * it in the 'reading-time' element.
   *
   * @param {*} text input by user
   * @param {*} wordsPerMinute optional parameter for more personalized calculation
   */
  calculateReadingTime(text, wordsPerMinute = 250) {
    const readingTime = this.getElement("reading-time");

    if (readingTime) {
      const wordCount = text.trim().split(/\s+/).length;
      const totalMinutes = wordCount / wordsPerMinute;

      const minutes = Math.floor(totalMinutes);
      const seconds = Math.round((totalMinutes - minutes) * 60);

      // Format display text
      let displayText;
      if (minutes === 0) {
        displayText = seconds <= 30 ? "< 1 min read" : "1 min read";
      } else if (minutes === 1 && seconds === 0) {
        displayText = "1 min read";
      } else if (seconds === 0) {
        displayText = `${minutes} min read`;
      } else {
        displayText = `${minutes + 1} min read`; // Round up for user experience
      }

      readingTime.textContent = `${minutes}m ${seconds}s`;
    }
  }

  calculateWordFrequency(text) {
    const wordFrequencies = {};

    const words = text.toLowerCase().match(/\b\w+(?:'\w+)?\b/g);

    if (!words || words.length === 0) {
      // Clear the chart if no words
      this.clearWordFrequencyChart();
      return;
    }

    words.forEach((w) => {
      if (w in wordFrequencies) {
        wordFrequencies[w] += 1;
      } else {
        wordFrequencies[w] = 1;
      }
    });

    const orderedList = Object.keys(wordFrequencies);

    const sortedEntries = Object.entries(wordFrequencies).sort(
      (a, b) => b[1] - a[1]
    );

    /** Add new logic here. */

    // Update unique word count
    const uniqueWordCountElement = this.getElement("unique-word-count");
    uniqueWordCountElement.textContent = orderedList.length;

    // Get chart container and toggle button
    const chartContainer = this.getElement("word-frequency-chart");
    const toggleButton = this.getElement("frequency-toggle");

    // Clear existing chart content
    chartContainer.innerHTML = "";

    // Create bars container
    const barsContainer = document.createElement("div");
    barsContainer.className = "frequency-bars collapsed";
    barsContainer.id = "frequency-bars";

    // Find the maximum frequency for scaling bars
    const maxFrequency = sortedEntries.length > 0 ? sortedEntries[0][1] : 1;

    // Create frequency bars for each word
    sortedEntries.forEach(([word, count], index) => {
      const barItem = document.createElement("div");
      barItem.className = "frequency-bar-item";

      // Calculate bar width as percentage of max frequency
      const barWidth = (count / maxFrequency) * 100;

      barItem.innerHTML = `
            <div class="frequency-word">${word}</div>
            <div class="frequency-bar-container">
                <div class="frequency-bar" style="width: ${barWidth}%">
                    <span class="frequency-count">${count}</span>
                </div>
            </div>
        `;

      barsContainer.appendChild(barItem);
    });

    chartContainer.appendChild(barsContainer);

    // Show/hide toggle button based on number of words
    if (sortedEntries.length > 8) {
      toggleButton.style.display = "flex";

      // Set up toggle functionality
      toggleButton.onclick = () => {
        const isExpanded = barsContainer.classList.contains("expanded");

        if (isExpanded) {
          barsContainer.classList.remove("expanded");
          barsContainer.classList.add("collapsed");
          toggleButton.classList.remove("expanded");
          toggleButton.querySelector(".toggle-text").textContent = "Show All";
          toggleButton.setAttribute("aria-label", "Show all words");
        } else {
          barsContainer.classList.remove("collapsed");
          barsContainer.classList.add("expanded");
          toggleButton.classList.add("expanded");
          toggleButton.querySelector(".toggle-text").textContent = "Show";
          toggleButton.setAttribute("aria-label", "Show fewer words");
        }
      };
    } else {
      toggleButton.style.display = "none";
      barsContainer.classList.add("expanded"); // Show all bars if 8 or fewer
    }
  }

  // Helper method to clear the word frequency chart
  clearWordFrequencyChart() {
    const chartContainer = this.getElement("word-frequency-chart");
    const toggleButton = this.getElement("frequency-toggle");
    const uniqueWordCountElement = this.getElement("unique-word-count");

    // Reset unique word count
    uniqueWordCountElement.textContent = "0";

    // Hide toggle button
    toggleButton.style.display = "none";

    // Show placeholder
    chartContainer.innerHTML = `
        <div class="chart-placeholder">
            <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 14l2-2 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p>Enter text above to see word frequency analysis</p>
        </div>
    `;
  }

  /**
   * Calculates the number of non-whitespace characters in the passed text and
   * displays the value in the 'char-no-space-count' element.
   *
   * @param {*} text input by user
   */
  calculateCharCountNoSpaces(text) {
    const charNoSpaceCount = this.getElement("char-no-space-count");

    if (charNoSpaceCount) {
      charNoSpaceCount.textContent = text
        .trim()
        .replace(/\s/g, "")
        .length.toLocaleString();
    }
  }

  /**
   * Debounced function for running slightly resource-intensive operations while preserving user
   * performance.
   */
  mediumLoadAnalysis = this.debounce((text) => {
    this.calculateWordCount(text);
    this.calculateSentenceCount(text);
    this.calculateParagraphCount(text);
  }, 100);

  /**
   * Debounced function for running heavier resource-intensive operations while preserving user
   * performance.
   */
  heavyLoadAnalysis = this.debounce((text) => {
    this.calculateWordFrequency(text);
  }, 300);
}

(() => {
  const appInstance = new App();
  appInstance.init();
})();
