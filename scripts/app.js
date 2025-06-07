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
      "avg-words-sentence",
      "avg-chars-word",
      "paste-btn",
      "clear-btn",
      "word-frequency-chart",
      "frequency-toggle",
      "unique-word-count",
    ];

    this.elements = {};
    this.missingElements = [];
    this.readabilityModule = null;

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
      this.showReadingTime(text);
      this.showAvgCharsPerWord(text);
      this.showAvgWordsPerSentence(text);

      /* Debounce heavier operations */
      this.mediumLoadAnalysis(text);
      this.heavyLoadAnalysis(text);
    } catch (e) {
      console.error("Error handling input:", e);
    }
  }

  handleClear() {
    const clearBtn = this.getElement("clear-btn");
    const textInput = this.getElement("text-input");

    if (textInput) {
      textInput.value = "";
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
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
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
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
  }, 100);

  /**
   * Debounced function for running heavier resource-intensive operations while preserving user
   * performance.
   */
  heavyLoadAnalysis = this.debounce((text) => {
    this.showWordFrequency(text);
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
      wordCount.textContent = window.textProcessor.getWordCount(text).toLocaleString();
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
      charCount.textContent = window.textProcessor.getCharCount(text).toLocaleString();
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
      charNoSpaceCount.textContent = window.textProcessor.getCharCountNoSpaces(text).toLocaleString();
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
      sentenceCount.textContent = window.textProcessor.getSentenceCount(text).toLocaleString();
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
      paragraphCount.textContent = window.textProcessor.getParagraphCount(text).toLocaleString();
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
      readingTime.textContent = window.textProcessor.getReadingTimeReadable(text);
    }
  }

  showAvgCharsPerWord(text) {
    const avgCharsWord = this.getElement("avg-chars-word");
    
    if (avgCharsWord) {
      avgCharsWord.textContent = window.textProcessor.getAverageCharsPerWord(text).toLocaleString();
    }
  }

  showAvgWordsPerSentence(text) {
    const avgWordsSentence = this.getElement("avg-words-sentence");
    
    if (avgWordsSentence) {
      avgWordsSentence.textContent = window.textProcessor.getAverageWordsPerSentence(text).toLocaleString();
    }
  }

  showWordFrequency(text) {
    const sortedEntries = window.textProcessor.calculateWordFrequency(text);

    if (!sortedEntries || sortedEntries.length === 0) {
      // Clear the chart if no words
      this.clearWordFrequencyChart();
      return;
    }

    const orderedList = sortedEntries.map(([word]) => word);

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
}

(() => {
  const appInstance = new App();
  appInstance.init();
})();
