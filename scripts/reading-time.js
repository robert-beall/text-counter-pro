class ReadingTime {
    constructor() {
        this.readingSpeed = 250;

        const elementIdList = [
            "text-input",
            "speed-display",
            "reading-time-display",
            "word-count-display",
            "speed-input",
            "speed-input-mobile",
            "paste-btn",
            "clear-btn",
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
        const speedDisplay = this.getElement("speed-display");
        const speedInput = this.getElement("speed-input");
        const speedInputMobile = this.getElement("speed-input-mobile");
        const pasteBtn = this.getElement("paste-btn");
        const clearBtn = this.getElement("clear-btn");

        if (textInput) {
            textInput.value = "";
            textInput.addEventListener("input", this.handleInput.bind(this));
        }

        if (speedInput) {
            speedInput.addEventListener("input", () => {
                let value = parseInt(speedInput.value);
                if (value < 0) value = 0;
                this.readingSpeed = value;
                speedDisplay.textContent = value.toLocaleString();
                this.updateDisplay();
            });
        }

        if (speedInputMobile) {
            speedInputMobile.addEventListener("input", () => {
                let value = parseInt(speedInputMobile.value);
                this.readingSpeed = value;
                if (value < 0) value = 0;
                speedInput.value = value;
                speedDisplay.textContent = value.toLocaleString();
                this.updateDisplay();
            });
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
            const speedInput = this.getElement("speed-input");

            if (clearBtn) {
                if (text) {
                    clearBtn.removeAttribute("disabled");
                } else {
                    clearBtn.setAttribute("disabled", true);
                }
            }

            /* Cheap calculations */
            this.showReadingTime(text, speedInput.value);
            this.showWordCount(text);
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

    updateDisplay() {
        const textInput = this.getElement("text-input");
        if (textInput) {
            this.showReadingTime(textInput.value, this.readingSpeed);
            this.showWordCount(textInput.value);
        }
    }

    /**
   * Calculates the number of words in the passed text and
   * displays the value in the 'word-count-display' element.
   *
   * @param {*} text input by user
   */
    showWordCount(text) {
        const wordCount = this.getElement("word-count-display");

        if (wordCount) {
            wordCount.textContent = window.textProcessor
                .getWordCount(text)
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
        const readingTime = this.getElement("reading-time-display");

        if (readingTime) {
            readingTime.textContent = window.textProcessor.getReadingTimeReadable(
                text,
                wordsPerMinute
            );
        }
    }
}

// Reading speed controls
(() => {
    const readingTimeApp = new ReadingTime();
    readingTimeApp.init().then((success) => {
        if (!success) {
            console.error("Failed to initialize ReadingTime app");
        }
    }).catch((error) => {
        console.error("Error during ReadingTime app initialization:", error);
    });
})();