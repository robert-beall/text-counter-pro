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
    if (textInput) {
      textInput.addEventListener("input", this.handleInput.bind(this));
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

      /* Cheap calculations */
      this.calculateCharCount(text);
      this.calculateCharCountNoSpaces(text);

      /* Debounce heavier operations */
      this.debouncedAnalysis(text);
    } catch (e) {
      console.error("Error handling input:", e);
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
      
      let sentences = text.trim().split(/[.!?]/g).filter(s => s.length > 0);

      const validSentences = [];

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];

        const words = sentence.split(/\s+/);
        const lastWord = words[words.length - 1]?.toLowerCase();

        if (abbreviations.has(lastWord) && i < sentences.length - 1) {
            sentences[i + 1] = sentence + '. ' + sentences[i + 1];

            continue; 
        }

        validSentences.push(sentence);
      }

      sentenceCount.textContent = validSentences.length.toLocaleString();
    }
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
   * Debounced function for running more expensive operations while preserving user
   * performance.
   */
  debouncedAnalysis = this.debounce((text) => {
    this.calculateWordCount(text);
    this.calculateSentenceCount(text);
  }, 200);
}

(() => {
  const appInstance = new App();
  appInstance.init();
})();
