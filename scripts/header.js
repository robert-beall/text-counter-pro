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

  // Set active page indicator (enhanced version)
  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const allNavLinks = document.querySelectorAll('header nav a[href], .nav-menu a[href]');
    
    // First, reset all links to inactive state
    allNavLinks.forEach(link => {
      // Remove active classes
      link.classList.remove('text-blue-600', 'bg-blue-50', 'font-semibold');
      link.classList.add('text-gray-600');
      link.removeAttribute('aria-current');
      
      // Remove desktop active indicator classes
      link.classList.remove('after:absolute', 'after:bottom-0', 'after:left-1/2', 'after:-translate-x-1/2', 'after:w-5', 'after:h-0.5', 'after:bg-blue-600', 'after:rounded-sm');
      
      // Reset hover classes
      if (link.closest('.tools-dropdown-menu') || link.closest('.more-dropdown-menu')) {
        // Dropdown items
        link.classList.remove('text-blue-600', 'bg-blue-50');
        link.classList.add('text-gray-700');
        link.className = link.className.replace(/hover:bg-blue-\d+/g, 'hover:bg-blue-50');
        link.className = link.className.replace(/hover:text-blue-\d+/g, 'hover:text-blue-600');
      } else if (link.closest('.nav-menu')) {
        // Mobile menu items
        link.classList.remove('text-blue-600', 'bg-blue-50');
        link.classList.add('text-gray-600');
      } else {
        // Desktop top-level items
        link.classList.remove('text-blue-600', 'bg-blue-50');
        link.classList.add('text-gray-600');
      }
    });
    
    // Find and activate the current page link
    allNavLinks.forEach(link => {
      try {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        // Normalize paths by removing trailing slashes and comparing
        const normalizedLinkPath = linkPath.replace(/\/$/, '') || '/';
        const normalizedCurrentPath = currentPath.replace(/\/$/, '') || '/';

        if (normalizedLinkPath === normalizedCurrentPath) {
          // Mark as active
          link.classList.add('text-blue-600', 'bg-blue-50', 'font-semibold');
          link.classList.remove('text-gray-600', 'text-gray-700');
          link.setAttribute('aria-current', 'page');

          // Add desktop active indicator if top-level
          if (!link.closest('.nav-menu') && !link.closest('.tools-dropdown-menu') && !link.closest('.more-dropdown-menu')) {
            link.classList.add('after:absolute', 'after:bottom-0', 'after:left-1/2', 'after:-translate-x-1/2', 'after:w-5', 'after:h-0.5', 'after:bg-blue-600', 'after:rounded-sm');
          }
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    });
  }

  // Call on page load with a small delay to ensure DOM is ready
  setTimeout(setActiveNavItem, 100);
});