class CharacterCounter {
    constructor() {
        const elementIdList = [
            'text-input',
            'char-count',
            'char-count-no-spaces',
            'char-density',
            'special-char-count',
            'paste-btn',
            'clear-btn',
            'twitter-char-count',
            'instagram-char-count',
            'facebook-char-count',
            'linkedin-char-count',
            'letters-count',
            'uppercase-count',
            'lowercase-count',
            'numbers-count',
            'whitespace-count',
            'spaces-count',
            'tabs-count',
            'linebreaks-count',
            'punctuation-count',
            'emoji-count',
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
            this.showCharacterCount(text);
            this.showCharacterCountNoSpaces(text);
            this.showAverageCharactersPerWord(text);
            this.showSpecialCharacterCount(text);
            this.showLettersCount(text);
            this.showUppercaseCount(text);
            this.showLowercaseCount(text);
            this.showNumbersCount(text);
            this.showWhitespaceCount(text);
            this.showSpacesCount(text);
            this.showTabsCount(text);
            this.showLinebreaksCount(text);
            this.showPunctuationCount(text);
            this.showEmojiCount(text);
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

    /**
     * Show the character count for the given text.
     *
     * @param {*} text 
     */
    showCharacterCount(text) {
        const charCountElement = this.getElement('char-count');
        if (charCountElement) {
            const count = window.textProcessor.getCharCount(text);
            charCountElement.textContent = count.toLocaleString();
            this.showTwitterCharCount(count);
            this.showInstagramCharCount(count);
            this.showFacebookCharCount(count);
            this.showLinkedinCharCount(count);
        }
    }

    /**
     * Show the character count without spaces for the given text.
     *
     * @param {*} text 
     */
    showCharacterCountNoSpaces(text) {
        const charCountNoSpacesElement = this.getElement('char-count-no-spaces');
        if (charCountNoSpacesElement) {
            charCountNoSpacesElement.textContent = window.textProcessor.getCharCountNoSpaces(text).toLocaleString();
        }
    }

    /**
     * Show the average number of characters per word for the given text.
     *
     * @param {*} text 
     */
    showAverageCharactersPerWord(text) {
        const charDensityElement = this.getElement('char-density');
        if (charDensityElement) {
            charDensityElement.textContent = window.textProcessor.getAverageCharsPerWord(text).toLocaleString();
        }
    }

    /**
     * Show the special character count for the given text.
     *
     * @param {*} text 
     */
    showSpecialCharacterCount(text) {
        const specialCharCountElement = this.getElement('special-char-count');
        if (specialCharCountElement) {
            specialCharCountElement.textContent = window.textProcessor.getSpecialCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the Twitter character count for the given text.
     *
     * @param {*} text 
     */
    showTwitterCharCount(count) {
        const twitterCharCountElement = this.getElement('twitter-char-count');
        if (twitterCharCountElement) {
            const remainingCount = 280 - count;
            // Update the text content with the remaining characters
            twitterCharCountElement.textContent = remainingCount.toLocaleString();

            if (remainingCount < 0) {
                twitterCharCountElement.classList.remove('text-yellow-500');
                twitterCharCountElement.classList.add('text-red-500');
            } else if (remainingCount >= 0 && remainingCount <= 70) {
                twitterCharCountElement.classList.remove('text-red-500');
                twitterCharCountElement.classList.add('text-yellow-500');
            } else {
                twitterCharCountElement.classList.remove('text-red-500', 'text-yellow-500');
            }
        }
    }

    /**
     * Show the Instagram character count for the given text.
     *
     * @param {*} count 
     */
    showInstagramCharCount(count) {
        const instagramCharCountElement = this.getElement('instagram-char-count');
        if (instagramCharCountElement) {
            const remainingCount = 2200 - count;
            // Update the text content with the remaining characters
            instagramCharCountElement.textContent = remainingCount.toLocaleString();

            if (remainingCount < 0) {
                instagramCharCountElement.classList.remove('text-yellow-500');
                instagramCharCountElement.classList.add('text-red-500');
            } else if (remainingCount >= 0 && remainingCount <= 400) {
                instagramCharCountElement.classList.remove('text-red-500');
                instagramCharCountElement.classList.add('text-yellow-500');
            } else {
                instagramCharCountElement.classList.remove('text-red-500', 'text-yellow-500');
            }
        }
    }

    /**
     * Show the Facebook character count for the given text.
     *
     * @param {*} count 
     */
    showFacebookCharCount(count) {
        const facebookCharCountElement = this.getElement('facebook-char-count');
        if (facebookCharCountElement) {
            const remainingCount = 63206 - count;
            // Update the text content with the remaining characters
            facebookCharCountElement.textContent = remainingCount.toLocaleString();
            if (remainingCount < 0) {
                facebookCharCountElement.classList.remove('text-yellow-500');
                facebookCharCountElement.classList.add('text-red-500');
            } else if (remainingCount >= 0 && remainingCount <= 2000) {
                facebookCharCountElement.classList.remove('text-red-500');
                facebookCharCountElement.classList.add('text-yellow-500');
            } else {
                facebookCharCountElement.classList.remove('text-red-500', 'text-yellow-500');
            }   
        }
    }

    /**
     * Show the LinkedIn character count for the given text.
     *
     * @param {*} count 
     */
    showLinkedinCharCount(count) {
        const linkedinCharCountElement = this.getElement('linkedin-char-count');
        if (linkedinCharCountElement) {
            const remainingCount = 3000 - count;
            // Update the text content with the remaining characters
            linkedinCharCountElement.textContent = remainingCount.toLocaleString();
            if (remainingCount < 0) {
                linkedinCharCountElement.classList.remove('text-yellow-500');
                linkedinCharCountElement.classList.add('text-red-500');
            } else if (remainingCount >= 0 && remainingCount <= 500) {
                linkedinCharCountElement.classList.remove('text-red-500');
                linkedinCharCountElement.classList.add('text-yellow-500');
            } else {
                linkedinCharCountElement.classList.remove('text-red-500', 'text-yellow-500');
            }
        }
    }
    
    /**
     * Show the letter count for the given text.
     *
     * @param {*} text
     */
    showLettersCount(text) {
        const lettersCountElement = this.getElement('letters-count');
        if (lettersCountElement) {
            lettersCountElement.textContent = window.textProcessor.getLettersCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the uppercase character count for the given text.
     *
     * @param {*} text
     */
    showUppercaseCount(text) {
        const uppercaseCountElement = this.getElement('uppercase-count');
        if (uppercaseCountElement) {
            uppercaseCountElement.textContent = window.textProcessor.getUpperCaseCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the lowercase character count for the given text.
     *
     * @param {*} text
     */
    showLowercaseCount(text) {
        const lowercaseCountElement = this.getElement('lowercase-count');
        if (lowercaseCountElement) {
            lowercaseCountElement.textContent = window.textProcessor.getLowerCaseCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the number character count for the given text.
     *
     * @param {*} text
     */
    showNumbersCount(text) {
        const numbersCountElement = this.getElement('numbers-count');
        if (numbersCountElement) {
            numbersCountElement.textContent = window.textProcessor.getNumbersCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the whitespace character count for the given text.
     *
     * @param {*} text
     */
    showWhitespaceCount(text) {
        const whitespaceCountElement = this.getElement('whitespace-count');
        if (whitespaceCountElement) {
            whitespaceCountElement.textContent = window.textProcessor.getWhitespaceCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the spaces character count for the given text.
     *
     * @param {*} text
     */
    showSpacesCount(text) {
        const spacesCountElement = this.getElement('spaces-count');
        if (spacesCountElement) {
            spacesCountElement.textContent = window.textProcessor.getSpaceCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the tabs character count for the given text.
     *
     * @param {*} text
     */
    showTabsCount(text) {
        const tabsCountElement = this.getElement('tabs-count');
        if (tabsCountElement) {
            tabsCountElement.textContent = window.textProcessor.getTabCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the linebreak character count for the given text.
     *
     * @param {*} text
     */
    showLinebreaksCount(text) {
        const linebreaksCountElement = this.getElement('linebreaks-count');
        if (linebreaksCountElement) {
            linebreaksCountElement.textContent = window.textProcessor.getNewLineCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the punctuation character count for the given text.
     *
     * @param {*} text
     */
    showPunctuationCount(text) {
        const punctuationCountElement = this.getElement('punctuation-count');
        if (punctuationCountElement) {
            punctuationCountElement.textContent = window.textProcessor.getPunctuationCharCount(text).toLocaleString();
        }
    }

    /**
     * Show the emoji character count for the given text.
     *
     * @param {*} text
     */
    showEmojiCount(text) {
        const emojiCountElement = this.getElement('emoji-count');
        if (emojiCountElement) {
            const count = window.textProcessor.getEmojiCharCount(text);
           emojiCountElement.textContent = count.toLocaleString();
        }
    }
}

(() => {
    const characterCounter = new CharacterCounter();
    characterCounter.init();
})();