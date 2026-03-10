/* ============================================================
   OMNI RELAX — STATIC SITE JAVASCRIPT
   ============================================================ */

/* ---------- Navbar scroll behavior ---------- */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY < 50) {
    navbar.classList.add('at-top');
  } else {
    navbar.classList.remove('at-top');
  }
}

updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

/* ---------- Mobile menu ---------- */
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile-menu');

hamburger.addEventListener('click', function () {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

/* ---------- Smooth scroll to section ---------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const navH = navbar.offsetHeight;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
}

/* ---------- Intersection Observer for scroll animations ---------- */
const animateEls = document.querySelectorAll('[data-animate]');
const solutionCards = document.querySelectorAll('.solution-card');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || '0');
      setTimeout(function () {
        el.classList.add('visible');
      }, delay);
      observer.unobserve(el);
    }
  });
}, observerOptions);

animateEls.forEach(function (el) {
  observer.observe(el);
});

/* Solution cards staggered animation */
const cardObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const card = entry.target;
      const delay = parseInt(card.getAttribute('data-delay') || '0');
      const allCards = Array.from(solutionCards);
      const idx = allCards.indexOf(card);
      const rowDelay = Math.floor(idx / 3) * 150;
      setTimeout(function () {
        card.classList.add('visible');
      }, delay + rowDelay);
      cardObserver.unobserve(card);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

solutionCards.forEach(function (card) {
  cardObserver.observe(card);
});

/* ---------- Portfolio video play/pause ---------- */
const portfolioVideo = document.getElementById('portfolio-video');
const portfolioPlayBtn = document.getElementById('portfolio-play-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

function togglePortfolioVideo() {
  if (!portfolioVideo) return;
  if (portfolioVideo.paused) {
    portfolioVideo.play();
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (portfolioPlayBtn) portfolioPlayBtn.style.opacity = '0';
  } else {
    portfolioVideo.pause();
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (portfolioPlayBtn) portfolioPlayBtn.style.opacity = '1';
  }
}

if (portfolioPlayBtn) {
  portfolioPlayBtn.addEventListener('click', togglePortfolioVideo);
  const videoWrap = portfolioPlayBtn.closest('.portfolio-video-inner');
  if (videoWrap) {
    videoWrap.addEventListener('mouseenter', function () {
      portfolioPlayBtn.style.opacity = '1';
    });
    videoWrap.addEventListener('mouseleave', function () {
      if (portfolioVideo && !portfolioVideo.paused) {
        portfolioPlayBtn.style.opacity = '0';
      }
    });
  }
}

/* ---------- Nav logo click scrolls to top ---------- */
document.getElementById('nav-logo-link').addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Force autoplay when portfolio video becomes visible ---------- */

if (portfolioVideo) {
  // Ensure video is muted for autoplay on mobile
  portfolioVideo.muted = true;
  
  // Try to play immediately on page load
  const playPromise = portfolioVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay was prevented, will be handled by intersection observer
    });
  }

  // Force autoplay when video becomes visible in viewport
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        portfolioVideo.muted = true;
        const playPromise = portfolioVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Fallback: if autoplay fails, user can click play button
          });
        }
      }
    });
  }, { threshold: 0.1 });

  videoObserver.observe(portfolioVideo);
}
