const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const heroBg = document.querySelector('.hero-bg');
const quizForm = document.getElementById('quiz-form');
const quizResult = document.getElementById('quiz-result');
const year = document.getElementById('year');

menuToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => {
    navLinks?.classList.remove('open');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

window.addEventListener('scroll', () => {
  const offset = window.scrollY * 0.35;
  if (heroBg) heroBg.style.transform = `translateY(${offset}px)`;
});

quizForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(quizForm);
  const taste = formData.get('taste');
  const snack = formData.get('snack');
  const drink = formData.get('drink');

  let resultText = 'You are a Hazelnut Dream Explorer!';

  if (taste === 'bitter' || drink === 'coffee') {
    resultText = 'You are a Dark Cocoa Lover!';
  } else if (snack === 'caramel' || taste === 'sweet') {
    resultText = 'You are a Caramel Bliss Fan!';
  }

  quizResult.textContent = resultText;
});

year.textContent = new Date().getFullYear();
