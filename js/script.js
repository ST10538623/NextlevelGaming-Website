// Next Level Gaming & Esports Arena — shared website interactions
const offeringPrices = {
  'ultimate-gamer-pass': 1500,
  'vip-gaming': 1500,
  'esports-training': 1500,
  'birthday-party': 1500,
  'virtual-reality': 750,
  'racing-simulator': 750,
  'escape-room': 750
};

const money = amount => {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Number(amount)) : 0;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0
  }).format(safeAmount).replace('ZAR', 'R').replace(/\s/g, '');
};

function discountFor(count) {
  if (!Number.isInteger(count) || count < 1) return 0;
  if (count === 2) return 0.05;
  if (count === 3) return 0.10;
  if (count >= 4) return 0.15;
  return 0;
}

function calculateBookingSummary(selectedValues) {
  const uniqueValues = [...new Set((Array.isArray(selectedValues) ? selectedValues : []).filter(Boolean))];
  const subtotal = uniqueValues.reduce((sum, value) => sum + Number(offeringPrices[value] || 0), 0);
  const discountRate = discountFor(uniqueValues.length);
  const discountAmount = subtotal * discountRate;
  const total = Math.max(0, subtotal - discountAmount);

  return {
    bookingCount: uniqueValues.length,
    subtotal,
    discountRate,
    discountAmount,
    total
  };
}

const menuToggle = typeof document !== 'undefined' ? document.querySelector('.menu-toggle') : null;
const mainNav = typeof document !== 'undefined' ? document.querySelector('.main-nav') : null;
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuToggle.textContent = isOpen ? '✕' : '☰';
  });
}

const bookingInputs = typeof document !== 'undefined' ? [...document.querySelectorAll('input[name="booking"]')] : [];
function updateCalculator() {
  if (!bookingInputs.length) return;

  const selected = bookingInputs.filter(input => input.checked).map(input => input.value);
  const summary = calculateBookingSummary(selected);
  const bookingCountEl = document.querySelector('#booking-count');
  const subtotalEl = document.querySelector('#subtotal');
  const rateEl = document.querySelector('#discount-rate');
  const discountEl = document.querySelector('#discount-amount');
  const totalEl = document.querySelector('#final-total');
  const note = document.querySelector('#savings-note');

  if (bookingCountEl) bookingCountEl.textContent = String(summary.bookingCount);
  if (subtotalEl) subtotalEl.textContent = money(summary.subtotal);
  if (rateEl) rateEl.textContent = `(${Math.round(summary.discountRate * 100)}%)`;
  if (discountEl) discountEl.textContent = `−${money(summary.discountAmount)}`;
  if (totalEl) totalEl.textContent = money(summary.total);

  if (note) {
    if (summary.bookingCount === 0) {
      note.textContent = 'Select an offering to begin.';
    } else if (summary.bookingCount === 1) {
      note.textContent = 'Add one more distinct booking to receive 5% off.';
    } else {
      note.textContent = `You save ${money(summary.discountAmount)} with your ${Math.round(summary.discountRate * 100)}% discount.`;
    }
  }
}

if (typeof document !== 'undefined') {
  bookingInputs.forEach(input => input.addEventListener('change', updateCalculator));

  const clearButton = document.querySelector('#clear-bookings');
  if (clearButton) clearButton.addEventListener('click', () => {
    bookingInputs.forEach(input => { input.checked = false; });
    updateCalculator();
  });

  if (bookingInputs.length) {
    const requestedItem = new URLSearchParams(window.location.search).get('item');
    if (requestedItem) {
      const matchingInput = bookingInputs.find(input => input.value === requestedItem);
      if (matchingInput) matchingInput.checked = true;
    }
    updateCalculator();
  }

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const formFields = [...contactForm.querySelectorAll('input, select, textarea')];
    const message = document.querySelector('#form-message');

    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      let valid = true;

      formFields.forEach(field => {
        const isValid = field.checkValidity();
        field.setAttribute('aria-invalid', String(!isValid));
        if (!isValid) valid = false;
      });

      if (!valid) {
        if (message) {
          message.textContent = 'Please complete the required fields correctly. Check your name, email address, subject and message before submitting.';
          message.classList.add('error');
          message.classList.remove('success');
        }
        contactForm.reportValidity();
        return;
      }

      if (message) {
        message.classList.remove('error');
        message.classList.add('success');
        message.textContent = 'Your enquiry form has passed validation. This demo does not send messages; connect a backend or email service to receive enquiries.';
      }
      contactForm.reset();
      formFields.forEach(field => field.setAttribute('aria-invalid', 'false'));
    });
  }

  if (typeof window !== 'undefined') {
    window.NLGA = { money, discountFor, calculateBookingSummary, offeringPrices };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { money, discountFor, calculateBookingSummary, offeringPrices };
}
