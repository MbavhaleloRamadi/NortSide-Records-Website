
    // Preloader
    window.addEventListener('load', function() {
      const preloader = document.querySelector('.preloader');
      setTimeout(function() {
        preloader.classList.add('hidden');
      }, 500);
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });