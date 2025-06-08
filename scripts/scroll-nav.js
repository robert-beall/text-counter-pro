// Floating Scroll Navigation - Enhanced for heading navigation
class ScrollNavigation {
  constructor() {
    this.button = document.getElementById("scroll-nav-btn");
    this.textElement = this.button.querySelector(".scroll-nav-text");

    // Target the specific heading elements
    this.detailedStatsHeading = document.getElementById(
      "detailed-stats-heading"
    );
    this.heroHeading = document.getElementById("hero-heading");

    this.isScrollingDown = true;
    this.lastScrollY = 0;

    this.init();
  }

  init() {
    if (!this.button || !this.detailedStatsHeading || !this.heroHeading) {
      console.warn("ScrollNavigation: Required elements not found");
      return;
    }

    this.setupEventListeners();
    this.updateButtonState();
  }

  setupEventListeners() {
    // Button click handler
    this.button.addEventListener("click", () => this.handleButtonClick());

    // Scroll event handler with throttling for performance
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Handle keyboard navigation (Enter and Space)
    this.button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleButtonClick();
      }
    });
  }

  handleButtonClick() {
    const targetElement = this.isScrollingDown
      ? this.detailedStatsHeading
      : this.heroHeading;

    if (targetElement) {
      // Calculate offset for better visual positioning
      const offset = this.isScrollingDown ? 110 : 110; // Small offset for detailed stats
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

      // Smooth scroll to target
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Update browser history for better UX (without page reload)
      if (this.isScrollingDown) {
        history.replaceState(null, null, "#detailed-stats-heading");
      } else {
        history.replaceState(null, null, "#hero-heading");
      }

      // Focus the target heading for screen readers
      setTimeout(() => {
        targetElement.focus({ preventScroll: true });
      }, 500);

      // Haptic feedback for mobile devices
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const detailedStatsPosition =
      this.detailedStatsHeading.getBoundingClientRect().top +
      window.pageYOffset;
    const threshold = detailedStatsPosition - window.innerHeight * 0.5; // Trigger at 50% of viewport

    // Determine scroll direction and button state
    const shouldScrollDown = currentScrollY < threshold;

    // Update button state if it changed
    if (shouldScrollDown !== this.isScrollingDown) {
      this.isScrollingDown = shouldScrollDown;
      this.updateButtonState();
    }

    // Hide button when near the very bottom of the page
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isNearBottom = currentScrollY + windowHeight >= documentHeight - 100;

    this.button.classList.toggle("hidden", isNearBottom);

    this.lastScrollY = currentScrollY;
  }

  updateButtonState() {
    if (this.isScrollingDown) {
      this.textElement.textContent = "Detailed Analysis";
      this.button.setAttribute(
        "aria-label",
        "Scroll to detailed analysis section"
      );
      this.button.classList.remove("scroll-up");
    } else {
      this.textElement.textContent = "Back to Top";
      this.button.setAttribute("aria-label", "Scroll back to page title");
      this.button.classList.add("scroll-up");
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ScrollNavigation();
});

// Handle direct hash navigation (when users navigate via URL fragments)
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (hash === "#detailed-stats-heading" || hash === "#hero-heading") {
    const element = document.querySelector(hash);
    if (element) {
      element.focus({ preventScroll: true });
    }
  }
});
