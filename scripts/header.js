// Enhanced Mobile Navigation & Header Functionality - UPDATED FOR DROPDOWN MENUS
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu elements
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  // Desktop dropdown elements
  const toolsDropdownToggle = document.querySelector(".tools-dropdown-toggle");
  const toolsDropdownMenu = document.querySelector(".tools-dropdown-menu");
  const moreDropdownToggle = document.querySelector(".more-dropdown-toggle");
  const moreDropdownMenu = document.querySelector(".more-dropdown-menu");

  // Handle mobile menu toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isPressed = this.getAttribute("aria-pressed") === "true";

      // Toggle menu visibility using Tailwind classes
      if (navMenu.classList.contains("hidden")) {
        navMenu.classList.remove("hidden");
        navMenu.classList.add("block");
      } else {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("block");
      }

      // Update ARIA attributes for accessibility
      this.setAttribute("aria-pressed", !isPressed);
      this.setAttribute("aria-expanded", !isPressed);

      // Prevent body scroll when menu is open on mobile
      if (window.innerWidth < 1024) {
        document.body.style.overflow = !isPressed ? "hidden" : "";
      }
    });
  }

  // Handle desktop dropdown menus
  function setupDropdown(toggle, menu) {
    if (!toggle || !menu) return;

    let hoverTimeout;

    // Mouse enter - show dropdown
    toggle.parentElement.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimeout);
      menu.classList.remove("opacity-0", "invisible", "translate-y-1");
      menu.classList.add("opacity-100", "visible", "translate-y-0");
      toggle.setAttribute("aria-expanded", "true");
    });

    // Mouse leave - hide dropdown with delay
    toggle.parentElement.addEventListener("mouseleave", function () {
      hoverTimeout = setTimeout(() => {
        menu.classList.add("opacity-0", "invisible", "translate-y-1");
        menu.classList.remove("opacity-100", "visible", "translate-y-0");
        toggle.setAttribute("aria-expanded", "false");
      }, 150);
    });

    // Keyboard navigation
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const isExpanded = this.getAttribute("aria-expanded") === "true";

        // Close other dropdowns first
        closeAllDropdowns();

        if (!isExpanded) {
          menu.classList.remove("opacity-0", "invisible", "translate-y-1");
          menu.classList.add("opacity-100", "visible", "translate-y-0");
          this.setAttribute("aria-expanded", "true");

          // Focus first menu item
          const firstMenuItem = menu.querySelector('[role="menuitem"]');
          if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
          }
        }
      } else if (e.key === "Escape") {
        closeAllDropdowns();
        this.focus();
      }
    });

    // Handle arrow keys within dropdown menu
    menu.addEventListener("keydown", function (e) {
      const menuItems = Array.from(menu.querySelectorAll('[role="menuitem"]'));
      const currentIndex = menuItems.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[nextIndex].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prevIndex].focus();
      } else if (e.key === "Escape") {
        closeAllDropdowns();
        toggle.focus();
      }
    });
  }

  // Setup both dropdowns
  setupDropdown(toolsDropdownToggle, toolsDropdownMenu);
  setupDropdown(moreDropdownToggle, moreDropdownMenu);

  // Close all dropdowns function
  function closeAllDropdowns() {
    [toolsDropdownMenu, moreDropdownMenu].forEach(menu => {
      if (menu) {
        menu.classList.add("opacity-0", "invisible", "translate-y-1");
        menu.classList.remove("opacity-100", "visible", "translate-y-0");
      }
    });

    [toolsDropdownToggle, moreDropdownToggle].forEach(toggle => {
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    const isInsideDropdown = event.target.closest(".group");
    const isInsideMobileMenu = mobileMenuToggle?.contains(event.target) ||
      navMenu?.contains(event.target);

    if (!isInsideDropdown) {
      closeAllDropdowns();
    }

    // Close mobile menu when clicking outside
    if (!isInsideMobileMenu && navMenu && !navMenu.classList.contains("hidden")) {
      navMenu.classList.add("hidden");
      navMenu.classList.remove("block");
      mobileMenuToggle.setAttribute("aria-pressed", "false");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  // Close mobile menu when clicking on a nav link
  if (navMenu) {
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("block");
        mobileMenuToggle.setAttribute("aria-pressed", "false");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Handle window resize - close menus if screen gets larger
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      // Close mobile menu
      if (navMenu && !navMenu.classList.contains("hidden")) {
        navMenu.classList.add("hidden");
        navMenu.classList.remove("block");
        mobileMenuToggle.setAttribute("aria-pressed", "false");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    } else {
      // Close desktop dropdowns on mobile
      closeAllDropdowns();
    }
  });

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

  // Set active page indicator (optional enhancement)
  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a[href]');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        // Remove active classes from other links
        navLinks.forEach(l => {
          l.classList.remove('text-blue-600', 'bg-blue-50');
          l.classList.add('text-gray-600');
          l.removeAttribute('aria-current');
        });

        // Add active classes to current link
        link.classList.remove('text-gray-600');
        link.classList.add('text-blue-600', 'bg-blue-50');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // Call on page load
  setActiveNavItem();
});