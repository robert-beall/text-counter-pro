class App {
    /**
     * Constructor establishes required DOM elements and records
     * any that are not found.
     */
    constructor() {
        const elementIdList = [
            'text-input',
            'word-count',
            'char-count',
            'char-no-space-count',
            'sentence-count',
            'paragraph-count',
            'reading-time',
        ];

        this.elements = {};
        this.missingElements = [];

        elementIdList.forEach(id => {
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

    /**
     * Application initialization logic.
     * 
     * @returns boolean
     */
    init() {
        if (!this.isReady()) {
            console.error('Cannot initialize app: missing required DOM elements');
            /*
             * Additional error logic.
             */
            return false;
        }

        console.log('App initialized successfully');

        const textInput = this.getElement('text-input');
        if (textInput) {
            textInput.addEventListener('input', this.handleInput);
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
            return this.elements[id]
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
    handleInput(event) {
        const text = event.target.value;
        // STUB
    }
}

(() => {
    const appInstance = new App();
    appInstance.init();
})();