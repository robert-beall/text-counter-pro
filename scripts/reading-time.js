// Reading speed controls
(() => {
    const slider = document.getElementById('reading-speed-slider');
    const speedDisplay = document.getElementById('speed-display');
    const presetButtons = document.querySelectorAll('[data-speed]');
    
    // Update speed display when slider changes
    slider.addEventListener('input', function() {
        speedDisplay.textContent = this.value;
        updatePresetButtons(this.value);
    });
    
    // Handle preset button clicks
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const speed = this.dataset.speed;
            slider.value = speed;
            speedDisplay.textContent = speed;
            updatePresetButtons(speed);
        });
    });
    
    // Update preset button styling
    function updatePresetButtons(currentSpeed) {
        presetButtons.forEach(button => {
            if (button.dataset.speed === currentSpeed) {
                button.className = 'px-3 py-1 text-xs bg-primary text-white rounded-md';
            } else {
                button.className = 'px-3 py-1 text-xs bg-border text-text-secondary rounded-md hover:bg-primary hover:text-white transition-colors';
            }
        });
    }
})();