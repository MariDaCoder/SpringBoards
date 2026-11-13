// Springboards for Community Development - Client Logic
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // Ensure skip link reliably moves keyboard focus to #main-content
  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.getElementById("main-content");
  if (skipLink && mainContent) {
    skipLink.addEventListener("click", () => {
      mainContent.focus();
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;
      navToggle.setAttribute("aria-expanded", String(nextExpanded));
      navToggle.classList.toggle("active", nextExpanded);
      navMenu.classList.toggle("open", nextExpanded);
      if (nextExpanded) {
        const firstLink = navMenu.querySelector("a, button");
        if (firstLink && typeof firstLink.focus === "function") {
          firstLink.focus();
        }
      }
    });

    const navItems = navMenu.querySelectorAll("a, button");
    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains("open")) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!navMenu.classList.contains("open")) return;
      if (e.key === "Escape") {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
        return;
      }
      if (e.key === "Tab") {
        const focusable = [navToggle, ...Array.from(navMenu.querySelectorAll("a, button:not([disabled])"))].filter(
          (el) => el && el.offsetParent !== null
        );
        if (focusable.length < 2) return;
        const firstItem = focusable[0];
        const lastItem = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    });
  }

  const sections = [
    { id: "our-mission", link: document.querySelector(".nav-link[href='#our-mission']") },
    { id: "how-it-works", link: document.querySelector(".nav-link[href='#how-it-works']") },
    { id: "our-programs", link: document.querySelector(".nav-link[href='#our-programs']") },
    { id: "faq", link: document.querySelector(".nav-link[href='#faq']") },
    { id: "footer", link: document.querySelector(".nav-link[href='#footer']") }
  ].filter(s => s.link && document.getElementById(s.id));

  function updateActiveLink() {
    const scrollPos = window.scrollY + 180;
    let currentId = null;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollPos) {
        currentId = sections[i].id;
        break;
      }
    }
    sections.forEach(({ id, link }) => {
      if (id === currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  // MODAL FOCUS TRAPPING & ACCESSIBILITY MANAGEMENT
  let lastActiveModalTrigger = null;

  const openModalWithFocus = (modal, initialElement) => {
    const existingOpenModals = document.querySelectorAll(".inquiry-modal:not([hidden])");
    if (existingOpenModals.length === 0) {
      lastActiveModalTrigger = document.activeElement;
    } else {
      existingOpenModals.forEach((openModal) => {
        if (openModal !== modal) {
          openModal.hidden = true;
        }
      });
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (initialElement && typeof initialElement.focus === "function") {
      initialElement.focus();
    }
  };

  const closeModalWithFocus = (modal) => {
    modal.hidden = true;
    const remainingOpen = document.querySelector(".inquiry-modal:not([hidden])");
    if (!remainingOpen) {
      document.body.classList.remove("modal-open");
      if (lastActiveModalTrigger && typeof lastActiveModalTrigger.focus === "function") {
        lastActiveModalTrigger.focus();
        lastActiveModalTrigger = null;
      }
    }
  };

  // Global trap for Tab and Escape across all modals
  document.addEventListener("keydown", (event) => {
    const activeModal = document.querySelector(".inquiry-modal:not([hidden])");
    if (!activeModal) return;

    if (event.key === "Escape") {
      closeModalWithFocus(activeModal);
      return;
    }

    if (event.key === "Tab") {
      const candidates = Array.from(
        activeModal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const focusable = candidates.filter(
        (el) => !el.closest("[hidden]") && !el.classList.contains("sr-only-honeypot") && el.offsetParent !== null
      );
      if (!focusable.length) return;

      const firstItem = focusable[0];
      const lastItem = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstItem || !activeModal.contains(document.activeElement)) {
          event.preventDefault();
          lastItem.focus();
        }
      } else {
        if (document.activeElement === lastItem || !activeModal.contains(document.activeElement)) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    }
  });

  // ACCESSIBLE FORM VALIDATION, INLINE FIELD FEEDBACK & STATE HELPERS
  const getOrCreateFieldFeedback = (field) => {
    if (!field || !field.parentElement) return null;
    let feedback = field.parentElement.querySelector(".field-feedback");
    if (!feedback) {
      feedback = document.createElement("span");
      feedback.className = "field-feedback";
      const baseId = field.id || field.name || `field-${Math.random().toString(36).slice(2, 7)}`;
      feedback.id = `${baseId}-feedback`;
      feedback.hidden = true;
      field.parentElement.appendChild(feedback);
    }
    if (feedback.id) {
      const existing = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (!existing.includes(feedback.id)) {
        existing.push(feedback.id);
        field.setAttribute("aria-describedby", existing.join(" "));
      }
    }
    return feedback;
  };

  const setFieldFeedback = (field, message = "", state = "neutral") => {
    if (!field) return;
    const feedback = getOrCreateFieldFeedback(field);
    if (state === "error") {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      field.setAttribute("aria-invalid", "true");
      if (feedback && message) {
        feedback.className = "field-feedback is-error";
        feedback.textContent = `⚠ ${message}`;
        feedback.hidden = false;
      }
    } else if (state === "valid") {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      field.setAttribute("aria-invalid", "false");
      if (feedback) {
        if (message) {
          feedback.className = "field-feedback is-valid";
          feedback.textContent = `✓ ${message}`;
          feedback.hidden = false;
        } else {
          feedback.textContent = "";
          feedback.hidden = true;
        }
      }
    } else {
      field.classList.remove("is-invalid", "is-valid");
      field.removeAttribute("aria-invalid");
      if (feedback) {
        feedback.textContent = "";
        feedback.hidden = true;
        feedback.className = "field-feedback";
      }
    }
  };

  const setFormError = (statusEl, message, invalidFields = [], fieldMessages = {}) => {
    if (statusEl) {
      statusEl.classList.remove("is-loading", "is-success");
      statusEl.classList.add("is-error");
      statusEl.setAttribute("role", "alert");
      statusEl.setAttribute("aria-live", "assertive");
      statusEl.textContent = `⚠ Error: ${message}`;
      const parentForm = statusEl.closest("form");
      if (window.SpringboardsAnalytics?.trackFormError) {
        window.SpringboardsAnalytics.trackFormError(parentForm?.id || "form", message);
      }
    }
    invalidFields.forEach((field, idx) => {
      if (field) {
        const specificMsg = fieldMessages[field.name] || message;
        setFieldFeedback(field, specificMsg, "error");
        if (idx === 0 && typeof field.focus === "function") {
          field.focus();
        }
      }
    });
  };

  const setFormLoading = (formEl, submitBtn, statusEl, message) => {
    if (formEl) {
      formEl.dataset.submitting = "true";
      formEl.setAttribute("aria-busy", "true");
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.setAttribute("aria-busy", "true");
    }
    if (statusEl) {
      statusEl.classList.remove("is-error", "is-success");
      statusEl.classList.add("is-loading");
      statusEl.setAttribute("role", "status");
      statusEl.setAttribute("aria-live", "polite");
      statusEl.textContent = message;
    }
  };

  const clearFormBusyState = (formEl, submitBtn, statusEl) => {
    if (formEl) {
      delete formEl.dataset.submitting;
      formEl.removeAttribute("aria-busy");
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
      submitBtn.removeAttribute("aria-busy");
    }
    if (statusEl) {
      statusEl.classList.remove("is-loading");
    }
  };

  const clearFormErrorState = (formEl, statusEl) => {
    if (statusEl) {
      statusEl.classList.remove("is-error", "is-loading", "is-success");
      statusEl.setAttribute("role", "status");
      statusEl.setAttribute("aria-live", "polite");
      statusEl.textContent = "";
    }
    if (formEl) {
      formEl.querySelectorAll("input, select, textarea").forEach((el) => {
        setFieldFeedback(el, "", "neutral");
      });
    }
  };

  // PHONE AUTO-FORMATTING & VALIDATION HELPERS
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const isValidEmail = (email) => {
    if (!email) return false;
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const isValidPhone = (phone) => {
    if (!phone) return false;
    const digits = phone.replace(/[^\d]/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
  };

  const syncFormStatusAfterFieldFix = (field) => {
    const form = field?.closest("form");
    if (!form) return;
    if (!form.querySelector(".is-invalid, [aria-invalid='true']")) {
      const status = form.querySelector(".form-status");
      if (status && status.classList.contains("is-error")) {
        status.classList.remove("is-error");
        status.textContent = "";
      }
    }
  };

  // Attach phone formatting mask & real-time validation feedback to all tel inputs
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", (e) => {
      const formatted = formatPhoneNumber(e.target.value);
      e.target.value = formatted;
      if (isValidPhone(formatted)) {
        setFieldFeedback(e.target, "Valid 10-digit phone number", "valid");
        const form = e.target.closest("form");
        const emailField = form?.elements?.email;
        if (emailField && emailField.classList.contains("is-invalid") && !emailField.value.trim()) {
          setFieldFeedback(emailField, "", "neutral");
        }
        syncFormStatusAfterFieldFix(e.target);
      } else if (!formatted.trim()) {
        setFieldFeedback(e.target, "", "neutral");
      }
    });
    input.addEventListener("blur", (e) => {
      const val = e.target.value.trim();
      if (val && !isValidPhone(val)) {
        setFieldFeedback(e.target, "Enter a 10-digit phone number (e.g. 334-555-0199).", "error");
      }
    });
  });

  document.querySelectorAll('input[type="email"], input[type="text"]').forEach((input) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (e.target.type === "email") {
        if (isValidEmail(val)) {
          setFieldFeedback(e.target, "Valid email address", "valid");
          const form = e.target.closest("form");
          const phoneField = form?.elements?.phone;
          if (phoneField && phoneField.classList.contains("is-invalid") && !phoneField.value.trim()) {
            setFieldFeedback(phoneField, "", "neutral");
          }
          syncFormStatusAfterFieldFix(e.target);
        } else if (!val) {
          setFieldFeedback(e.target, "", "neutral");
        }
      } else if (["name", "donorName", "companyName", "contactName"].includes(e.target.name)) {
        if (val.length >= 2) {
          setFieldFeedback(e.target, "", "valid");
          syncFormStatusAfterFieldFix(e.target);
        } else if (!val) {
          setFieldFeedback(e.target, "", "neutral");
        }
      } else {
        setFieldFeedback(e.target, "", "neutral");
        syncFormStatusAfterFieldFix(e.target);
      }
    });
    input.addEventListener("blur", (e) => {
      const val = e.target.value.trim();
      if (e.target.type === "email" && val && !isValidEmail(val)) {
        setFieldFeedback(e.target, "Format email as name@example.com.", "error");
      }
    });
  });

  // PROGRAM INQUIRY MODAL & CONFIRMATION
  const inquiryModal = document.getElementById("inquiryModal");
  const inquiryModalTitle = document.getElementById("inquiryModalTitle");
  const inquiryModalDescription = document.getElementById("inquiryModalDescription");
  const inquiryFormView = document.getElementById("inquiryFormView");
  const inquiryConfirmationScreen = document.getElementById("inquiryConfirmationScreen");
  const inquiryForm = document.getElementById("programInquiryForm");
  const inquiryDetails = {
    General: "Have questions about our tuition-free trade training, workshop schedule, or enrollment? Share one way to reach you and our team will follow up directly.",
    Learn: "Ready to start trade training and certifications? Share one way to reach you and we will follow up about enrollment.",
    Train: "To begin Transitional Jobs or OJT, participants must first be verified through a career center and referred to a participating worksite. Share one way to reach you and we will help point you to the next step.",
    Build: "Interested in apprenticeship? Share one way to reach you and we will follow up with current pathway information and next steps."
  };

  if (inquiryModal && inquiryForm) {
    document.querySelectorAll(".program-inquiry-button").forEach((button) => {
      button.addEventListener("click", () => {
        inquiryForm.reset();
        inquiryFormView.hidden = false;
        inquiryConfirmationScreen.hidden = true;
        clearFormErrorState(inquiryForm, inquiryForm.querySelector(".form-status"));
        const prog = button.dataset.program || "General";
        inquiryForm.elements.program.value = prog;
        inquiryModalTitle.textContent = prog === "General" ? "Request Program Information" : `${prog} program inquiry`;
        inquiryModalDescription.textContent = inquiryDetails[prog] || "Share your contact details.";
        openModalWithFocus(inquiryModal, inquiryForm.elements.name);
      });
    });

    document.querySelectorAll("[data-inquiry-close]").forEach((control) => {
      control.addEventListener("click", () => {
        closeModalWithFocus(inquiryModal);
      });
    });

    inquiryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = inquiryForm.querySelector(".form-status");
      const submit = inquiryForm.querySelector(".program-submit");
      if (submit.disabled || inquiryForm.dataset.submitting === "true") return;
      const program = inquiryForm.elements.program.value || "General";
      const formData = new FormData(inquiryForm);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();

      clearFormErrorState(inquiryForm, status);

      // 1. Validate Name
      if (!name || name.length < 2) {
        setFormError(status, "Please enter your full name, minimum 2 characters.", [inquiryForm.elements.name], {
          name: "Enter your first and last name (at least 2 characters)."
        });
        return;
      }

      // 2. Validate at least one contact method
      if (!phone && !email) {
        setFormError(status, "Please provide either a phone number or email address.", [inquiryForm.elements.phone, inquiryForm.elements.email], {
          phone: "Add a 10-digit phone number or enter an email address below.",
          email: "Add an email address or enter a 10-digit phone number above."
        });
        return;
      }

      // 3. Validate Phone format if provided
      if (phone && !isValidPhone(phone)) {
        setFormError(status, "Please enter a valid 10-digit phone number (e.g. 555-123-4567).", [inquiryForm.elements.phone], {
          phone: "Include area code and 7 digits (e.g. 334-555-0199)."
        });
        return;
      }

      // 4. Validate Email format if provided
      if (email && !isValidEmail(email)) {
        setFormError(status, "Please enter a valid email address, e.g. name@example.com.", [inquiryForm.elements.email], {
          email: "Format as name@domain.com without spaces."
        });
        return;
      }

      // Honeypot anti-spam check (silent deflection)
      const honeypot = formData.get("website_url");
      if (honeypot) {
        inquiryFormView.hidden = true;
        inquiryConfirmationScreen.hidden = false;
        inquiryForm.reset();
        return;
      }

      setFormLoading(inquiryForm, submit, status, "Sending your inquiry...");

      try {
        let delivered = false;
        let serverValidationError = null;
        try {
          const res = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, program })
          });
          if (res.ok) {
            delivered = true;
          } else if (res.status === 400 || res.status === 429) {
            const errData = await res.json().catch(() => ({}));
            serverValidationError = errData.error || "Please check your entries and try again.";
          }
        } catch {
          // Server endpoint fallback
        }

        if (serverValidationError) {
          setFormError(status, serverValidationError);
          return;
        }

        if (!delivered) {
          const directRes = await fetch(
            "https://firestore.googleapis.com/v1/projects/springboards-community-dev/databases/main/documents/programInquiries",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fields: {
                  program: { stringValue: program },
                  tag: { stringValue: `program-${program.toLowerCase()}` },
                  name: { stringValue: name },
                  phone: { stringValue: phone },
                  email: { stringValue: email },
                  deliveredTo: { stringValue: "info@springboardsfcd.org" },
                  createdAt: { timestampValue: new Date().toISOString() }
                }
              })
            }
          );
          if (!directRes.ok) {
            throw new Error(`Inquiry submission failed with status ${directRes.status}.`);
          }
        }

        window.SpringboardsAnalytics?.trackFormSuccess?.("programInquiryForm");

        // Show Confirmation Screen
        inquiryFormView.hidden = true;
        inquiryConfirmationScreen.hidden = false;
        const confirmName = inquiryConfirmationScreen.querySelector(".confirm-name");
        const confirmProgram = inquiryConfirmationScreen.querySelector(".confirm-program");
        if (confirmName) confirmName.textContent = name;
        if (confirmProgram) confirmProgram.textContent = program;

        const doneButton = inquiryConfirmationScreen.querySelector(".confirmation-done-button");
        if (doneButton) doneButton.focus();

        inquiryForm.reset();
        clearFormErrorState(inquiryForm, status);
      } catch (error) {
        console.error(error);
        setFormError(status, "We could not deliver this inquiry right now. Please try again, call 731.388.WORK, or email info@springboardsfcd.org.");
      } finally {
        clearFormBusyState(inquiryForm, submit, status);
      }
    });
  }

  // VOLUNTEER INTEREST INQUIRY MODAL & CONFIRMATION
  const volunteerSignupModal = document.getElementById("volunteerSignupModal");
  const volunteerFormView = document.getElementById("volunteerFormView");
  const volunteerConfirmationScreen = document.getElementById("volunteerConfirmationScreen");
  const volunteerSignupForm = document.getElementById("volunteerSignupForm");

  if (volunteerSignupModal && volunteerSignupForm) {
    document.querySelectorAll(".event-signup-button").forEach((button) => {
      button.addEventListener("click", () => {
        volunteerSignupForm.reset();
        volunteerFormView.hidden = false;
        volunteerConfirmationScreen.hidden = true;
        clearFormErrorState(volunteerSignupForm, volunteerSignupForm.querySelector(".form-status"));
        const nameField = volunteerSignupForm.elements.name;
        openModalWithFocus(volunteerSignupModal, nameField);
      });
    });

    document.querySelectorAll("[data-volunteer-close]").forEach((control) => {
      control.addEventListener("click", () => {
        closeModalWithFocus(volunteerSignupModal);
      });
    });

    volunteerSignupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = volunteerSignupForm.querySelector(".form-status");
      const submit = volunteerSignupForm.querySelector(".program-submit");
      if (submit.disabled || volunteerSignupForm.dataset.submitting === "true") return;
      const formData = new FormData(volunteerSignupForm);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const availability = String(formData.get("availability") || "flexible").trim();
      const interest = String(formData.get("interest") || "general").trim();
      const organization = String(formData.get("organization") || "").trim();

      clearFormErrorState(volunteerSignupForm, status);

      // 1. Validate Name
      if (!name || name.length < 2) {
        setFormError(status, "Please enter your full name, minimum 2 characters.", [volunteerSignupForm.elements.name], {
          name: "Enter your first and last name (at least 2 characters)."
        });
        return;
      }

      // 2. Validate at least one contact method
      if (!phone && !email) {
        setFormError(status, "Please provide either a phone number or email address.", [volunteerSignupForm.elements.phone, volunteerSignupForm.elements.email], {
          phone: "Add a 10-digit phone number or enter an email address below.",
          email: "Add an email address or enter a 10-digit phone number above."
        });
        return;
      }

      // 3. Validate Phone format if provided
      if (phone && !isValidPhone(phone)) {
        setFormError(status, "Please enter a valid 10-digit phone number (e.g. 555-123-4567).", [volunteerSignupForm.elements.phone], {
          phone: "Include area code and 7 digits (e.g. 334-555-0199)."
        });
        return;
      }

      // 4. Validate Email format if provided
      if (email && !isValidEmail(email)) {
        setFormError(status, "Please enter a valid email address, e.g. name@example.com.", [volunteerSignupForm.elements.email], {
          email: "Format as name@domain.com without spaces."
        });
        return;
      }

      // Honeypot anti-spam check (silent deflection)
      const honeypot = formData.get("website_url");
      if (honeypot) {
        volunteerFormView.hidden = true;
        volunteerConfirmationScreen.hidden = false;
        volunteerSignupForm.reset();
        return;
      }

      setFormLoading(volunteerSignupForm, submit, status, "Submitting your volunteer interest...");

      try {
        let delivered = false;
        let serverValidationError = null;
        try {
          const res = await fetch("/api/volunteer-signups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, availability, interest, organization })
          });
          if (res.ok) {
            delivered = true;
          } else if (res.status === 400 || res.status === 429) {
            const errData = await res.json().catch(() => ({}));
            serverValidationError = errData.error || "Please check your entries and try again.";
          }
        } catch {
          // Server endpoint fallback
        }

        if (serverValidationError) {
          setFormError(status, serverValidationError);
          return;
        }

        if (!delivered) {
          const directRes = await fetch(
            "https://firestore.googleapis.com/v1/projects/springboards-community-dev/databases/main/documents/volunteerSignups",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fields: {
                  event: { stringValue: "General Volunteer Interest" },
                  location: { stringValue: "Springboards Community Center" },
                  availability: { stringValue: availability },
                  interest: { stringValue: interest },
                  name: { stringValue: name },
                  phone: { stringValue: phone },
                  email: { stringValue: email },
                  deliveredTo: { stringValue: "info@springboardsfcd.org" },
                  createdAt: { timestampValue: new Date().toISOString() }
                }
              })
            }
          );
          if (!directRes.ok) {
            throw new Error(`Volunteer interest submission failed with status ${directRes.status}.`);
          }
        }

        window.SpringboardsAnalytics?.trackFormSuccess?.("volunteerSignupForm");

        // Show Confirmation Screen
        volunteerFormView.hidden = true;
        volunteerConfirmationScreen.hidden = false;
        const confirmName = volunteerConfirmationScreen.querySelector(".confirm-name");
        const confirmInterest = volunteerConfirmationScreen.querySelector(".confirm-interest");
        if (confirmName) confirmName.textContent = name;
        if (confirmInterest) {
          const interestLabels = {
            "cleaning-demo": "cleaning and demo support",
            "tools-prep": "tools and safety preparation",
            "community-outreach": "community outreach",
            "general": "general community support"
          };
          confirmInterest.textContent = interestLabels[interest] || interest;
        }

        const doneButton = volunteerConfirmationScreen.querySelector(".confirmation-done-button");
        if (doneButton) doneButton.focus();

        volunteerSignupForm.reset();
        clearFormErrorState(volunteerSignupForm, status);
      } catch (error) {
        console.error(error);
        setFormError(status, "We could not save your submission right now. Please try again, call 731.388.WORK, or email info@springboardsfcd.org.");
      } finally {
        clearFormBusyState(volunteerSignupForm, submit, status);
      }
    });
  }

  // PRIVACY POLICY & TERMS MODAL
  const privacyModal = document.getElementById("privacyModal");
  const openPrivacyBtn = document.getElementById("openPrivacyModal");
  if (privacyModal && openPrivacyBtn) {
    openPrivacyBtn.addEventListener("click", () => {
      openModalWithFocus(privacyModal, privacyModal.querySelector(".btn-cta"));
    });
    privacyModal.querySelectorAll("[data-privacy-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeModalWithFocus(privacyModal);
      });
    });
  }

  // CANDIDATE INTAKE MODAL
  const candidateModal = document.getElementById("candidateModal");
  const candidateFormView = document.getElementById("candidateFormView");
  const candidateConfirmationScreen = document.getElementById("candidateConfirmationScreen");
  const candidateForm = document.getElementById("candidateApplicationForm");

  const openCandidateModal = (defaultTrade) => {
    if (!candidateModal || !candidateForm) return;
    candidateForm.reset();
    candidateFormView.hidden = false;
    candidateConfirmationScreen.hidden = true;
    const isPrequalification = new URLSearchParams(window.location.search).get("start") === "prequalification";
    const candidateTitle = document.getElementById("candidateModalTitle");
    const candidateIntro = candidateFormView.querySelector(".modal-subtext");
    if (isPrequalification) {
      if (candidateTitle) candidateTitle.textContent = "Transitional Jobs Pre-Qualification";
      if (candidateIntro) candidateIntro.textContent = "Answer a few questions so our team can help identify your next steps toward training and work.";
    }
    clearFormErrorState(candidateForm, candidateForm.querySelector(".form-status"));
    if (defaultTrade && candidateForm.elements.trade) {
      candidateForm.elements.trade.value = defaultTrade;
    }
    const nameField = candidateForm.elements.name;
    openModalWithFocus(candidateModal, nameField);
  };

  document.querySelectorAll(".btn-candidate-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const defaultTrade = btn.dataset.tradeDefault || "Carpentry & Construction Technology";
      openCandidateModal(defaultTrade);
    });
  });

  if (new URLSearchParams(window.location.search).get("start") === "prequalification") {
    openCandidateModal("Carpentry & Construction Technology");
  }

  if (candidateModal && candidateForm) {
    candidateModal.querySelectorAll("[data-candidate-close]").forEach((control) => {
      control.addEventListener("click", () => {
        closeModalWithFocus(candidateModal);
      });
    });

    candidateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = candidateForm.querySelector(".form-status");
      const submit = candidateForm.querySelector(".program-submit");
      if (submit.disabled || candidateForm.dataset.submitting === "true") return;
      const formData = new FormData(candidateForm);

      // Honeypot check
      if (formData.get("website_url")) {
        candidateFormView.hidden = true;
        candidateConfirmationScreen.hidden = false;
        candidateForm.reset();
        return;
      }

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const trade = String(formData.get("trade") || "Carpentry & Construction Technology").trim();
      const backgroundStatus = String(formData.get("backgroundStatus") || "").trim();
      const transportation = String(formData.get("transportation") || "").trim();
      const careerCenter = String(formData.get("careerCenter") || "").trim();
      const notes = String(formData.get("notes") || "").trim();

      clearFormErrorState(candidateForm, status);

      if (!name || name.length < 2) {
        setFormError(status, "Please enter your full legal name (minimum 2 characters).", [candidateForm.elements.name], {
          name: "Enter your full legal name (at least 2 characters)."
        });
        return;
      }

      if (!phone && !email) {
        setFormError(status, "Please provide either a phone number or email address so we can reach you.", [candidateForm.elements.phone, candidateForm.elements.email], {
          phone: "Provide a 10-digit phone number or enter an email address.",
          email: "Provide an email address or enter a 10-digit phone number."
        });
        return;
      }

      if (phone && !isValidPhone(phone)) {
        setFormError(status, "Please enter a valid 10-digit phone number, e.g. (334) 556-1234.", [candidateForm.elements.phone], {
          phone: "Include area code and 7 digits (e.g. 334-555-0199)."
        });
        return;
      }

      if (email && !isValidEmail(email)) {
        setFormError(status, "Please enter a valid email address (e.g. name@example.com).", [candidateForm.elements.email], {
          email: "Format as name@domain.com without spaces."
        });
        return;
      }

      setFormLoading(candidateForm, submit, status, "Submitting candidate application...");

      try {
        let delivered = false;
        let serverValidationError = null;
        try {
          const res = await fetch("/api/candidates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, trade, backgroundStatus, transportation, careerCenter, notes })
          });
          if (res.ok) {
            delivered = true;
          } else if (res.status === 400 || res.status === 429) {
            const errData = await res.json().catch(() => ({}));
            serverValidationError = errData.error || "Please check your application details and try again.";
          }
        } catch {}

        if (serverValidationError) {
          setFormError(status, serverValidationError);
          return;
        }

        if (!delivered) {
          // Direct fallback to Firestore REST
          await fetch(
            "https://firestore.googleapis.com/v1/projects/springboards-community-dev/databases/main/documents/candidateApplications",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fields: {
                  name: { stringValue: name },
                  phone: { stringValue: phone },
                  email: { stringValue: email },
                  trade: { stringValue: trade },
                  backgroundStatus: { stringValue: backgroundStatus },
                  transportation: { stringValue: transportation },
                  careerCenter: { stringValue: careerCenter },
                  notes: { stringValue: notes },
                  createdAt: { timestampValue: new Date().toISOString() }
                }
              })
            }
          ).catch(() => {});
        }

        window.SpringboardsAnalytics?.trackFormSuccess?.("candidateApplicationForm");

        candidateFormView.hidden = true;
        candidateConfirmationScreen.hidden = false;
        const confirmName = candidateConfirmationScreen.querySelector(".confirm-name");
        const confirmTrade = candidateConfirmationScreen.querySelector(".confirm-trade");
        if (confirmName) confirmName.textContent = name;
        if (confirmTrade) confirmTrade.textContent = trade;
        const doneBtn = candidateConfirmationScreen.querySelector(".confirmation-done-button");
        if (doneBtn) doneBtn.focus();
        candidateForm.reset();
        clearFormErrorState(candidateForm, status);
      } catch (err) {
        console.error(err);
        setFormError(status, "Could not submit application right now. Please try again, call 731.388.WORK, or email info@springboardsfcd.org.");
      } finally {
        clearFormBusyState(candidateForm, submit, status);
      }
    });
  }

  // BUSINESS & EMPLOYER PARTNERSHIP MODAL
  const partnerModal = document.getElementById("partnerModal");
  const partnerFormView = document.getElementById("partnerFormView");
  const partnerConfirmationScreen = document.getElementById("partnerConfirmationScreen");
  const partnerForm = document.getElementById("partnerApplicationForm");

  const openPartnerModal = () => {
    if (!partnerModal || !partnerForm) return;
    partnerForm.reset();
    partnerFormView.hidden = false;
    partnerConfirmationScreen.hidden = true;
    clearFormErrorState(partnerForm, partnerForm.querySelector(".form-status"));
    const companyField = partnerForm.elements.companyName;
    openModalWithFocus(partnerModal, companyField);
  };

  document.querySelectorAll(".btn-partner-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openPartnerModal();
    });
  });

  if (partnerModal && partnerForm) {
    partnerModal.querySelectorAll("[data-partner-close]").forEach((control) => {
      control.addEventListener("click", () => {
        closeModalWithFocus(partnerModal);
      });
    });

    partnerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = partnerForm.querySelector(".form-status");
      const submit = partnerForm.querySelector(".program-submit");
      if (submit.disabled || partnerForm.dataset.submitting === "true") return;
      const formData = new FormData(partnerForm);

      if (formData.get("website_url")) {
        partnerFormView.hidden = true;
        partnerConfirmationScreen.hidden = false;
        partnerForm.reset();
        return;
      }

      const companyName = String(formData.get("companyName") || "").trim();
      const contactName = String(formData.get("contactName") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const partnershipType = String(formData.get("partnershipType") || "Host Worksite").trim();
      const tradeSpecialty = String(formData.get("tradeSpecialty") || "General").trim();
      const message = String(formData.get("message") || "").trim();

      clearFormErrorState(partnerForm, status);

      if (!companyName || companyName.length < 2) {
        setFormError(status, "Please provide your company or organization name.", [partnerForm.elements.companyName], {
          companyName: "Enter your business, municipality, or organization name."
        });
        return;
      }

      if (!contactName || contactName.length < 2) {
        setFormError(status, "Please provide a contact person name.", [partnerForm.elements.contactName], {
          contactName: "Enter the primary contact's first and last name."
        });
        return;
      }

      if (!phone && !email) {
        setFormError(status, "Please provide either a phone number or business email address.", [partnerForm.elements.phone, partnerForm.elements.email], {
          phone: "Provide a 10-digit business phone number or enter an email.",
          email: "Provide a business email address or enter a 10-digit phone number."
        });
        return;
      }

      if (phone && !isValidPhone(phone)) {
        setFormError(status, "Please enter a valid 10-digit phone number.", [partnerForm.elements.phone], {
          phone: "Include area code and 7 digits (e.g. 334-555-0199)."
        });
        return;
      }

      if (email && !isValidEmail(email)) {
        setFormError(status, "Please enter a valid business email address.", [partnerForm.elements.email], {
          email: "Format as name@company.com without spaces."
        });
        return;
      }

      setFormLoading(partnerForm, submit, status, "Submitting partnership inquiry...");

      try {
        let serverValidationError = null;
        try {
          const res = await fetch("/api/partnerships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyName, contactName, phone, email, partnershipType, tradeSpecialty, message })
          });
          if (res.status === 400 || res.status === 429) {
            const errData = await res.json().catch(() => ({}));
            serverValidationError = errData.error || "Please check your partnership details and try again.";
          }
        } catch {}

        if (serverValidationError) {
          setFormError(status, serverValidationError);
          return;
        }

        window.SpringboardsAnalytics?.trackFormSuccess?.("partnerApplicationForm");

        partnerFormView.hidden = true;
        partnerConfirmationScreen.hidden = false;
        const confirmName = partnerConfirmationScreen.querySelector(".confirm-name");
        const confirmCompany = partnerConfirmationScreen.querySelector(".confirm-company");
        if (confirmName) confirmName.textContent = contactName;
        if (confirmCompany) confirmCompany.textContent = companyName;

        const doneBtn = partnerConfirmationScreen.querySelector(".confirmation-done-button");
        if (doneBtn) doneBtn.focus();

        partnerForm.reset();
        clearFormErrorState(partnerForm, status);
      } catch (err) {
        console.error(err);
        setFormError(status, "Could not submit inquiry right now. Please try again, call 731.388.WORK, or email info@springboardsfcd.org.");
      } finally {
        clearFormBusyState(partnerForm, submit, status);
      }
    });
  }

  // DONATION & GIVING CENTER MODAL
  const donateModal = document.getElementById("donateModal");
  const donateFormView = document.getElementById("donateFormView");
  const donateConfirmationScreen = document.getElementById("donateConfirmationScreen");
  const donateForm = document.getElementById("donationPledgeForm");

  const openDonateModal = () => {
    if (!donateModal || !donateForm) return;
    donateForm.reset();
    donateFormView.hidden = false;
    donateConfirmationScreen.hidden = true;
    clearFormErrorState(donateForm, donateForm.querySelector(".form-status"));
    const donorField = donateForm.elements.donorName;
    openModalWithFocus(donateModal, donorField);
  };

  document.querySelectorAll(".btn-donate-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openDonateModal();
    });
  });

  if (donateModal && donateForm) {
    donateModal.querySelectorAll("[data-donate-close]").forEach((control) => {
      control.addEventListener("click", () => {
        closeModalWithFocus(donateModal);
      });
    });

    donateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = donateForm.querySelector(".form-status");
      const submit = donateForm.querySelector(".program-submit");
      if (submit.disabled || donateForm.dataset.submitting === "true") return;
      const formData = new FormData(donateForm);

      if (formData.get("website_url")) {
        donateFormView.hidden = true;
        donateConfirmationScreen.hidden = false;
        donateForm.reset();
        return;
      }

      const donorName = String(formData.get("donorName") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const donationType = String(formData.get("donationType") || "financial_sponsorship").trim();
      const pledgeAmount = String(formData.get("pledgeAmount") || "Custom").trim();
      const message = String(formData.get("message") || "").trim();
      const taxReceiptRequested = formData.get("taxReceiptRequested") === "yes";

      clearFormErrorState(donateForm, status);

      if (!donorName || donorName.length < 2) {
        setFormError(status, "Please enter your full name or organization name.", [donateForm.elements.donorName], {
          donorName: "Enter your full name or sponsoring organization (at least 2 characters)."
        });
        return;
      }

      if (!email || !isValidEmail(email)) {
        setFormError(status, "Please provide a valid email address so we can issue your tax acknowledgment.", [donateForm.elements.email], {
          email: "Enter a valid email address (e.g. donor@example.com) for your 501(c)(3) receipt."
        });
        return;
      }

      if (phone && !isValidPhone(phone)) {
        setFormError(status, "Please enter a valid 10-digit phone number.", [donateForm.elements.phone], {
          phone: "Include area code and 7 digits (e.g. 334-555-0199)."
        });
        return;
      }

      setFormLoading(donateForm, submit, status, "Recording your pledge...");

      try {
        let serverValidationError = null;
        try {
          const res = await fetch("/api/donations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ donorName, phone, email, donationType, pledgeAmount, message, taxReceiptRequested })
          });
          if (res.status === 400 || res.status === 429) {
            const errData = await res.json().catch(() => ({}));
            serverValidationError = errData.error || "Please check your pledge details and try again.";
          }
        } catch {}

        if (serverValidationError) {
          setFormError(status, serverValidationError);
          return;
        }

        window.SpringboardsAnalytics?.trackFormSuccess?.("donationPledgeForm");

        donateFormView.hidden = true;
        donateConfirmationScreen.hidden = false;
        const confirmName = donateConfirmationScreen.querySelector(".confirm-name");
        if (confirmName) confirmName.textContent = donorName;

        const doneBtn = donateConfirmationScreen.querySelector(".confirmation-done-button");
        if (doneBtn) doneBtn.focus();

        donateForm.reset();
        clearFormErrorState(donateForm, status);
      } catch (err) {
        console.error(err);
        setFormError(status, "Could not record pledge right now. Please try again, call 731.388.WORK, or email info@springboardsfcd.org.");
      } finally {
        clearFormBusyState(donateForm, submit, status);
      }
    });
  }

  // DOCUMENT CENTER & DOWNLOAD HUB MODAL
  const documentModal = document.getElementById("documentModal");
  const docPreviewContainer = document.getElementById("docPreviewContainer");
  const docPreviewImg = document.getElementById("docPreviewImg");
  const docPreviewTitle = document.getElementById("docPreviewTitle");
  const docPreviewDownloadBtn = document.getElementById("docPreviewDownloadBtn");
  const closeDocPreviewBtn = document.getElementById("closeDocPreviewBtn");

  const docAssetMap = {
    "springboards-community-flyer": {
      title: "Springboards Community Flyer & Volunteer Schedule",
      preview: "/springboards-community-flyer.webp",
      download: "/springboards-community-flyer.webp",
      filename: "Springboards_Community_Flyer.webp"
    }
  };

  const openDocumentCenter = (previewDocId) => {
    if (!documentModal) return;
    openModalWithFocus(documentModal, documentModal.querySelector(".btn-cta"));
    if (previewDocId && docAssetMap[previewDocId]) {
      showDocPreview(previewDocId);
    } else if (docPreviewContainer) {
      docPreviewContainer.style.display = "none";
    }
  };

  const showDocPreview = (docId) => {
    const asset = docAssetMap[docId];
    if (!asset || !docPreviewContainer || !docPreviewImg) return;
    docPreviewTitle.textContent = asset.title;
    docPreviewImg.src = asset.preview;
    docPreviewImg.alt = asset.title;
    if (docPreviewDownloadBtn) {
      docPreviewDownloadBtn.href = asset.download;
      docPreviewDownloadBtn.download = asset.filename;
    }
    docPreviewContainer.style.display = "block";
    docPreviewContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  document.querySelectorAll(".btn-doc-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const docId = btn.dataset.docView || null;
      openDocumentCenter(docId);
    });
  });

  document.querySelectorAll(".btn-view-doc").forEach((btn) => {
    btn.addEventListener("click", () => {
      const docId = btn.dataset.docView;
      showDocPreview(docId);
    });
  });

  if (closeDocPreviewBtn) {
    closeDocPreviewBtn.addEventListener("click", () => {
      if (docPreviewContainer) docPreviewContainer.style.display = "none";
    });
  }

  if (documentModal) {
    documentModal.querySelectorAll("[data-doc-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeModalWithFocus(documentModal);
      });
    });
  }

  // BACK TO TOP FLOATING BUTTON
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.hidden = false;
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // TOAST NOTIFICATION HELPER
  const toast = document.getElementById("toastNotification");
  let toastTimer = null;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    void toast.offsetWidth;
    toast.classList.add("is-active");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-active");
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 3200);
  };

  // COMMUNITY SHARE PAGE TRIGGER
  const shareBtn = document.getElementById("sharePageButton");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Springboards for Community Development",
            text: "WIOA authorized trade training and career pathways: based in Shawmut, Alabama, serving East Alabama.",
            url: window.location.href
          });
        } catch {
          // Cancelled by user
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("Page link copied to clipboard!");
        } catch {
          showToast("Visit springboardsfcd.org to share!");
        }
      } else {
        showToast("Visit springboardsfcd.org to share!");
      }
    });
  }

  // FOOTER PHONE BUSINESS HOURS LINK ROUTING (Mon–Thu, 8:00 AM – 4:00 PM Eastern Time)
  const footerPhonePrimaryLink = document.getElementById("footerPhonePrimaryLink");
  if (footerPhonePrimaryLink) {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false
      }).formatToParts(now);

      const partMap = {};
      parts.forEach((p) => { partMap[p.type] = p.value; });
      const weekday = partMap.weekday || "";
      const hour = parseInt(partMap.hour || "0", 10);
      const minute = parseInt(partMap.minute || "0", 10);
      const totalMinutes = hour * 60 + minute;

      const isBusinessDay = ["Mon", "Tue", "Wed", "Thu"].includes(weekday);
      const isWithinHours = totalMinutes >= 8 * 60 && totalMinutes < 16 * 60;
      const isOpen = isBusinessDay && isWithinHours;

      footerPhonePrimaryLink.setAttribute(
        "href",
        isOpen ? "tel:731.388.WORK" : "tel:731.388.WORK;postd=p"
      );
      footerPhonePrimaryLink.setAttribute(
        "aria-label",
        isOpen
          ? "Call 731.388.WORK directly (Business hours: Mon-Thu 8am-4pm EST)"
          : "Leave a voicemail at 731.388.WORK (After hours)"
      );
    } catch {
      footerPhonePrimaryLink.setAttribute("href", "tel:731.388.WORK");
    }
  }

  // COLLECTION LIST FILTERING & EMPTY STATE CONTROLLERS
  const setupCollectionFilter = ({
    gridSelector,
    itemSelector,
    tabSelector,
    tabAttr,
    itemCategoryAttr,
    searchInputId,
    clearBtnId,
    emptyStateId,
    emptyTitleId,
    resetBtnId,
    emptyQueryLabel
  }) => {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll(itemSelector));
    const tabs = Array.from(document.querySelectorAll(tabSelector));
    const searchInput = searchInputId ? document.getElementById(searchInputId) : null;
    const clearBtn = clearBtnId ? document.getElementById(clearBtnId) : null;
    const emptyState = emptyStateId ? document.getElementById(emptyStateId) : null;
    const emptyTitle = emptyTitleId ? document.getElementById(emptyTitleId) : null;
    const resetBtn = resetBtnId ? document.getElementById(resetBtnId) : null;

    let activeCategory = "all";

    const updateCollection = () => {
      const query = (searchInput?.value || "").trim().toLowerCase();
      if (clearBtn) clearBtn.hidden = !query;

      let visibleCount = 0;
      items.forEach((item) => {
        const category = item.getAttribute(itemCategoryAttr) || "";
        const keywords = item.getAttribute("data-keywords") || "";
        const haystack = `${item.textContent || ""} ${keywords}`.toLowerCase();
        const matchesCat = activeCategory === "all" || category === activeCategory;
        const matchesQuery = !query || haystack.includes(query);
        const isVisible = matchesCat && matchesQuery;
        item.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      grid.hidden = visibleCount === 0;
      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
        if (visibleCount === 0 && emptyTitle && query) {
          emptyTitle.textContent = `${emptyQueryLabel} “${searchInput.value.trim()}”`;
        }
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeCategory = tab.getAttribute(tabAttr) || "all";
        tabs.forEach((t) => {
          const isSelected = t === tab;
          t.classList.toggle("is-active", isSelected);
          t.setAttribute("aria-pressed", String(isSelected));
        });
        updateCollection();
      });
    });

    searchInput?.addEventListener("input", updateCollection);

    clearBtn?.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }
      updateCollection();
    });

    resetBtn?.addEventListener("click", () => {
      activeCategory = "all";
      if (searchInput) searchInput.value = "";
      tabs.forEach((t) => {
        const isAll = (t.getAttribute(tabAttr) || "all") === "all";
        t.classList.toggle("is-active", isAll);
        t.setAttribute("aria-pressed", String(isAll));
      });
      updateCollection();
    });
  };

  // 1. Skills & Trade Pathways Collection
  setupCollectionFilter({
    gridSelector: "#skillsLearnGrid",
    itemSelector: ".skill-learn-card",
    tabSelector: "[data-skill-filter]",
    tabAttr: "data-skill-filter",
    itemCategoryAttr: "data-skill-category",
    searchInputId: "skillsSearchInput",
    clearBtnId: "skillsSearchClear",
    emptyStateId: "skillsEmptyState",
    emptyTitleId: "skillsEmptyTitle",
    resetBtnId: "resetSkillsFilterBtn",
    emptyQueryLabel: "No trade modules matched"
  });

  // 2. Frequently Asked Questions Collection
  setupCollectionFilter({
    gridSelector: "#faqCollectionList",
    itemSelector: ".faq-item",
    tabSelector: "[data-faq-filter]",
    tabAttr: "data-faq-filter",
    itemCategoryAttr: "data-faq-category",
    searchInputId: "faqSearchInput",
    clearBtnId: "faqSearchClear",
    emptyStateId: "faqEmptyState",
    emptyTitleId: "faqEmptyTitle",
    resetBtnId: "resetFaqFilterBtn",
    emptyQueryLabel: "No questions matched"
  });

  // 3. Document Center Collection
  setupCollectionFilter({
    gridSelector: "#documentCollectionList",
    itemSelector: ".document-item-card",
    tabSelector: "[data-doc-filter]",
    tabAttr: "data-doc-filter",
    itemCategoryAttr: "data-doc-category",
    searchInputId: null,
    clearBtnId: null,
    emptyStateId: "documentEmptyState",
    emptyTitleId: null,
    resetBtnId: "resetDocFilterBtn",
    emptyQueryLabel: "No documents matched"
  });

  // =========================================================================
  // 4. PASSWORD-PROTECTED WORKSITE & DOCUMENT GATE CONTROLLER
  // =========================================================================
  const traineePortalModal = document.getElementById("traineePortalModal");
  const traineeAuthView = document.getElementById("traineePortalAuthView");
  const traineeUnlockedView = document.getElementById("traineePortalUnlockedView");
  const traineeAuthForm = document.getElementById("traineePortalAuthForm");
  const traineePassInput = document.getElementById("traineePortalPasscodeInput");
  const traineeToggleVis = document.getElementById("traineePortalToggleVisibility");
  const traineeCapsWarn = document.getElementById("traineePortalCapsWarning");
  const traineeErrorAlert = document.getElementById("traineePortalErrorAlert");
  const traineeSubmitBtn = document.getElementById("traineePortalSubmitBtn");
  const traineeLockBtn = document.getElementById("traineePortalLockBtn");

  const openTraineePortalGate = () => {
    if (!traineePortalModal) return;
    // Close document modal if open so modals don't stack
    const docModal = document.getElementById("documentModal");
    if (docModal && !docModal.hidden) docModal.hidden = true;

    traineePortalModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (traineeErrorAlert) traineeErrorAlert.hidden = true;
    setTimeout(() => {
      if (traineeAuthView && !traineeAuthView.hidden) {
        traineePassInput?.focus();
      }
    }, 60);
  };

  const closeTraineePortalGate = () => {
    if (!traineePortalModal) return;
    traineePortalModal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".btn-trainee-portal-trigger").forEach((btn) => {
    btn.addEventListener("click", openTraineePortalGate);
  });

  document.querySelectorAll("[data-trainee-portal-close]").forEach((el) => {
    el.addEventListener("click", closeTraineePortalGate);
  });

  traineeToggleVis?.addEventListener("click", () => {
    if (!traineePassInput) return;
    const isPassword = traineePassInput.type === "password";
    traineePassInput.type = isPassword ? "text" : "password";
    traineeToggleVis.textContent = isPassword ? "Hide" : "Show";
    traineeToggleVis.setAttribute("aria-pressed", String(isPassword));
    traineePassInput.focus();
  });

  if (traineePassInput && traineeCapsWarn) {
    const checkCapsLock = (event) => {
      if (typeof event.getModifierState === "function") {
        traineeCapsWarn.hidden = !event.getModifierState("CapsLock");
      }
    };
    traineePassInput.addEventListener("keydown", checkCapsLock);
    traineePassInput.addEventListener("keyup", checkCapsLock);
    traineePassInput.addEventListener("blur", () => {
      traineeCapsWarn.hidden = true;
    });
  }

  const showTraineeGateError = (title, message, steps = []) => {
    if (!traineeErrorAlert) return;
    const stepsHtml = steps.length
      ? `<ul>${steps.map((s) => `<li>${s}</li>`).join("")}</ul>`
      : "";
    traineeErrorAlert.innerHTML = `<strong>🔒 ${title}</strong><span>${message}</span>${stepsHtml}`;
    traineeErrorAlert.hidden = false;
  };

  traineeAuthForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = (traineePassInput?.value || "").trim();
    if (!code) {
      if (traineePassInput) {
        traineePassInput.classList.add("is-invalid");
        traineePassInput.setAttribute("aria-invalid", "true");
        traineePassInput.focus();
      }
      showTraineeGateError(
        "Worksite Passcode Required",
        "Please enter your assigned worksite passcode or staff PIN before submitting.",
        [
          "Check your Career Center orientation packet or employer onboarding email for your passcode.",
          "New candidates can click Apply for Tuition-Free Training below."
        ]
      );
      return;
    }

    if (traineePassInput) {
      traineePassInput.classList.remove("is-invalid");
      traineePassInput.removeAttribute("aria-invalid");
    }
    if (traineeErrorAlert) traineeErrorAlert.hidden = true;
    if (traineeSubmitBtn) {
      traineeSubmitBtn.classList.add("is-loading");
      traineeSubmitBtn.setAttribute("aria-busy", "true");
      traineeSubmitBtn.disabled = true;
    }

    try {
      const response = await fetch("/api/backoffice/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "admin", adminCode: code })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (traineeAuthView) traineeAuthView.hidden = true;
        if (traineeUnlockedView) traineeUnlockedView.hidden = false;
        if (traineePassInput) traineePassInput.value = "";
      } else {
        if (traineePassInput) {
          traineePassInput.classList.add("is-invalid");
          traineePassInput.setAttribute("aria-invalid", "true");
          traineePassInput.focus();
        }
        showTraineeGateError(
          response.status === 429 ? "Too Many Passcode Attempts" : "Passcode Not Recognized",
          data.error || "The passcode entered does not match an active worksite or staff credential.",
          [
            "Verify that Caps Lock is turned off and there are no extra spaces.",
            "Confirm your WIOA Activity 220 or OJT placement status with your Career Center case manager.",
            "Need help? Call 731.388.WORK or email info@springboardsfcd.org."
          ]
        );
      }
    } catch {
      showTraineeGateError(
        "Verification Service Temporarily Unavailable",
        "We could not verify your worksite passcode right now due to a connection interruption.",
        ["Please check your network connection and try again, or call 731.388.WORK."]
      );
    } finally {
      if (traineeSubmitBtn) {
        traineeSubmitBtn.classList.remove("is-loading");
        traineeSubmitBtn.removeAttribute("aria-busy");
        traineeSubmitBtn.disabled = false;
      }
    }
  });

  traineeLockBtn?.addEventListener("click", () => {
    if (traineeUnlockedView) traineeUnlockedView.hidden = true;
    if (traineeAuthView) traineeAuthView.hidden = false;
    if (traineeErrorAlert) traineeErrorAlert.hidden = true;
    traineePassInput?.focus();
  });

  // =========================================================================
  // 5. SITE SEARCH & SEARCH RESULTS PAGE CONTROLLER
  // =========================================================================
  const SITE_SEARCH_INDEX = [
    {
      id: "prog-carpentry",
      category: "programs",
      categoryLabel: "Trade Program",
      breadcrumb: "springboardsfcd.org › Programs › Carpentry",
      title: "Carpentry & Construction Technology",
      snippet: "Hands-on residential and commercial framing, blueprint reading, floor/wall layout, roof rafters, and power tool mastery in Shawmut, AL.",
      tags: ["100% Tuition-Free", "NCCER Craft", "Hands-On Workshop"],
      keywords: "carpentry wood framing construction blueprint rafters layout tools hammer saw",
      href: "#our-programs",
      actionLabel: "View Carpentry Program →"
    },
    {
      id: "prog-electrical",
      category: "programs",
      categoryLabel: "Trade Program",
      breadcrumb: "springboardsfcd.org › Programs › Electrical",
      title: "Electrical & Residential/Commercial Wiring",
      snippet: "Learn National Electrical Code (NEC) fundamentals, circuit installation, conduit bending, breaker panels, switches, and multimeter diagnostics.",
      tags: ["100% Tuition-Free", "NEC Code", "Circuit Diagnostics"],
      keywords: "electrical electrician wiring conduit circuits voltage NEC switches outlets",
      href: "#our-programs",
      actionLabel: "View Electrical Program →"
    },
    {
      id: "prog-hvac",
      category: "programs",
      categoryLabel: "Trade Program",
      breadcrumb: "springboardsfcd.org › Programs › HVAC",
      title: "HVAC & Mechanical Systems",
      snippet: "Heating, ventilation, and air conditioning fundamentals, airflow diagnostics, ductwork installation, refrigerant safety, and thermostat controls.",
      tags: ["100% Tuition-Free", "Mechanical Systems", "High-Demand Trade"],
      keywords: "hvac heating cooling air conditioning ductwork mechanical refrigerant technician",
      href: "#our-programs",
      actionLabel: "View HVAC Program →"
    },
    {
      id: "prog-plumbing",
      category: "programs",
      categoryLabel: "Trade Program",
      breadcrumb: "springboardsfcd.org › Programs › Plumbing",
      title: "Plumbing & Pipefitting Fundamentals",
      snippet: "Install and repair PEX, PVC, and copper piping systems, drainage assemblies, commercial fixtures, valves, and water pressure testing.",
      tags: ["100% Tuition-Free", "Copper / PEX / PVC", "Fixture Installation"],
      keywords: "plumbing plumber pipefitting pipes water drainage copper pvc pex fixtures",
      href: "#our-programs",
      actionLabel: "View Plumbing Program →"
    },
    {
      id: "prog-safety-osha",
      category: "programs",
      categoryLabel: "Trade Program",
      breadcrumb: "springboardsfcd.org › Programs › Jobsite Safety",
      title: "OSHA 10-Hour Construction Safety & Work Readiness",
      snippet: "Earn your OSHA 10 safety credential alongside PPE compliance, fall protection, hazard recognition, and professional jobsite communication.",
      tags: ["OSHA 10 Card", "PPE Included", "Jobsite Readiness"],
      keywords: "osha safety ppe hard hat gloves certification fall protection hazard readiness",
      href: "#our-programs",
      actionLabel: "Explore Safety Credential →"
    },
    {
      id: "elig-wioa",
      category: "eligibility",
      categoryLabel: "WIOA & Eligibility",
      breadcrumb: "springboardsfcd.org › /eligibility",
      title: "WIOA Eligibility Check & Regional Career Center Routing",
      snippet: "2-minute eligibility wizard for young adults (18–24), returning citizens, veterans, and underemployed adults in Chambers, Lee, and Troup Counties.",
      tags: ["Opelika Career Center", "Valley Career Center", "WorkSource GA"],
      keywords: "eligibility wioa qualify requirements age 18 24 returning citizen justice involved opelika valley laGrange career center",
      href: "/eligibility",
      actionLabel: "Start Eligibility Check →"
    },
    {
      id: "elig-transitional-jobs",
      category: "eligibility",
      categoryLabel: "WIOA & Eligibility",
      breadcrumb: "springboardsfcd.org › /train",
      title: "Transitional Jobs (Activity 220) & On-The-Job Training (OJT)",
      snippet: "Up to 390 hours of 100% WIOA wage-subsidized paid work experience (including 195 hours of foundational learning) transitioning into permanent OJT.",
      tags: ["390 Paid Hours", "Activity 220", "OJT Wage Reimbursement"],
      keywords: "transitional jobs activity 220 ojt paid training wage subsidy 390 hours 195 hours paycheck employer",
      href: "/train",
      actionLabel: "Explore Transitional Jobs & OJT →"
    },
    {
      id: "faq-free",
      category: "faq",
      categoryLabel: "FAQ Answer",
      breadcrumb: "springboardsfcd.org › FAQ › Tuition & Cost",
      title: "Is the trade training really 100% tuition-free?",
      snippet: "Yes. All Springboards trade training is 100% tuition-free for participants. Training fees, tools, safety gear, and certification exams are fully covered.",
      tags: ["Zero Tuition", "Zero Debt", "Tools & Gear Covered"],
      keywords: "free cost tuition price money debt pay scholarship grant financial aid",
      href: "#faq",
      actionLabel: "Read Full FAQ Answer →"
    },
    {
      id: "faq-location-hours",
      category: "faq",
      categoryLabel: "FAQ Answer",
      breadcrumb: "springboardsfcd.org › FAQ › Location & Schedule",
      title: "Where is Springboards located and what are the training hours?",
      snippet: "Training is held at the Springboards Community Center at 2269 15th Ave. S.W., Lanett, AL 36863 (Shawmut), Monday through Thursday from 8:00 AM to 4:00 PM EST.",
      tags: ["Shawmut / Lanett AL", "Mon–Thu 8AM–4PM EST", "731.388.WORK"],
      keywords: "location address hours schedule time where lanett shawmut valley alabama phone contact",
      href: "#footer",
      actionLabel: "View Campus Map & Hours →"
    },
    {
      id: "doc-flyer-brochure",
      category: "documents",
      categoryLabel: "Document",
      breadcrumb: "springboardsfcd.org › Document Center",
      title: "Official Program Brochure, Community Flyer & One-Page Summary",
      snippet: "Download high-resolution printable program flyers, executive summaries, and community outreach brochures for applicants and families.",
      tags: ["Printable PDF / WebP", "Public Download", "Outreach Packet"],
      keywords: "document download flyer brochure pdf summary printable handout packet",
      modalTrigger: "doc",
      actionLabel: "Open Document Center →"
    },
    {
      id: "doc-worksite-agreement",
      category: "documents",
      categoryLabel: "Protected Portal",
      breadcrumb: "springboardsfcd.org › Protected Worksite Gate",
      title: "Password-Protected Worksite Agreement & 390-Hour Trainee Tracker",
      snippet: "Authorized trainees and host worksite supervisors can enter their passcode to access the WIOA Host Worksite Agreement PDF and milestone tracker.",
      tags: ["Password-Protected", "Worksite Supervisors", "Enrolled Trainees"],
      keywords: "password protected worksite agreement portal login passcode tracker hours supervisor",
      modalTrigger: "trainee-portal",
      actionLabel: "Open Protected Gate →"
    },
    {
      id: "comm-partner-donate",
      category: "programs",
      categoryLabel: "Community & Support",
      breadcrumb: "springboardsfcd.org › /partner & /donate",
      title: "Employer Partnerships, Volunteer Signups & Tax-Deductible Giving",
      snippet: "Partner as a host employer, donate tools and building materials, sign up to volunteer at the Shawmut facility, or sponsor a trainee's tool belt.",
      tags: ["501(c)(3) Deductible", "Employer Partners", "Volunteer"],
      keywords: "donate donation partner employer sponsor volunteer tools lumber materials gift tax deductible",
      href: "/partner",
      actionLabel: "Explore Partnerships & Giving →"
    }
  ];

  const siteSearchModal = document.getElementById("siteSearchModal");
  const siteSearchForm = document.getElementById("siteSearchForm");
  const siteSearchInput = document.getElementById("siteSearchInput");
  const siteSearchClearBtn = document.getElementById("siteSearchClearBtn");
  const siteSearchResultCount = document.getElementById("siteSearchResultCount");
  const siteSearchResultsList = document.getElementById("siteSearchResultsList");
  const siteSearchEmptyState = document.getElementById("siteSearchEmptyState");
  const siteSearchEmptyTitle = document.getElementById("siteSearchEmptyTitle");
  const resetSiteSearchBtn = document.getElementById("resetSiteSearchBtn");
  const searchCategoryButtons = Array.from(document.querySelectorAll("[data-search-category]"));

  let activeSearchCategory = "all";

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  const highlightMatch = (text, rawQuery) => {
    const safeText = escapeHtml(text);
    const cleanQuery = (rawQuery || "").trim();
    if (!cleanQuery) return safeText;
    const tokens = cleanQuery
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (!tokens.length) return safeText;
    const regex = new RegExp(`(${tokens.join("|")})`, "gi");
    return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
  };

  const renderSiteSearchResults = () => {
    if (!siteSearchResultsList) return;
    const rawQuery = (siteSearchInput?.value || "").trim();
    const queryLower = rawQuery.toLowerCase();
    if (siteSearchClearBtn) siteSearchClearBtn.hidden = !rawQuery;

    const tokens = queryLower.split(/\s+/).filter(Boolean);

    const matched = SITE_SEARCH_INDEX.filter((item) => {
      const catMatch = activeSearchCategory === "all" || item.category === activeSearchCategory;
      if (!catMatch) return false;
      if (!tokens.length) return true;
      const haystack = `${item.title} ${item.snippet} ${item.keywords} ${item.tags.join(" ")} ${item.categoryLabel}`.toLowerCase();
      return tokens.every((tok) => haystack.includes(tok));
    });

    if (matched.length === 0) {
      siteSearchResultsList.hidden = true;
      siteSearchResultsList.innerHTML = "";
      if (siteSearchEmptyState) siteSearchEmptyState.hidden = false;
      if (siteSearchEmptyTitle) {
        siteSearchEmptyTitle.textContent = rawQuery
          ? `No results found for “${rawQuery}”`
          : "No results found in this category";
      }
      if (siteSearchResultCount) {
        siteSearchResultCount.textContent = rawQuery
          ? `0 results for “${rawQuery}”`
          : "0 results in selected category";
      }
      return;
    }

    if (siteSearchEmptyState) siteSearchEmptyState.hidden = true;
    siteSearchResultsList.hidden = false;

    if (siteSearchResultCount) {
      if (rawQuery) {
        siteSearchResultCount.textContent = `Found ${matched.length} result${matched.length === 1 ? "" : "s"} for “${rawQuery}”`;
      } else {
        siteSearchResultCount.textContent = `Showing ${matched.length} indexed site resource${matched.length === 1 ? "" : "s"}`;
      }
    }

    siteSearchResultsList.innerHTML = matched
      .map((item) => {
        const titleHtml = highlightMatch(item.title, rawQuery);
        const snippetHtml = highlightMatch(item.snippet, rawQuery);
        const tagsHtml = item.tags
          .map((t) => `<span class="search-result-tag">${escapeHtml(t)}</span>`)
          .join("");
        const actionHtml = item.modalTrigger
          ? `<button type="button" class="search-result-action-link" data-search-modal-trigger="${escapeHtml(item.modalTrigger)}">${escapeHtml(item.actionLabel)}</button>`
          : `<a href="${escapeHtml(item.href)}" class="search-result-action-link" data-search-nav-link>${escapeHtml(item.actionLabel)}</a>`;

        const titleInner = item.modalTrigger
          ? `<button type="button" class="search-result-action-link" style="font-size: inherit; color: inherit; text-align: left;" data-search-modal-trigger="${escapeHtml(item.modalTrigger)}">${titleHtml}</button>`
          : `<a href="${escapeHtml(item.href)}" data-search-nav-link>${titleHtml}</a>`;

        return `
          <article class="search-result-card">
            <div class="search-result-top">
              <span class="search-result-badge" data-category="${escapeHtml(item.category)}">${escapeHtml(item.categoryLabel)}</span>
              <span class="search-result-breadcrumb">${escapeHtml(item.breadcrumb)}</span>
            </div>
            <h3 class="search-result-title">${titleInner}</h3>
            <p class="search-result-snippet">${snippetHtml}</p>
            <div class="search-result-footer">
              <div class="search-result-tags">${tagsHtml}</div>
              ${actionHtml}
            </div>
          </article>
        `;
      })
      .join("");

    siteSearchResultsList.querySelectorAll("[data-search-nav-link]").forEach((link) => {
      link.addEventListener("click", () => {
        closeSiteSearch();
      });
    });

    siteSearchResultsList.querySelectorAll("[data-search-modal-trigger]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-search-modal-trigger");
        closeSiteSearch();
        if (target === "doc") {
          document.querySelector(".btn-doc-trigger")?.click();
        } else if (target === "trainee-portal") {
          openTraineePortalGate();
        }
      });
    });
  };

  const openSiteSearch = (initialQuery = "") => {
    if (!siteSearchModal) return;
    siteSearchModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (typeof initialQuery === "string" && initialQuery.trim() && siteSearchInput) {
      siteSearchInput.value = initialQuery.trim();
    }
    renderSiteSearchResults();
    setTimeout(() => {
      siteSearchInput?.focus();
    }, 60);
  };

  const closeSiteSearch = () => {
    if (!siteSearchModal) return;
    siteSearchModal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".btn-site-search-trigger").forEach((btn) => {
    btn.addEventListener("click", () => openSiteSearch());
  });

  document.querySelectorAll("[data-site-search-close]").forEach((el) => {
    el.addEventListener("click", closeSiteSearch);
  });

  siteSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderSiteSearchResults();
  });

  siteSearchInput?.addEventListener("input", renderSiteSearchResults);

  siteSearchClearBtn?.addEventListener("click", () => {
    if (siteSearchInput) {
      siteSearchInput.value = "";
      siteSearchInput.focus();
    }
    renderSiteSearchResults();
  });

  searchCategoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeSearchCategory = btn.getAttribute("data-search-category") || "all";
      searchCategoryButtons.forEach((b) => {
        const isSelected = b === btn;
        b.classList.toggle("is-active", isSelected);
        b.setAttribute("aria-pressed", String(isSelected));
      });
      renderSiteSearchResults();
    });
  });

  document.querySelectorAll("[data-suggest-query]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const suggested = chip.getAttribute("data-suggest-query") || "";
      activeSearchCategory = "all";
      searchCategoryButtons.forEach((b) => {
        const isAll = (b.getAttribute("data-search-category") || "all") === "all";
        b.classList.toggle("is-active", isAll);
        b.setAttribute("aria-pressed", String(isAll));
      });
      if (siteSearchInput) {
        siteSearchInput.value = suggested;
        siteSearchInput.focus();
      }
      renderSiteSearchResults();
    });
  });

  resetSiteSearchBtn?.addEventListener("click", () => {
    activeSearchCategory = "all";
    if (siteSearchInput) {
      siteSearchInput.value = "";
      siteSearchInput.focus();
    }
    searchCategoryButtons.forEach((b) => {
      const isAll = (b.getAttribute("data-search-category") || "all") === "all";
      b.classList.toggle("is-active", isAll);
      b.setAttribute("aria-pressed", String(isAll));
    });
    renderSiteSearchResults();
  });

  // Global keyboard shortcut "/" or Ctrl+K / Cmd+K to launch Site Search
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (siteSearchModal && !siteSearchModal.hidden) closeSiteSearch();
      if (traineePortalModal && !traineePortalModal.hidden) closeTraineePortalGate();
      return;
    }
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTyping =
      activeTag === "input" ||
      activeTag === "textarea" ||
      activeTag === "select" ||
      document.activeElement?.isContentEditable;
    if (!isTyping && (event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"))) {
      event.preventDefault();
      openSiteSearch();
    }
  });

  // Automatically open Site Search if URL contains ?q= or ?search= or #site-search
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q") || urlParams.get("search");
    if (queryParam !== null || window.location.hash === "#site-search") {
      openSiteSearch(queryParam || "");
    }
  } catch {
    // Ignore URL parsing issues
  }
});



