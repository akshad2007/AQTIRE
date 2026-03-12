const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const heroBg = document.querySelector('.hero-bg');
const year = document.getElementById('year');
const menuClose = document.querySelector('.menu-close');
const navOverlay = document.getElementById('nav-overlay');

function closeMenu() {
  navLinks?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});

menuClose?.addEventListener('click', closeMenu);
navOverlay?.addEventListener('click', closeMenu);

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', closeMenu);
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


if (year) {
  year.textContent = new Date().getFullYear();
}


// --- Quote Carousel Logic ---
const quotes = document.querySelectorAll('.quote');
let currentQuoteIndex = 0;

if (quotes.length > 0) {
  setInterval(() => {
    quotes[currentQuoteIndex].classList.remove('active');
    quotes[currentQuoteIndex].setAttribute('aria-hidden', 'true');

    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;

    quotes[currentQuoteIndex].classList.add('active');
    quotes[currentQuoteIndex].setAttribute('aria-hidden', 'false');
  }, 4000);
}

// --- FAQ Game Logic ---
const faqCards = document.querySelectorAll('.faq-question-card');

faqCards.forEach(card => {
  const optionsWrapper = card.querySelector('.q-options');
  if (!optionsWrapper) return;

  const correctAns = optionsWrapper.dataset.correct;
  const optBtns = card.querySelectorAll('.opt-btn');
  const feedback = card.querySelector('.q-feedback');

  optBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Prevent multiple clicks
      optBtns.forEach(b => {
        b.disabled = true;
        b.style.cursor = 'default';
        if (b.textContent.trim() === correctAns) {
          b.classList.add('correct');
        } else if (b !== btn) {
          b.style.opacity = '0.5';
        }
      });

      const userAns = btn.textContent.trim();
      if (userAns === correctAns) {
        feedback.textContent = 'Correct!';
        feedback.style.color = '#4CAF50';
      } else {
        btn.classList.add('incorrect');
        feedback.textContent = `Incorrect. The correct answer is ${correctAns}.`;
        feedback.style.color = '#f44336';
      }
    });
  });
});
// --- EmailJS Contact Form Logic ---
(function () {
  // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
  emailjs.init("RH6hEDvdyvgnmJCXv");
})();

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // UI Feedback: Disable button and show sending state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';

    // These IDs must be replaced with your actual Service and Template IDs from EmailJS
    // Check your EmailJS dashboard for the correct Service ID (it may not be 'default_service')
    const serviceID = 'default_service';
    const templateID = 'template_wz15xyn';

    console.log('Attempting to send message via EmailJS...', { serviceID, templateID });

    emailjs.sendForm(serviceID, templateID, this)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        // Success Feedback
        formStatus.textContent = 'Thank you for contacting AQTIRE. Your message has been sent successfully.';
        formStatus.className = 'form-status success';

        // Reset form
        contactForm.reset();
      }, (err) => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        // Error Feedback
        let errorMsg = 'Something went wrong. Please try again later.';
        if (err.status === 400) {
          errorMsg = 'Error: Please check if your Service ID or Template ID is correct.';
        } else if (err.status === 401) {
          errorMsg = 'Error: Public Key is invalid.';
        }
        
        formStatus.textContent = errorMsg;
        formStatus.className = 'form-status error';
        console.error('EmailJS FAILED...', err);
        alert('EmailJS Error: ' + JSON.stringify(err)); // Adding an alert to make errors highly visible for the user
      });
  });
}
