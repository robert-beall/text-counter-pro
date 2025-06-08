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

  showWordFrequency(text) {
    const sortedEntries = window.textProcessor.calculateWordFrequency(text);

    if (!sortedEntries || sortedEntries.length === 0) {
      this.clearWordFrequencyChart();
      return;
    }

    // Update unique word count
    const uniqueWordCountElement = this.getElement("unique-word-count");
    uniqueWordCountElement.textContent = sortedEntries.length;

    // Get chart container and toggle button
    const chartContainer = this.getElement("word-frequency-chart");
    const toggleButton = this.getElement("frequency-toggle");

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
    const initialRenderLimit = 50;
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

    // Enhanced toggle functionality for large datasets
    this.setupToggleButton(
      toggleButton,
      barsContainer,
      sortedEntries,
      maxFrequency,
      totalWords,
      itemsToRender
    );
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

  setupToggleButton(
    toggleButton,
    barsContainer,
    sortedEntries,
    maxFrequency,
    totalWords,
    currentlyRendered
  ) {
    if (sortedEntries.length <= 8) {
      toggleButton.style.display = "none";
      barsContainer.classList.add("expanded");
      return;
    }

    toggleButton.style.display = "flex";
    const remainingCount = sortedEntries.length - currentlyRendered;

    // Update button text with count
    this.updateToggleButtonText(toggleButton, false, remainingCount);

    let isExpanded = false;
    let allItemsRendered = currentlyRendered >= sortedEntries.length;

    toggleButton.onclick = () => {
      if (!isExpanded && !allItemsRendered) {
        // Lazy load remaining items
        this.renderRemainingItems(
          barsContainer,
          sortedEntries,
          maxFrequency,
          totalWords,
          currentlyRendered
        );
        allItemsRendered = true;
      }

      isExpanded = !isExpanded;

      if (isExpanded) {
        barsContainer.classList.remove("collapsed");
        barsContainer.classList.add("expanded");
        toggleButton.classList.add("expanded");
        this.updateToggleButtonText(toggleButton, true, 0);
        toggleButton.setAttribute("aria-label", "Show fewer words");
      } else {
        barsContainer.classList.remove("expanded");
        barsContainer.classList.add("collapsed");
        toggleButton.classList.remove("expanded");
        this.updateToggleButtonText(toggleButton, false, remainingCount);
        toggleButton.setAttribute("aria-label", "Show all words");

        // Smooth scroll to top of chart
        barsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
  }

  renderRemainingItems(
    barsContainer,
    sortedEntries,
    maxFrequency,
    totalWords,
    startIndex
  ) {
    const fragment = document.createDocumentFragment();

    // Render remaining items in batches to avoid blocking
    const batchSize = 25;
    let currentIndex = startIndex;

    const renderBatch = () => {
      const endIndex = Math.min(currentIndex + batchSize, sortedEntries.length);

      for (let i = currentIndex; i < endIndex; i++) {
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
      currentIndex = endIndex;

      // Continue rendering if there are more items
      if (currentIndex < sortedEntries.length) {
        requestAnimationFrame(renderBatch);
      }
    };

    renderBatch();
  }

  updateToggleButtonText(toggleButton, isExpanded, remainingCount) {
    const toggleText = toggleButton.querySelector(".toggle-text");
    if (isExpanded) {
      toggleText.textContent = "Show Less";
    } else {
      toggleText.textContent =
        remainingCount > 0 ? `Show All (${remainingCount} more)` : "Show All";
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Enhanced helper method to clear the word frequency chart
  clearWordFrequencyChart() {
    const chartContainer = this.getElement("word-frequency-chart");
    const toggleButton = this.getElement("frequency-toggle");
    const uniqueWordCountElement = this.getElement("unique-word-count");

    // Reset unique word count
    uniqueWordCountElement.textContent = "0";

    // Hide toggle button
    toggleButton.style.display = "none";

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
}

(() => {
  const appInstance = new App();
  appInstance.init();
})();
