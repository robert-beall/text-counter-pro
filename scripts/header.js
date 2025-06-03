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