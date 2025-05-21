// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Elements selection
  const preloader = document.getElementById('preloader');
  const menuToggle = document.getElementById('menuToggle');
  const navigation = document.querySelector('.navigation');
  const backToTopBtn = document.getElementById('backToTop');
  const header = document.querySelector('.header');
  const releaseCards = document.querySelectorAll('.release-card');
  const newsletterForm = document.querySelector('.newsletter-form');
  
  // Preloader handling
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove preloader from DOM after transition
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 800); // Show preloader for at least 800ms
  });
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
    
    // Prevent scrolling when mobile menu is open
    if (navigation.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (navigation.classList.contains('active') && 
        !navigation.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navigation.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Back to top button functionality
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only apply smooth scrolling for hash links on the same page
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          if (navigation.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navigation.classList.remove('active');
            document.body.style.overflow = '';
          }
          
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Audio player modal functionality for release cards
  releaseCards.forEach(card => {
    const playOverlay = card.querySelector('.play-overlay');
    
    playOverlay.addEventListener('click', () => {
      const albumTitle = card.querySelector('h3').textContent;
      const artistName = card.querySelector('p').textContent;
      
      // Create modal dynamically
      const modalHTML = `
        <div class="modal">
          <div class="modal-content">
            <span class="modal-close"><i class="fas fa-times"></i></span>
            <div class="audio-player">
              <div class="audio-info">
                <h3>${albumTitle}</h3>
                <p>${artistName}</p>
              </div>
              <audio controls>
                <source src="audio/demo-track.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            </div>
            <div class="streaming-links">
              <a href="#" title="Spotify"><i class="fab fa-spotify"></i></a>
              <a href="#" title="Apple Music"><i class="fab fa-apple"></i></a>
              <a href="#" title="YouTube Music"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      `;
      
      // Append modal to body
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      const modal = document.querySelector('.modal');
      const closeBtn = modal.querySelector('.modal-close');
      
      // Activate modal with slight delay for smoother animation
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Close modal functionality
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        
        // Remove modal from DOM after transition
        setTimeout(() => {
          modal.remove();
        }, 300);
      });
      
      // Close modal when clicking outside of modal content
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          
          // Remove modal from DOM after transition
          setTimeout(() => {
            modal.remove();
          }, 300);
        }
      });
    });
  });
  
  // Newsletter form submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const consentCheckbox = this.querySelector('input[type="checkbox"]');
      
      // Create message element if it doesn't exist
      let formMessage = this.querySelector('.form-message');
      if (!formMessage) {
        formMessage = document.createElement('div');
        formMessage.className = 'form-message';
        this.appendChild(formMessage);
      }
      
      // Simple validation
      if (!emailInput.value) {
        formMessage.textContent = 'Please enter your email address.';
        formMessage.className = 'form-message error';
        emailInput.classList.add('error');
        return;
      }
      
      if (!consentCheckbox.checked) {
        formMessage.textContent = 'Please agree to receive emails from NortSide Records.';
        formMessage.className = 'form-message error';
        return;
      }
      
      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      
      // Change button text and disable during "submission"
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
      submitButton.disabled = true;
      emailInput.disabled = true;
      consentCheckbox.disabled = true;
      
      // Simulate server delay
      setTimeout(() => {
        // Success message
        formMessage.textContent = 'Thank you for subscribing to our newsletter!';
        formMessage.className = 'form-message success';
        
        // Reset form
        emailInput.value = '';
        consentCheckbox.checked = false;
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        emailInput.disabled = false;
        consentCheckbox.disabled = false;
        emailInput.classList.remove('error');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }
  
  // Cookie consent banner
  function createCookieConsent() {
    // Check if user has already made a choice
    if (localStorage.getItem('cookieConsent') === null) {
      const cookieConsentHTML = `
        <div class="cookie-consent">
          <p class="cookie-text">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          <div class="cookie-buttons">
            <button class="cookie-btn cookie-btn-accept">Accept</button>
            <button class="cookie-btn cookie-btn-decline">Decline</button>
          </div>
        </div>
      `;
      
      // Append banner to body
      document.body.insertAdjacentHTML('beforeend', cookieConsentHTML);
      
      const cookieBanner = document.querySelector('.cookie-consent');
      const acceptBtn = cookieBanner.querySelector('.cookie-btn-accept');
      const declineBtn = cookieBanner.querySelector('.cookie-btn-decline');
      
      // Show banner with delay
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 2000);
      
      // Accept cookies
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
        
        // Remove banner after transition
        setTimeout(() => {
          cookieBanner.remove();
        }, 500);
      });
      
      // Decline cookies
      declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
        
        // Remove banner after transition
        setTimeout(() => {
          cookieBanner.remove();
        }, 500);
      });
    }
  }
  
  // Initialize cookie consent
  createCookieConsent();
  
  // Animation on scroll functionality
  function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .release-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }
  
  // Initialize animations
  setTimeout(animateOnScroll, 1000);
});

