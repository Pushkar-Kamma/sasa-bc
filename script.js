// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Mobile dropdown toggle (About Us)
document.querySelectorAll('.dropdown-container').forEach((item) => {
  const trigger = item.querySelector('.nav-dropdown-trigger');
  if (!trigger) return;
  trigger.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      item.classList.toggle('active');
    }
  });
});

// Animated stat counters
const counters = document.querySelectorAll('.counter');
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + '+';
  };
  requestAnimationFrame(step);
};

if (counters.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
}

// Duplicate gallery track for seamless infinite scroll
const track = document.querySelector('.gallery-track');
if (track) {
  track.innerHTML += track.innerHTML;
}

// Let the Sankranti kite drift down and back up with page scroll.
const scrollKite = document.getElementById('scroll-kite');
if (scrollKite && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let previousScrollY = window.scrollY;
  let scrollDirection = 1;
  let animationFrame = 0;

  const moveKite = () => {
    const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);
    const horizontalWave = (Math.sin(progress * Math.PI * 5 - Math.PI / 2) + 1) / 2;
    const x = 18 + horizontalWave * Math.max(window.innerWidth - 120, 0);
    const y = window.innerHeight * (0.12 + progress * 0.68);

    scrollKite.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${scrollDirection * 7}deg)`;
    animationFrame = 0;
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY !== previousScrollY) {
      scrollDirection = window.scrollY > previousScrollY ? 1 : -1;
      previousScrollY = window.scrollY;
    }
    if (!animationFrame) animationFrame = window.requestAnimationFrame(moveKite);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(moveKite);
  });
  moveKite();
}
