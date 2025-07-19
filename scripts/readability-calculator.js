class ReadabilityCalculator {
    constructor() {
        const elementIdList = [
            'text-input',
            'readability-score',
            'grade-level',
            'passive-voice',
            'flesch-score',
            'flesch-explanation',
            'passive-voice-percentage',
            'passive-voice-explanation',
            'paste-btn',
            'clear-btn',
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
        return this.missingElements.length === 0 && window.textProcessor !== null && window.textReadability !== null;
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
            this.showReadabilityScore(text);
            this.showGradeLevel(text);
            this.showPassiveVoice(text);
            this.showFleschScore(text);
            this.showFleschExplanation(text);
            this.showPassiveVoicePercentage(text);
            this.showPassiveVoiceExplanation(text);
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

    showReadabilityScore(text) {
        const readabilityScore = this.getElement("readability-score");
        if (readabilityScore) {
            if (text.trim().length === 0) {
                readabilityScore.textContent = "N/A";
                readabilityScore.classList.remove("text-red-500", "text-orange-500", "text-yellow-500", "text-green-500", "text-primary");
                return;
            }

            const score = window.textReadability.fleschReadingEase(text);
            let headingText = "";

            if (score < 10) {
                headingText = "Extremely difficult";
                readabilityScore.classList.add("text-red-500");
            } else if (score < 30) {
                headingText = "Very Difficult";
                readabilityScore.classList.add("text-red-500");
            } else if (score < 50) {
                headingText = "Difficult";
                readabilityScore.classList.add("text-orange-500");
            } else if (score < 60) {
                headingText = "Somewhat Challenging";
                readabilityScore.classList.add("text-yellow-500");
            } else if (score < 70) {
                headingText = "Plain English";
                readabilityScore.classList.add("text-green-500");
            } else if (score < 80) {
                headingText = "Easy";
                readabilityScore.classList.add("text-green-500");
            } else {
                headingText = "Very Easy";
                readabilityScore.classList.add("text-primary");
            }

            readabilityScore.textContent = headingText;
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
                gradeLevel.textContent = "College or Higher";
            } else {
                gradeLevel.textContent = `${score}th Grade`;
            }
        }
    }

    showPassiveVoice(text) {
        const passiveVoice = this.getElement("passive-voice");

        if (passiveVoice) {
            if (text.trim().length === 0) {
                passiveVoice.textContent = "N/A";
                return;
            }

            const description = window.textProcessor.getPassiveVoiceDescription(text);
            passiveVoice.textContent = description ? description : "N/A";
        }
    }

    showFleschScore(text) {
        const fleschScore = this.getElement("flesch-score");
        if (fleschScore) {
            if (text.trim().length === 0) {
                fleschScore.textContent = "0";
                return;
            }

            const score = window.textReadability.fleschReadingEase(text);
            fleschScore.textContent = `${score.toFixed(0)}`;
        }
    }

    showFleschExplanation(text) {
        const fleschExplanation = this.getElement("flesch-explanation");

        if (fleschExplanation) {
            if (text.trim().length === 0) {
                fleschExplanation.textContent = "Enter your text above to instantly analyze reading difficulty, improve content accessibility, and optimize readability scores for better SEO performance and user engagement.";
                return;
            }

            const score = window.textReadability.fleschReadingEase(text);
            let explanation = "";

            if (score < 10) {
                explanation = "This highly complex text requires advanced education and specialized knowledge to comprehend. Your content is best suited for academic research papers, legal documents, medical journals, scientific publications, and technical literature targeting PhD-level readers. While this complexity may be necessary for specialized fields, consider simplifying language where possible to improve accessibility and search engine optimization. Dense academic writing can limit your audience reach and may negatively impact SEO rankings due to reduced user engagement and higher bounce rates.";
            } else if (score < 30) {
                explanation = "Your text demonstrates sophisticated vocabulary and complex sentence structures, making it appropriate for scholarly articles, professional journals, advanced textbooks, and detailed technical documentation. This content targets highly educated professionals and academics. While demonstrating expertise, consider breaking up long sentences and explaining technical terms to broaden your audience appeal. Search engines favor content that engages users longer, so improving readability can boost SEO performance while maintaining professional credibility and subject matter authority.";
            } else if (score < 50) {
                explanation = "This moderately complex content is well-suited for academic textbooks, detailed business reports, professional communications, industry white papers, and specialized blog posts targeting educated audiences. Your content requires some concentration to read comfortably. This level works well for B2B marketing, thought leadership articles, and educational resources. To maximize SEO impact and user engagement, consider adding subheadings, bullet points, and shorter paragraphs while maintaining your professional tone and comprehensive coverage of topics.";
            } else if (score < 60) {
                explanation = "Your content strikes a good balance between professionalism and accessibility, making it perfect for news articles, business writing, educational content, and informative blog posts. This text is readable by most high school graduates and appeals to a broad professional audience. This readability level is excellent for content marketing, company communications, and informational websites. Your writing effectively communicates complex ideas without overwhelming readers, which can improve user engagement metrics and search engine rankings through better time-on-page and lower bounce rates.";
            } else if (score < 70) {
                explanation = "Excellent work! Your content achieves optimal readability for web content, making it accessible to general audiences while maintaining credibility and depth. This readability level is ideal for most business communications, marketing materials, blog posts, social media content, and website copy. Your writing successfully balances clarity with substance, making complex topics understandable without sacrificing professionalism. This readability sweet spot typically generates higher user engagement, longer session durations, and better SEO performance, as search engines reward content that keeps users engaged and provides value to diverse audiences.";
            } else if (score < 80) {
                explanation = "Outstanding readability! Your content is perfectly optimized for maximum audience reach and engagement. This text is ideal for marketing copy, blog posts, social media content, email campaigns, and any material targeting broad consumer audiences. Your clear, concise writing style makes information easily digestible while maintaining professionalism and authority. This readability level typically performs exceptionally well in SEO rankings due to high user engagement, extended time-on-page, social sharing potential, and broad accessibility. Content at this level often sees improved conversion rates and better overall digital marketing performance.";
            } else {
                explanation = "Perfect for maximum accessibility and universal appeal! Your content achieves exceptional clarity, making it easily understood by virtually all readers, including children, non-native speakers, and individuals with varying literacy levels. This highly accessible writing is excellent for children's content, simple instructions, public health communications, safety information, and content requiring maximum inclusivity. While maintaining simplicity, ensure your content still provides value and expertise to avoid appearing unprofessional. This readability level can significantly boost SEO performance through increased engagement, social sharing, and broader audience appeal, though balance simplicity with authoritative, valuable information.";
            }

            fleschExplanation.textContent = explanation;
        }
    }

    showPassiveVoicePercentage(text) {
        const passiveVoicePercentage = this.getElement("passive-voice-percentage");

        if (passiveVoicePercentage) {
            if (text.trim().length === 0) {
                console.log('empty text');
                passiveVoicePercentage.textContent = "0%";
                return;
            }

            const percentage = window.textProcessor.getPassiveVoicePercentage(text);
            passiveVoicePercentage.textContent = `${percentage.toFixed(0)}%`;
        }
    }

    showPassiveVoiceExplanation(text) {
        const passiveVoiceExplanation = this.getElement("passive-voice-explanation");

        if (passiveVoiceExplanation) {
            if (text.trim().length === 0) {
                passiveVoiceExplanation.textContent = "Enter your text above to analyze passive voice usage and receive detailed feedback on how it impacts readability. This tool will help you identify opportunities to make your writing more direct and engaging through active voice construction.";
                return;
            }

            const explanation = window.textProcessor.getPassiveVoiceExtendedDescription(text);
            passiveVoiceExplanation.textContent = explanation ? explanation : "N/A";
        }
    }
}

(() => {
    const ReadabilityCalculatorInstance = new ReadabilityCalculator();
    ReadabilityCalculatorInstance.init().then((success) => {
        if (!success) {
            console.error('Failed to initialize ReadabilityCalculator');
        }
    }).catch((error) => {
        console.error('Error during ReadabilityCalculator initialization:', error);
    });
})();