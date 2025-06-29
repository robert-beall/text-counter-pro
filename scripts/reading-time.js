// Reading speed controls
(() => {
    const speedDisplay = document.getElementById('speed-display');
    const speedInput = document.getElementById('speed-input');
    const speedUpBtn = document.getElementById('speed-up');
    const speedDownBtn = document.getElementById('speed-down');
    const presetButtons = document.querySelectorAll('[data-speed]');

    // Handle speed input changes
    speedInput.addEventListener('input', function () {
        let value = parseInt(this.value);
        if (value < 100) value = 100;
        if (value > 500) value = 500;
        this.value = value;
        speedDisplay.textContent = value;
        updatePresetButtons(value);
    });

    // Handle +/- buttons
    speedUpBtn.addEventListener('click', function () {
        let value = parseInt(speedInput.value) + 25;
        if (value > 500) value = 500;
        speedInput.value = value;
        speedDisplay.textContent = value;
        updatePresetButtons(value);
    });

    speedDownBtn.addEventListener('click', function () {
        let value = parseInt(speedInput.value) - 25;
        if (value < 100) value = 100;
        speedInput.value = value;
        speedDisplay.textContent = value;
        updatePresetButtons(value);
    });

    // Handle preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const speed = this.dataset.speed;
            speedInput.value = speed;
            speedDisplay.textContent = speed;
            updatePresetButtons(speed);
        });
    });

    // Update preset button styling
    function updatePresetButtons(currentSpeed) {
        presetButtons.forEach(button => {
            if (button.dataset.speed == currentSpeed) {
                button.className = 'px-3 py-1 text-xs bg-primary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark';
            } else {
                button.className = 'px-3 py-1 text-xs bg-border text-text-secondary rounded-md hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary';
            }
        });
    }
})();