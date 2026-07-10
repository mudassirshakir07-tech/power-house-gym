"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const scrollProgress = document.querySelector(".scroll-progress span");
  const scrollTop = document.getElementById("scrollTop");
  const cursorGlow = document.querySelector(".cursor-glow");
  const particles = document.getElementById("particles");

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.AOS) {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 90
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero-reveal", {
      y: 80,
      opacity: 0,
      duration: 1.1,
      stagger: 0.16,
      ease: "power4.out"
    });
    gsap.to(".hero-bg", {
      scale: 1,
      duration: 2.2,
      ease: "power2.out"
    });
    gsap.to(".hero-light-one", {
      x: -60,
      y: 44,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".hero-light-two", {
      x: 70,
      y: -32,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.utils.toArray(".gallery-item img, .trainer-card img").forEach((image) => {
      gsap.to(image, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8
        }
      });
    });
    gsap.utils.toArray(".section-heading, .section-copy").forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 82%"
        }
      });
    });
  }

  const createParticles = () => {
    if (!particles || isReducedMotion) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 58; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${8 + Math.random() * 12}s`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.opacity = String(0.3 + Math.random() * 0.7);
      fragment.appendChild(particle);
    }
    particles.appendChild(fragment);
  };

  createParticles();

  const updateScrollState = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    header.classList.toggle("scrolled", scrollY > 40);
    scrollTop.classList.toggle("visible", scrollY > 640);
    scrollProgress.style.width = `${progress}%`;
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const setActiveNav = () => {
    const current = sections
      .filter((section) => window.scrollY >= section.offsetTop - 140)
      .pop();
    navLinks.forEach((link) => {
      link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
    });
  };

  setActiveNav();
  window.addEventListener("scroll", setActiveNav, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: isReducedMotion ? "auto" : "smooth", block: "start" });
    });
  });

  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" });
  });

  if (cursorGlow && !isReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.transform = `translate(${event.clientX - 140}px, ${event.clientY - 140}px)`;
    });
    window.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  document.querySelectorAll(".magnetic-btn").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      if (isReducedMotion) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const duration = 1500;
      const start = performance.now();
      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = `${bar.dataset.progress}%`;
      observer.unobserve(bar);
          });
  }, { threshold: 0.6 });

  document.querySelectorAll(".progress-bar span").forEach((bar) => progressObserver.observe(bar));

  const testimonials = [...document.querySelectorAll(".testimonial")];
  const prevTestimonial = document.getElementById("prevTestimonial");
  const nextTestimonial = document.getElementById("nextTestimonial");
  const testimonialDots = document.getElementById("testimonialDots");
  let testimonialIndex = 0;
  let testimonialTimer;

  const buildDots = () => {
    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
      dot.addEventListener("click", () => showTestimonial(index));
      testimonialDots.appendChild(dot);
    });
  };

  const showTestimonial = (index) => {
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((testimonial, itemIndex) => {
      testimonial.classList.toggle("active", itemIndex === testimonialIndex);
      if (itemIndex === testimonialIndex && window.gsap) {
        gsap.fromTo(testimonial, { opacity: 0, x: 28 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" });
      }
    });
    [...testimonialDots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === testimonialIndex);
    });
    window.clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(() => showTestimonial(testimonialIndex + 1), 5800);
  };

  if (testimonials.length) {
    buildDots();
    showTestimonial(0);
    prevTestimonial.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
    nextTestimonial.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

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
