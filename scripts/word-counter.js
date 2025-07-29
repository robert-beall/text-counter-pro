class WordCounter {
    constructor() {
        const elementIdList = [
            'text-input',
            'paste-btn',
            'clear-btn',
            'word-count',
            'avg-word-length',
            'sentence-count',
            'most-common-word',
            'unique-words-count',
            'longest-word',
            'longest-word-length',
            'shortest-word',
            'shortest-word-length',
            'avg-words-per-sentence',
            'paragraph-count',
            'avg-sentences-per-paragraph',
        ];

        this.elements = {};
        this.missingElements = [];
        this.wordFrequency = [];
        this.wordFrequencyFiltered = [];

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
            console.warn('Missing DOM elements:', this.missingElements);
        }
    }

    async init() {
        if (!this.isReady()) {
            console.error('Cannot initialize app: missing required DOM elements');
            /*
             * Additional error logic.
             */
            return false;
        }

        // Load readability library
        // await this.loadReadabilityLibrary();

        console.log('App initialized successfully');

        const textInput = this.getElement('text-input');
        const pasteBtn = this.getElement('paste-btn');
        const clearBtn = this.getElement('clear-btn');

        if (textInput) {
            textInput.value = '';
            textInput.addEventListener('input', this.handleInput.bind(this));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', this.handleClear.bind(this));
        }

        if (pasteBtn) {
            pasteBtn.addEventListener('click', this.handlePaste.bind(this));
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

        console.warn(`Element with id='${id} not found in DOM`);
        return null;
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
     * Event handler used to call all analysis logic on
     * user input.
     *
     * @param {*} event - user input to handle
    */
    handleInput(event) {
        try {
            const text = event.target.value;
            const clearBtn = this.getElement('clear-btn');

            if (clearBtn) {
                if (text) {
                    clearBtn.removeAttribute('disabled');
                } else {
                    clearBtn.setAttribute('disabled', true);
                }
            }

            /* Cheap calculations */
            this.showWordCount(text);
            this.showSentenceCount(text);
            this.showAvgWordLength(text);
            this.showAverageSentenceLength(text);
            this.showParagraphCount(text);
            this.showAverageParagraphLength(text);

            /* More expensive calculations */
            this.expensiveCalculations(text)
        } catch (e) {
            console.error('Error handling input:', e);
        }
    }

    handleClear() {
        const clearBtn = this.getElement('clear-btn');
        const textInput = this.getElement('text-input');

        if (textInput) {
            textInput.value = '';
            textInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (clearBtn) {
            clearBtn.setAttribute('disabled', true);
        }
    }

    async handlePaste() {
        const pasteBtn = this.getElement('paste-btn');
        const textInput = this.getElement('text-input');

        if (pasteBtn && textInput) {
            try {
                const text = await navigator.clipboard.readText();
                textInput.value += text;

                // Trigger the input event to run calculations
                textInput.dispatchEvent(new Event('input', { bubbles: true }));
            } catch (e) {
                console.error('Cannot paste user content:', e);
            }
        }
    }

    showWordCount(text) {
        const wordCountElement = this.getElement('word-count');
        if (wordCountElement) {
            wordCountElement.textContent = textProcessor.getWordCount(text);
        }
    }

    showSentenceCount(text) {
        const sentenceCountElement = this.getElement('sentence-count');
        if (sentenceCountElement) {
            sentenceCountElement.textContent = textProcessor.getSentenceCount(text);
        }
    }

    showAvgWordLength(text) {
        const avgWordLengthElement = this.getElement('avg-word-length');
        if (avgWordLengthElement) {
            const avg = textProcessor.getAverageCharsPerWord(text);
            avgWordLengthElement.textContent = avg.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    showMostCommonWord() {
        const mostCommonWordElement = this.getElement('most-common-word');
        if (mostCommonWordElement) {
            const mostCommonWord = this.wordFrequencyFiltered[0] ? this.wordFrequencyFiltered[0][0] : (this.wordFrequency[0] ? this.wordFrequency[0][0] : 'N/A');
            mostCommonWordElement.textContent = mostCommonWord;
        }
    }

    showUniqueWordsCount(text) {
        const uniqueWordsCountElement = this.getElement('unique-words-count');
        if (uniqueWordsCountElement) {
            uniqueWordsCountElement.textContent = this.wordFrequency.length;
        }
    }

    showLongestWord() {
        const longestWordElement = this.getElement('longest-word');
        const longestWordLengthElement = this.getElement('longest-word-length');
        if (longestWordElement && longestWordLengthElement) {
            const longestWord = this.wordFrequency.reduce((longest, current) => {
                return current[0].length > longest.length ? current[0] : longest;
            }, '');
            longestWordElement.textContent = longestWord || 'N/A';
            longestWordLengthElement.textContent = longestWord.length || 0;
        }
    }

    showShortestWord() {
        const shortestWordElement = this.getElement('shortest-word');
        const shortestWordLengthElement = this.getElement('shortest-word-length');
        if (shortestWordElement && shortestWordLengthElement) {
            const shortestWord = this.wordFrequency.reduce((shortest, current) => {
                return current[0].length < shortest.length ? current[0] : shortest;
            }, this.wordFrequency[0] ? this.wordFrequency[0][0] : '');
            shortestWordElement.textContent = shortestWord || 'N/A';
            shortestWordLengthElement.textContent = shortestWord.length || 0;
        }
    }

    showAverageSentenceLength(text) {
        const avgSentenceLengthElement = this.getElement('avg-words-per-sentence');
        if (avgSentenceLengthElement) {
            const avg = window.textProcessor.getAverageWordsPerSentence(text);
            avgSentenceLengthElement.textContent = avg.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    showParagraphCount(text) {
        const paragraphCountElement = this.getElement('paragraph-count');
        if (paragraphCountElement) {
            paragraphCountElement.textContent = window.textProcessor.getParagraphCount(text);
        }
    }

    showAverageParagraphLength(text) {
        const avgSentencesPerParagraphElement = this.getElement('avg-sentences-per-paragraph');
        if (avgSentencesPerParagraphElement) {
            const avg = window.textProcessor.getAverageSentencePerParagraph(text);
            avgSentencesPerParagraphElement.textContent = avg.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    // Debounced function to handle expensive calculations
    expensiveCalculations = this.debounce((text) => {
        this.wordFrequency = textProcessor.calculateWordFrequency(text);
        this.wordFrequencyFiltered = textProcessor.filterStopWords(this.wordFrequency);
        this.showMostCommonWord(text);
        this.showUniqueWordsCount(text);
        this.showLongestWord();
        this.showShortestWord();
    }, 100);
}

(() => {
    const wordCounter = new WordCounter();
    wordCounter.init();
})();