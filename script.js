// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeLoading()
  initializeNavigation()
  initializeCursor()
  initializeHeroAnimations()
  initializeScrollAnimations()
  initializeTestimonials()
  initializeContactForm()
  initializeParticles()
  initializeCounters()
})

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  // Simulate loading time
  setTimeout(() => {
    loadingScreen.classList.add("hidden")

    // Remove from DOM after transition
    setTimeout(() => {
      loadingScreen.remove()
    }, 500)
  }, 2000)
}

// Navigation
function initializeNavigation() {
  const navbar = document.getElementById("navbar")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Scroll effect
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    lastScrollY = currentScrollY
  })

  hamburger.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()

    const isActive = hamburger.classList.contains("active")

    if (isActive) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  function openMenu() {
    hamburger.classList.add("active")
    navMenu.classList.add("active")
    document.body.style.overflow = "hidden"

    // Add aria attributes for accessibility
    hamburger.setAttribute("aria-expanded", "true")
    navMenu.setAttribute("aria-hidden", "false")
  }

  function closeMenu() {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
    document.body.style.overflow = ""

    // Update aria attributes
    hamburger.setAttribute("aria-expanded", "false")
    navMenu.setAttribute("aria-hidden", "true")
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains("active")) {
      closeMenu()
    }
  })

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        // Calculate offset based on screen size
        const isMobile = window.innerWidth <= 900
        const offsetTop = targetSection.offsetTop - (isMobile ? 60 : 100)

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }

      // Always close mobile menu after clicking
      if (navMenu.classList.contains("active")) {
        closeMenu()
      }
    })
  })

  // Active link highlighting
  window.addEventListener("scroll", () => {
    let current = ""
    const sections = document.querySelectorAll("section[id]")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150
      const sectionHeight = section.offsetHeight

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && navMenu.classList.contains("active")) {
      closeMenu()
    }
  })

  // Initialize aria attributes
  hamburger.setAttribute("aria-expanded", "false")
  hamburger.setAttribute("aria-label", "Toggle navigation menu")
  navMenu.setAttribute("aria-hidden", "true")
}

// Custom Cursor
function initializeCursor() {
  const cursor = document.querySelector(".cursor-follower")
  let mouseX = 0
  let mouseY = 0
  let cursorX = 0
  let cursorY = 0

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    cursor.classList.add("active")
  })

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("active")
  })

  // Smooth cursor movement
  function animateCursor() {
    const speed = 0.1
    cursorX += (mouseX - cursorX) * speed
    cursorY += (mouseY - cursorY) * speed

    cursor.style.left = cursorX + "px"
    cursor.style.top = cursorY + "px"

    requestAnimationFrame(animateCursor)
  }

  animateCursor()

  // Cursor interactions
  const interactiveElements = document.querySelectorAll("a, button, .practice-card, .testimonial-card")

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(2)"
      cursor.style.opacity = "0.3"
    })

    element.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1.5)"
      cursor.style.opacity = "0.6"
    })
  })
}

// Hero Animations
function initializeHeroAnimations() {
  // Parallax effect for hero background
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".floating-shapes .shape")

    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + index * 0.1
      element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`
    })
  })
}

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe elements for fade-in animation
  const animatedElements = document.querySelectorAll(".practice-card, .timeline-item, .credential, .info-card")

  animatedElements.forEach((element, index) => {
    element.classList.add("fade-in")
    element.classList.add(`stagger-${(index % 4) + 1}`)
    observer.observe(element)
  })
}

// Testimonials Carousel
function initializeTestimonials() {
  const track = document.getElementById("testimonial-track")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const dotsContainer = document.getElementById("carousel-dots")
  const testimonials = document.querySelectorAll(".testimonial-card")

  let currentIndex = 0
  const totalTestimonials = testimonials.length

  // Create dots
  for (let i = 0; i < totalTestimonials; i++) {
    const dot = document.createElement("div")
    dot.classList.add("dot")
    if (i === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(i))
    dotsContainer.appendChild(dot)
  }

  const dots = document.querySelectorAll(".dot")

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`

    // Update active states
    testimonials.forEach((testimonial, index) => {
      testimonial.classList.toggle("active", index === currentIndex)
    })

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex)
    })
  }

  function goToSlide(index) {
    currentIndex = index
    updateCarousel()
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalTestimonials
    updateCarousel()
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials
    updateCarousel()
  }

  // Event listeners
  nextBtn.addEventListener("click", nextSlide)
  prevBtn.addEventListener("click", prevSlide)

  // Auto-play
  setInterval(nextSlide, 5000)

  // Touch/swipe support
  let startX = 0
  let endX = 0

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
  })

  track.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  })
}

// Contact Form
function initializeContactForm() {
  const form = document.getElementById("contact-form")
  const submitBtn = form.querySelector(".submit-btn")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Validate required fields
    const requiredFields = ["name", "email", "message"]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      showNotification(`Please fill in the following required fields: ${missingFields.join(", ")}`, "error")
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address.", "error")
      return
    }

    // Show loading state
    submitBtn.classList.add("loading")
    submitBtn.disabled = true

    try {
      // Save form data to localStorage as backup
      localStorage.setItem(
        "contactFormData",
        JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      )

      // Simulate form submission (replace with actual email service)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success message
      showNotification("Thank you for your message! I will get back to you within 24 hours.", "success")
      form.reset()

      // Clear localStorage backup after successful submission
      localStorage.removeItem("contactFormData")
    } catch (error) {
      showNotification("There was an error sending your message. Please try again or contact me directly.", "error")
    } finally {
      // Reset button state
      submitBtn.classList.remove("loading")
      submitBtn.disabled = false
    }
  })

  // Real-time validation
  const inputs = form.querySelectorAll("input, textarea, select")

  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateField(input)
    })

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        validateField(input)
      }
    })
  })

  function validateField(field) {
    const value = field.value.trim()
    const isRequired = field.hasAttribute("required")

    // Remove existing error styling
    field.classList.remove("error")

    // Check if required field is empty
    if (isRequired && !value) {
      field.classList.add("error")
      return false
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        field.classList.add("error")
        return false
      }
    }

    return true
  }

  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      max-width: 400px;
      font-size: 0.9rem;
      line-height: 1.4;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 5000)
  }
}

// Particle System
function initializeParticles() {
  const particlesContainer = document.getElementById("particles")
  const particleCount = 50

  for (let i = 0; i < particleCount; i++) {
    createParticle()
  }

  function createParticle() {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    // Random starting position
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 15 + "s"
    particle.style.animationDuration = 15 + Math.random() * 10 + "s"

    particlesContainer.appendChild(particle)

    // Remove and recreate particle after animation
    particle.addEventListener("animationend", () => {
      particle.remove()
      createParticle()
    })
  }
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")
  const observerOptions = {
    threshold: 0.5,
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })

  function animateCounter(element) {
    const target = Number.parseFloat(element.getAttribute("data-target"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment

      if (current >= target) {
        current = target
        clearInterval(timer)
      }

      // Format number based on target
      if (target >= 1000) {
        element.textContent = (current / 1000).toFixed(1) + "K+"
      } else if (target < 10) {
        element.textContent = current.toFixed(1) + "B+"
      } else {
        element.textContent = Math.floor(current) + "%"
      }
    }, 16)
  }
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance optimizations
const debouncedScroll = debounce(() => {
  // Scroll-based animations
}, 10)

const throttledResize = throttle(() => {
  // Resize-based recalculations
}, 250)

window.addEventListener("scroll", debouncedScroll)
window.addEventListener("resize", throttledResize)

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})

// Accessibility enhancements
document.addEventListener("keydown", (e) => {
  // Skip to main content
  if (e.key === "Tab" && e.target === document.body) {
    const mainContent = document.querySelector("main") || document.querySelector("#home")
    if (mainContent) {
      mainContent.focus()
    }
  }

  if (e.key === "Escape") {
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("nav-menu")
    if (navMenu && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
      hamburger.setAttribute("aria-expanded", "false")
      navMenu.setAttribute("aria-hidden", "true")
      hamburger.focus() // Return focus to hamburger button
    }
  }
})

// Reduced motion support
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.setProperty("--transition-fast", "0.01ms")
  document.documentElement.style.setProperty("--transition-normal", "0.01ms")
  document.documentElement.style.setProperty("--transition-slow", "0.01ms")
}


// Achievements slider – sideward slide on click
(function () {
  const viewport = document.getElementById('achvViewport');
  const track = document.getElementById('achvTrack');
  const cards = Array.from(track.querySelectorAll('.achv-card'));
  const dots = Array.from(document.querySelectorAll('.achv-dot'));
  const prevBtn = document.querySelector('.achv-nav.prev');
  const nextBtn = document.querySelector('.achv-nav.next');

  let index = 0;

  function scrollToIndex(i, opts = { behavior: 'smooth' }) {
    index = Math.max(0, Math.min(i, cards.length - 1));
    const card = cards[index];
    // Use the card's offset within the track to scroll viewport
    const left = card.offsetLeft - track.firstElementChild.offsetLeft;
    viewport.scrollTo({ left, behavior: opts.behavior });
    updateDots();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
  }

  // Dots click
  dots.forEach(d => {
    d.addEventListener('click', () => {
      const i = parseInt(d.dataset.index, 10) || 0;
      scrollToIndex(i);
    });
  });

  // Arrows
  prevBtn.addEventListener('click', () => scrollToIndex(index - 1));
  nextBtn.addEventListener('click', () => scrollToIndex(index + 1));

  // Sync index on manual swipe/scroll (for touch/trackpads)
  let scrollTimeout;
  viewport.addEventListener('scroll', () => {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      // Find the card whose center is closest to viewport center
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < best) { best = dist; nearest = i; }
      });
      if (nearest !== index) {
        index = nearest;
        updateDots();
      }
    }, 100);
  });

  // Recalculate on resize
  window.addEventListener('resize', () => scrollToIndex(index, { behavior: 'instant' }));

  // Initial state
  scrollToIndex(0, { behavior: 'instant' });
})();

// Mobile menu toggle
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("nav-menu").classList.toggle("active");
});


