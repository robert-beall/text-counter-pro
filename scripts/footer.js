// Mobile Navigation & Header Functionality
// Text Counter Pro - app.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const hamburger = document.querySelector('.hamburger');
    
    // Handle mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            
            // Update ARIA attribute for accessibility
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Animate hamburger icon
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mobileMenuToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle window resize - close mobile menu if screen gets larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Text analysis functionality (if you want to add this)
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const charNoSpaceCount = document.getElementById('char-no-space-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    
    // Text analysis function
    function analyzeText() {
        const text = textInput.value;
        
        // Word count
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        // Character counts
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        
        // Sentence count (basic - counts periods, exclamation marks, question marks)
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        // Paragraph count
        const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
        
        // Reading time (average 200 words per minute)
        const minutes = Math.floor(words / 200);
        const seconds = Math.ceil((words % 200) / (200 / 60));
        const readingTimeText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        
        // Update display
        if (wordCount) wordCount.textContent = words.toLocaleString();
        if (charCount) charCount.textContent = chars.toLocaleString();
        if (charNoSpaceCount) charNoSpaceCount.textContent = charsNoSpace.toLocaleString();
        if (sentenceCount) sentenceCount.textContent = sentences.toLocaleString();
        if (paragraphCount) paragraphCount.textContent = paragraphs.toLocaleString();
        if (readingTime) readingTime.textContent = readingTimeText;
    }
    
    // Add event listener for text input
    if (textInput) {
        textInput.addEventListener('input', analyzeText);
        // Initial analysis
        analyzeText();
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide back to top button based on scroll
        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Smooth scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Event listeners
        window.addEventListener('scroll', toggleBackToTop);
        backToTopButton.addEventListener('click', scrollToTop);
    }
    
    // Optional: Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            
            if (email) {
                // Add your newsletter signup logic here
                console.log('Newsletter signup:', email);
                
                // Show success message (customize as needed)
                const button = this.querySelector('.newsletter-button');
                const originalText = button.textContent;
                button.textContent = 'Subscribed!';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    this.reset();
                }, 2000);
            }
        });
    }
});

// Hamburger animation styles (add to your CSS if not already included)
const hamburgerStyles = `
.hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}
`;

// Inject styles if they don't exist
if (!document.querySelector('#hamburger-animation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hamburger-animation-styles';
    styleSheet.textContent = hamburgerStyles;
    document.head.appendChild(styleSheet);
}