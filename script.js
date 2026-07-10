  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      galleryItems.forEach((item) => {
        const shouldShow = filter === "all" || item.dataset.category === filter;
        if (shouldShow) item.classList.remove("hidden");
        if (window.gsap) {
          gsap.to(item, {
            opacity: shouldShow ? 1 : 0,
            scale: shouldShow ? 1 : 0.88,
            duration: 0.24,
            onComplete: () => item.classList.toggle("hidden", !shouldShow)
          });
        } else {
          item.classList.toggle("hidden", !shouldShow);
        }
      });
    });
  });

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.full;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.src = "";
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
  });

  const bmiForm = document.getElementById("bmiForm");
  const bmiResult = document.getElementById("bmiResult");

  bmiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    if (!height || !weight || height < 80 || weight < 25) {
      bmiResult.innerHTML = "<span>Please enter a valid height and weight.</span>";
      return;
    }
    const bmi = weight / Math.pow(height / 100, 2);
    let category = "Healthy";
    if (bmi < 18.5) category = "Underweight";
    if (bmi >= 25) category = "Overweight";
    if (bmi >= 30) category = "Obesity range";
    bmiResult.innerHTML = `<span>Your BMI is <strong>${bmi.toFixed(1)}</strong>. Category: <strong>${category}</strong>.</span>`;
  });

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  const setError = (field, message) => {
    const row = field.closest(".form-row");
    row.classList.add("invalid");
    row.querySelector(".error-message").textContent = message;
  };

  const clearError = (field) => {
    const row = field.closest(".form-row");
    row.classList.remove("invalid");
    row.querySelector(".error-message").textContent = "";
  };

  const validators = {
    name: (value) => value.trim().length >= 2 || "Please enter your full name.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address.",
    phone: (value) => /^[+()\d\s-]{7,}$/.test(value) || "Please enter a valid phone number.",
    goal: (value) => Boolean(value) || "Please select a fitness goal.",
    message: (value) => value.trim().length >= 10 || "Please write at least 10 characters."
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;
      [...contactForm.elements].forEach((field) => {
        if (!field.name || !validators[field.name]) return;
        const result = validators[field.name](field.value);
        if (result !== true) {
          isValid = false;
          setError(field, result);
        } else {
          clearError(field);
        }
      });
      if (!isValid) {
        formStatus.textContent = "Please fix the highlighted fields.";
        return;
      }
      formStatus.textContent = "Thanks. Your consultation request has been received.";
      contactForm.reset();
    });

    contactForm.addEventListener("input", (event) => {
      const field = event.target;
      if (!field.name || !validators[field.name]) return;
      const result = validators[field.name](field.value);
      if (result === true) clearError(field);
    });
  }

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterStatus = document.getElementById("newsletterStatus");

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)) {
      newsletterStatus.textContent = "Enter a valid email address.";
      return;
    }
    newsletterStatus.textContent = "You are subscribed to Power House updates.";
    newsletterForm.reset();
  });

  if ("loading" in HTMLImageElement.prototype) {
    document.querySelectorAll("img").forEach((image) => {
      image.loading = image.loading || "lazy";
    });
  } else if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const image = entry.target;
        image.src = image.dataset.src;
        observer.unobserve(image);
      });
    });
    lazyImages.forEach((image) => imageObserver.observe(image));
  }
});
