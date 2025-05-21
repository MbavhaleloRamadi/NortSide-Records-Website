document.addEventListener('DOMContentLoaded', function() {
  // Initialize preloader
  initPreloader();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize artist filtering
  initArtistFiltering();
  
  // Initialize back to top button
  initBackToTop();
  
  // Initialize load more functionality
  initLoadMore();
  
  // Initialize newsletter form
  initNewsletterForm();
});

/**
 * Initialize Preloader
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    // Hide preloader after page load
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        setTimeout(function() {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    });
  }
}

/**
 * Initialize Mobile Menu
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.navigation') && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
}

/**
 * Initialize Artist Filtering
 */
function initArtistFiltering() {
  const genreFilter = document.getElementById('genre-filter');
  const searchInput = document.getElementById('artist-search');
  const searchBtn = document.getElementById('search-btn');
  const artistGrid = document.getElementById('artist-grid');
  const noResults = document.getElementById('no-results');
  const artistCards = document.querySelectorAll('.artist-card');
  
  if (genreFilter && searchInput && searchBtn && artistGrid && noResults) {
    // Filter by genre
    genreFilter.addEventListener('change', filterArtists);
    
    // Filter by search
    searchBtn.addEventListener('click', filterArtists);
    
    // Filter on Enter key press
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        filterArtists();
      }
    });
    
    function filterArtists() {
      const selectedGenre = genreFilter.value;
      const searchTerm = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;
      
      // Loop through all artist cards
      artistCards.forEach(card => {
        const genre = card.getAttribute('data-genre');
        const artistName = card.querySelector('h3').textContent.toLowerCase();
        const artistDesc = card.querySelector('.artist-desc').textContent.toLowerCase();
        
        // Check if card matches both genre and search criteria
        const matchesGenre = selectedGenre === 'all' || genre === selectedGenre;
        const matchesSearch = searchTerm === '' || 
                             artistName.includes(searchTerm) || 
                             artistDesc.includes(searchTerm);
        
        if (matchesGenre && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;
          
          // Apply animation
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Show/hide no results message
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
      
      // Update load more button visibility
      updateLoadMoreButton();
    }
  }
}

/**
 * Initialize Back To Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
      // Smooth scroll for modern browsers
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Fallback for older browsers
      function scrollToTop(duration) {
        const start = window.pageYOffset;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        
        function scroll() {
          const now = 'now' in window.performance ? performance.now() : new Date().getTime();
          const time = Math.min(1, (now - startTime) / duration);
          
          window.scrollTo(0, Math.ceil((1 - time) * start));
          
          if (time < 1) {
            requestAnimationFrame(scroll);
          }
        }
        
        requestAnimationFrame(scroll);
      }
      
      // If smooth scrolling is not supported
      if (typeof window.scrollTo !== 'function' || !('behavior' in document.documentElement.style)) {
        scrollToTop(500);
      }
    });
  }
}

/**
 * Initialize Load More Functionality
 */
function initLoadMore() {
  const loadMoreBtn = document.getElementById('load-more');
  const artistGrid = document.getElementById('artist-grid');
  const visibleArtistsCount = 6; // Initial number of visible artists
  let currentlyVisible = visibleArtistsCount;
  
  if (loadMoreBtn && artistGrid) {
    const artistCards = artistGrid.querySelectorAll('.artist-card');
    const totalArtists = artistCards.length;
    
    // Initially hide artists beyond the visible count
    updateVisibleArtists();
    
    // Update load more button visibility
    updateLoadMoreButton();
    
    // Load more button click event
    loadMoreBtn.addEventListener('click', function() {
      currentlyVisible += visibleArtistsCount;
      updateVisibleArtists();
      updateLoadMoreButton();
    });
    
    function updateVisibleArtists() {
      artistCards.forEach((card, index) => {
        if (index < currentlyVisible && window.getComputedStyle(card).display !== 'none') {
          card.style.display = 'block';
          
          // Add staggered animation
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.5s ease forwards';
          }, (index % visibleArtistsCount) * 100);
        }
      });
    }
  }
}

/**
 * Update Load More Button Visibility
 */
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById('load-more');
  const artistGrid = document.getElementById('artist-grid');
  
  if (loadMoreBtn && artistGrid) {
    const visibleCards = Array.from(artistGrid.querySelectorAll('.artist-card')).filter(card => {
      return window.getComputedStyle(card).display !== 'none';
    });
    
    if (visibleCards.length === 0 || visibleCards.length === Array.from(artistGrid.querySelectorAll('.artist-card')).length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
    }
  }
}

/**
 * Initialize Newsletter Form
 */
function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (validateEmail(email)) {
        // Simulate form submission (would connect to backend in production)
        emailInput.value = '';
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing!';
        
        newsletterForm.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
          successMessage.style.opacity = '0';
          setTimeout(() => {
            newsletterForm.removeChild(successMessage);
          }, 300);
        }, 3000);
      } else {
        // Show error styling
        emailInput.classList.add('error');
        
        // Remove error styling after input change
        emailInput.addEventListener('input', function() {
          this.classList.remove('error');
        }, { once: true });
      }
    });
  }
}

/**
 * Validate Email Format
 * @param {string} email - Email to validate
 * @return {boolean}
 */
function validateEmail(email) {
  // Regular expression for validating email format
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Test email against regex pattern and return result
  return emailRegex.test(String(email).toLowerCase());
}