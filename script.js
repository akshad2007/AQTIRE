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



// --- Smooth Scroll (Lenis) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- ScrollStack Logic ---
const stackCards = document.querySelectorAll('.scroll-stack-card');
const stackEnd = document.querySelector('.scroll-stack-end');

const stackConfig = {
  itemScale: 0.02,
  itemStackDistance: 20,
  stackPosition: '15%',
  scaleEndPosition: '5%',
  baseScale: 0.92,
  blurAmount: 1.5,
  rotationAmount: 1
};

function parsePercentage(value, containerHeight) {
  if (typeof value === 'string' && value.includes('%')) {
    return (parseFloat(value) / 100) * containerHeight;
  }
  return parseFloat(value);
}

function calculateProgress(scrollTop, start, end) {
  if (scrollTop < start) return 0;
  if (scrollTop > end) return 1;
  return (scrollTop - start) / (end - start);
}

function updateCardTransforms() {
  if (!stackCards.length) return;

  const scrollTop = window.scrollY;
  const containerHeight = window.innerHeight;
  const stackPositionPx = parsePercentage(stackConfig.stackPosition, containerHeight);
  const scaleEndPositionPx = parsePercentage(stackConfig.scaleEndPosition, containerHeight);
  const endElementTop = stackEnd ? stackEnd.offsetTop : 0;

  stackCards.forEach((card, i) => {
    const cardTop = card.offsetTop;
    const triggerStart = cardTop - stackPositionPx - stackConfig.itemStackDistance * i;
    const triggerEnd = cardTop - scaleEndPositionPx;
    
    // Pinning range
    const pinStart = triggerStart;
    const pinEnd = endElementTop - containerHeight / 2;

    const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
    const targetScale = stackConfig.baseScale + i * stackConfig.itemScale;
    const scale = 1 - scaleProgress * (1 - targetScale);
    const rotation = stackConfig.rotationAmount ? i * stackConfig.rotationAmount * scaleProgress : 0;

    // Blur effect for cards below the top pinned card
    let blur = 0;
    let topCardIndex = -1;
    for (let j = 0; j < stackCards.length; j++) {
      const jTriggerStart = stackCards[j].offsetTop - stackPositionPx - stackConfig.itemStackDistance * j;
      if (scrollTop >= jTriggerStart) {
        topCardIndex = j;
      }
    }
    if (i < topCardIndex) {
      blur = (topCardIndex - i) * stackConfig.blurAmount;
    }

    let translateY = 0;
    if (scrollTop >= pinStart && scrollTop <= pinEnd) {
      translateY = scrollTop - cardTop + stackPositionPx + stackConfig.itemStackDistance * i;
    } else if (scrollTop > pinEnd) {
      translateY = pinEnd - cardTop + stackPositionPx + stackConfig.itemStackDistance * i;
    }

    card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
    card.style.filter = blur > 0 ? `blur(${blur}px)` : '';
  });
}

lenis.on('scroll', () => {
  updateCardTransforms();
});

// Initial call and resize
updateCardTransforms();
window.addEventListener('resize', updateCardTransforms);

