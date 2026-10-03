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

// Move the Sankranti kite flotilla along the events timeline as it scrolls.
const timeline = document.querySelector('.events-timeline');
const timelineArt = document.getElementById('timeline-art');
const timelinePath = document.getElementById('timeline-path');
const timelineProgressPath = document.getElementById('timeline-path-progress');
const pathKites = Array.from(document.querySelectorAll('.path-kite'));

if (timeline && timelineArt && timelinePath && timelineProgressPath && pathKites.length) {
  let animationFrame = 0;

  const renderTimeline = () => {
    const width = timeline.clientWidth;
    const height = timeline.clientHeight;
    if (!width || !height) {
      animationFrame = 0;
      return;
    }

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const center = mobile ? Math.min(19, width / 2) : width / 2;
    const bend = mobile ? Math.min(9, width * 0.08) : Math.min(92, width * 0.1);
    // Inset the curve's start/end so the kite graphics (which extend above
    // and below their anchor point) never poke into the heading text above
    // or the CTA text below the timeline.
    const inset = Math.min(36, height * 0.08);
    const topY = inset;
    const bottomY = height - inset;
    const span = bottomY - topY;
    const d = [
      `M ${center} ${topY}`,
      `C ${center + bend} ${topY + span * 0.08}, ${center + bend} ${topY + span * 0.13}, ${center} ${topY + span * 0.2}`,
      `C ${center - bend} ${topY + span * 0.27}, ${center - bend} ${topY + span * 0.33}, ${center} ${topY + span * 0.4}`,
      `C ${center + bend} ${topY + span * 0.47}, ${center + bend} ${topY + span * 0.53}, ${center} ${topY + span * 0.6}`,
      `C ${center - bend} ${topY + span * 0.67}, ${center - bend} ${topY + span * 0.73}, ${center} ${topY + span * 0.8}`,
      `C ${center + bend} ${topY + span * 0.87}, ${center + bend} ${topY + span * 0.93}, ${center} ${bottomY}`
    ].join(' ');

    timelineArt.setAttribute('viewBox', `0 0 ${width} ${height}`);
    timelinePath.setAttribute('d', d);
    timelineProgressPath.setAttribute('d', d);

    const pathLength = timelinePath.getTotalLength();
    const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
    // Trigger movement once the timeline reaches roughly the center of the
    // viewport (instead of near its top), so the kites are already in
    // motion by the time they are clearly visible on screen.
    const pathStart = timelineTop - window.innerHeight * 0.5;
    const pathProgress = Math.max(0, Math.min(1,
      (window.scrollY - pathStart) /
      Math.max(timeline.offsetHeight - window.innerHeight * 0.64, 1)
    ));
    timelineProgressPath.style.strokeDasharray = `${pathLength}`;
    timelineProgressPath.style.strokeDashoffset = `${pathLength * (1 - pathProgress)}`;

    pathKites.forEach((kite, index) => {
      const easing = Number(kite.dataset.easing) || 1;
      const point = timelinePath.getPointAtLength(pathLength * pathProgress ** easing);
      const ahead = timelinePath.getPointAtLength(Math.min(pathLength, pathLength * pathProgress ** easing + 1));
      const behind = timelinePath.getPointAtLength(Math.max(0, pathLength * pathProgress ** easing - 1));
      const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI + 90;
      const scale = index === 0 ? 1 : 0.82;
      kite.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle}) scale(${scale})`);
    });

    const markers = timeline.querySelectorAll('.timeline-marker');
    markers.forEach((marker) => {
      const event = marker.closest('.timeline-event');
      if (!event) return;
      const eventTop = event.offsetTop + Math.min(36, event.offsetHeight * 0.15);
      let low = 0;
      let high = pathLength;
      for (let step = 0; step < 18; step += 1) {
        const middle = (low + high) / 2;
        if (timelinePath.getPointAtLength(middle).y < eventTop) low = middle;
        else high = middle;
      }
      const point = timelinePath.getPointAtLength((low + high) / 2);
      marker.style.left = `${point.x}px`;
      marker.style.top = `${point.y - event.offsetTop}px`;
    });

    animationFrame = 0;
  };

  const requestTimelineRender = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(renderTimeline);
  };

  window.addEventListener('scroll', requestTimelineRender, { passive: true });
  window.addEventListener('resize', requestTimelineRender);
  window.addEventListener('load', requestTimelineRender);
  requestTimelineRender();
}
