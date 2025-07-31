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
      "sentence-count",
      "paragraph-count",
      "paste-btn",
      "clear-btn",
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
      this.showWordCount(text);
      this.showSentenceCount(text);
      this.showParagraphCount(text);
    } catch (e) {
      console.error("Error handling input:", e);
    }
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
}

(() => {
  const appInstance = new App();
  appInstance.init();
})();
