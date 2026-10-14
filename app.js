/**
 * IEEE TEMS Student Chapter — Interactive Logic
 * Swiss Minimalist Philosophy: Functional, Precise, Accessible
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNav();
  initScrollSpy();
  initInterestCounter();
  initFaqAccordion();
  initApplicationForm();
});

/* --------------------------------------------------------------------------
   1. Sticky Header & Scroll Border
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  const navLinks = document.querySelectorAll(".mobile-nav-item a");

  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    toggleBtn.classList.toggle("is-active");
    drawer.classList.toggle("is-open");
  };

  toggleBtn.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.classList.remove("is-active");
      drawer.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      toggleMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Spy (Active Navigation Indicator)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -65% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. "I'm Interested" Typographic Counter
   -------------------------------------------------------------------------- */
function initInterestCounter() {
  const counterEl = document.getElementById("interestCount");
  const button = document.getElementById("interestBtn");
  const feedbackEl = document.getElementById("interestFeedback");

  if (!counterEl || !button) return;

  const STORAGE_KEY = "ieee_tems_interest_count";
  const USER_VOTED_KEY = "ieee_tems_user_voted";

  const defaultBaseCount = 248;
  let currentCount = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(currentCount) || currentCount < defaultBaseCount) {
    currentCount = defaultBaseCount;
    localStorage.setItem(STORAGE_KEY, currentCount);
  }

  counterEl.textContent = currentCount.toLocaleString();

  const hasVoted = localStorage.getItem(USER_VOTED_KEY) === "true";
  if (hasVoted) {
    button.classList.add("clicked");
    button.innerHTML = `<span>✓ Interest Recorded</span>`;
    if (feedbackEl) {
      feedbackEl.textContent = "Your interest has been logged for Fall 2026 admissions.";
    }
  }

  button.addEventListener("click", () => {
    const alreadyVoted = localStorage.getItem(USER_VOTED_KEY) === "true";

    if (!alreadyVoted) {
      currentCount += 1;
      localStorage.setItem(STORAGE_KEY, currentCount);
      localStorage.setItem(USER_VOTED_KEY, "true");

      counterEl.textContent = currentCount.toLocaleString();
      button.classList.add("clicked");
      button.innerHTML = `<span>✓ Interest Recorded</span>`;

      if (feedbackEl) {
        feedbackEl.textContent = "Thank you. Your interest count was updated live.";
      }
    } else {
      if (feedbackEl) {
        feedbackEl.textContent = "You have already registered your interest for this session.";
      }
    }
  });
}

/* --------------------------------------------------------------------------
   5. Minimalist FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const content = item.querySelector(".accordion-content");
    const icon = item.querySelector(".accordion-icon");

    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Close other open accordions for crisp Swiss focus
      accordionItems.forEach((other) => {
        if (other !== item && other.classList.contains("is-open")) {
          other.classList.remove("is-open");
          const otherTrigger = other.querySelector(".accordion-trigger");
          const otherIcon = other.querySelector(".accordion-icon");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          if (otherIcon) otherIcon.textContent = "+";
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "+";
      } else {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        if (icon) icon.textContent = "−";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Admissions Application Form (Validation & Confirmation)
   -------------------------------------------------------------------------- */
function initApplicationForm() {
  const form = document.getElementById("temsApplicationForm");
  const feedbackAlert = document.getElementById("formFeedbackAlert");
  const alertReceipt = document.getElementById("alertReceipt");

  if (!form || !feedbackAlert) return;

  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    major: document.getElementById("major"),
    academicYear: document.getElementById("academicYear"),
    motivation: document.getElementById("motivation"),
    ethicsAgree: document.getElementById("ethicsAgree")
  };

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const setError = (inputElement, errorText) => {
    const group = inputElement.closest(".form-group");
    if (!group) return;
    group.classList.add("has-error");
    inputElement.classList.add("is-invalid");
    inputElement.setAttribute("aria-invalid", "true");
    const errSpan = group.querySelector(".field-error-message");
    if (errSpan) {
      errSpan.textContent = errorText;
    }
  };

  const clearError = (inputElement) => {
    const group = inputElement.closest(".form-group");
    if (!group) return;
    group.classList.remove("has-error");
    inputElement.classList.remove("is-invalid");
    inputElement.removeAttribute("aria-invalid");
  };

  // Real-time clearance on typing
  Object.values(fields).forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Full Name
    if (!fields.fullName.value.trim() || fields.fullName.value.trim().length < 3) {
      setError(fields.fullName, "Please enter your full legal or university name (min 3 characters).");
      isValid = false;
    } else {
      clearError(fields.fullName);
    }

    // Validate Email
    if (!fields.email.value.trim() || !validateEmail(fields.email.value.trim())) {
      setError(fields.email, "Please provide a valid institutional email address.");
      isValid = false;
    } else {
      clearError(fields.email);
    }

    // Validate Major
    if (!fields.major.value.trim()) {
      setError(fields.major, "Please enter your degree program / department.");
      isValid = false;
    } else {
      clearError(fields.major);
    }

    // Validate Academic Year
    if (!fields.academicYear.value) {
      setError(fields.academicYear, "Please select your current academic year.");
      isValid = false;
    } else {
      clearError(fields.academicYear);
    }

    // Validate Motivation Statement
    if (!fields.motivation.value.trim() || fields.motivation.value.trim().length < 25) {
      setError(fields.motivation, "Please provide a brief statement of interest (min 25 characters).");
      isValid = false;
    } else {
      clearError(fields.motivation);
    }

    // Validate Ethics Agreement
    if (!fields.ethicsAgree.checked) {
      setError(fields.ethicsAgree, "You must agree to the IEEE Code of Ethics to apply.");
      isValid = false;
    } else {
      clearError(fields.ethicsAgree);
    }

    // Get selected focus
    const focusSelected = form.querySelector('input[name="interestDomain"]:checked');

    if (!isValid) {
      // Focus first error
      const firstInvalid = form.querySelector(".is-invalid, .has-error input, .has-error select, .has-error textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // If valid: construct Swiss-style confirmation receipt
    const refCode = "TEMS-2026-" + Math.floor(1000 + Math.random() * 9000);
    const submissionTime = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";

    const applicantData = {
      refCode: refCode,
      name: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      major: fields.major.value.trim(),
      year: fields.academicYear.value,
      focus: focusSelected ? focusSelected.value : "General Technology Management",
      timestamp: submissionTime
    };

    if (alertReceipt) {
      alertReceipt.innerHTML = `
        <strong>APPLICATION REFERENCE:</strong> ${applicantData.refCode}<br>
        <strong>APPLICANT:</strong> ${applicantData.name} (${applicantData.email})<br>
        <strong>PROGRAM & YEAR:</strong> ${applicantData.major} [${applicantData.year}]<br>
        <strong>PRIMARY DOMAIN:</strong> ${applicantData.focus}<br>
        <strong>TIMESTAMP:</strong> ${applicantData.timestamp}<br>
        <strong>STATUS:</strong> QUEUED FOR EXECUTIVE COMMITTEE REVIEW (48-HOUR SLA)
      `;
    }

    feedbackAlert.classList.add("success");
    feedbackAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Lock and reset form fields
    form.reset();
  });
}
