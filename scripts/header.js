// Mobile Navigation & Header Functionality - UPDATED FOR TAILWIND
document.addEventListener("DOMContentLoaded", function () {
  // Updated selectors for Tailwind version
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu"); // Changed from 'nav ul'

  // Handle mobile menu toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";

      // Toggle menu visibility using Tailwind classes
      if (navMenu.classList.contains("hidden")) {
        navMenu.classList.remove("hidden");
        navMenu.classList.add("flex");
      } else {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("flex");
      }

      // Update ARIA attribute for accessibility
      this.setAttribute("aria-expanded", !isExpanded);

      // Prevent body scroll when menu is open
      document.body.style.overflow = !isExpanded ? "hidden" : "";
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("flex");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInsideNav =
        mobileMenuToggle.contains(event.target) ||
        navMenu.contains(event.target);

      if (!isClickInsideNav && !navMenu.classList.contains("hidden")) {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("flex");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    // Handle window resize - close mobile menu if screen gets larger
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && !navMenu.classList.contains("hidden")) {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("flex");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
