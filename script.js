// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Mobile dropdown toggle (About Us)
document.querySelectorAll('.dropdown-container').forEach((item) => {
  item.querySelector('.nav-dropdown-trigger').addEventListener('click', (e) => {
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach((c) => observer.observe(c));

// Duplicate gallery track for seamless infinite scroll
const track = document.querySelector('.gallery-track');
if (track) {
  track.innerHTML += track.innerHTML;
}
