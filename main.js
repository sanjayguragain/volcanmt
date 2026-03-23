/* ============================================================
   VOLCAN MOUNTAIN FOUNDATION — main.js
   ============================================================ */

'use strict';

// ── Top Bar visibility ────────────────────────────────────
// Top bar is now set to remain permanently sticky via CSS
// ── Sticky Header ─────────────────────────────────────────────
const header = document.getElementById('site-header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ── Mobile Navigation ──────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
let navOpen = false;

function openNav() {
  navOpen = true;
  navLinks.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = 'translateY(7px) rotate(45deg)';
  spans[1].style.opacity   = '0';
  spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
}

function closeNav() {
  navOpen = false;
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  const spans = navToggle.querySelectorAll('span');
  spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

navToggle.addEventListener('click', () => navOpen ? closeNav() : openNav());

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => { if (navOpen) closeNav(); });
});

document.addEventListener('click', (e) => {
  if (navOpen && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
});

// ── Mega Menu Toggle ──────────────────────────────────────────
const megaItems = document.querySelectorAll('.nav-item.has-mega');

megaItems.forEach(item => {
  const btn  = item.querySelector('.nav-link--mega');
  const menu = item.querySelector('.mega-menu');
  if (!btn || !menu) return;

  // Open on click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('mega-open');
    // Close all others
    megaItems.forEach(i => i.classList.remove('mega-open'));
    megaItems.forEach(i => i.querySelector('.nav-link--mega')?.setAttribute('aria-expanded', 'false'));
    if (!isOpen) {
      item.classList.add('mega-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  // Also open on hover for desktop
  item.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768) {
      megaItems.forEach(i => i.classList.remove('mega-open'));
      item.classList.add('mega-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  item.addEventListener('mouseleave', () => {
    if (window.innerWidth > 768) {
      item.classList.remove('mega-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// Close mega menus on outside click
document.addEventListener('click', () => {
  megaItems.forEach(i => {
    i.classList.remove('mega-open');
    i.querySelector('.nav-link--mega')?.setAttribute('aria-expanded', 'false');
  });
});

// ── Smooth Scroll ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = header.offsetHeight + (topBar?.offsetHeight || 0);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Scroll Fade Animations ────────────────────────────────────
const fadeTargets = [
  '.stat-item', '.timeline-item', '.mission-text', '.partners-card',
  '.conservation-card', '.education-image', '.education-text',
  '.hike-card', '.involve-card', '.event-card',
  '.donate-text', '.donate-card', '.register-text', '.register-form',
  '.art-text', '.art-newsletter', '.contact-info', '.contact-form',
].join(', ');

document.querySelectorAll(fadeTargets).forEach(el => el.classList.add('fade-in-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in-up:not(.visible)'));
      const delay = Math.min(siblings.indexOf(entry.target) * 80, 400);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// ── Animated Counters ─────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const ease = t => 1 - Math.pow(1 - t, 4);
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(ease(progress) * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => statsObserver.observe(el));

// ── Donate Amount Selection ───────────────────────────────────
const amountBtns   = document.querySelectorAll('.amount-btn');
const customInput  = document.getElementById('custom-amount');
const donateBtnTxt = document.getElementById('donate-btn-text');
let selectedAmount = 100;

function updateDonateBtn() {
  const amt = customInput?.value ? parseInt(customInput.value) : selectedAmount;
  if (donateBtnTxt) donateBtnTxt.textContent = (amt && amt > 0) ? `Donate $${amt.toLocaleString()}` : 'Donate';
}

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('amount-btn--selected'));
    btn.classList.add('amount-btn--selected');
    selectedAmount = parseInt(btn.dataset.amount);
    if (customInput) customInput.value = '';
    updateDonateBtn();
  });
});

customInput?.addEventListener('input', () => {
  amountBtns.forEach(b => b.classList.remove('amount-btn--selected'));
  selectedAmount = 0;
  updateDonateBtn();
});

// ── Donate Frequency ──────────────────────────────────────────
document.querySelectorAll('.freq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('freq-btn--selected'));
    btn.classList.add('freq-btn--selected');
  });
});

// ── Card Formatting ───────────────────────────────────────────
const cardInput = document.getElementById('donor-card');
cardInput?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
});

const expiryInput = document.getElementById('donor-expiry');
expiryInput?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
  e.target.value = v;
});

// ── Generic Form Submit Handler ───────────────────────────────
function handleForm(formId, successMsg, captchaId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const captcha = captchaId ? document.getElementById(captchaId) : null;
    if (captcha && !captcha.checked) {
      showToast('Please confirm you\'re not a robot.', 'error');
      return;
    }
    showToast(successMsg, 'success');
    form.reset();
    amountBtns.forEach(b => b.classList.remove('amount-btn--selected'));
    document.getElementById('amount-100')?.classList.add('amount-btn--selected');
    selectedAmount = 100;
    updateDonateBtn();
  });
}

// Donate form with spinner
const donateForm = document.getElementById('donate-form');
const donateSubmit = document.getElementById('donate-submit-btn');
const spinner = donateSubmit?.querySelector('.btn-spinner');

donateForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const captcha = document.getElementById('captcha-check');
  if (!captcha?.checked) { showToast('Please confirm you\'re not a robot.', 'error'); return; }
  donateSubmit.disabled = true;
  donateBtnTxt && (donateBtnTxt.textContent = 'Processing…');
  spinner?.classList.remove('hidden');
  setTimeout(() => {
    donateSubmit.disabled = false;
    spinner?.classList.add('hidden');
    showToast('🌿 Thank you for your generous donation to Volcan Mountain Foundation!', 'success');
    donateForm.reset();
    document.getElementById('amount-100')?.classList.add('amount-btn--selected');
    selectedAmount = 100;
    updateDonateBtn();
  }, 1800);
});

handleForm('register-form', '✅ Welcome! Your VMF account has been created.', 'reg-captcha');
handleForm('newsletter-form', '📬 You\'re subscribed to Volcan Voices!', null);
handleForm('contact-form', '✉️ Message sent! We\'ll be in touch soon.', 'ct-captcha');

// ── Search ────────────────────────────────────────────────────
document.getElementById('search-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('site-search')?.value.trim();
  if (q) showToast(`🔍 Searching for "${q}"…`, 'info');
});

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const colors = {
    success: { bg: '#1a3a2a', border: '#5a8a6a' },
    info:    { bg: '#1e2a3a', border: '#6b9db8' },
    error:   { bg: '#3a1a1a', border: '#c04040' },
  };
  const c = colors[type] || colors.info;
  const toast = Object.assign(document.createElement('div'), {
    className: 'toast',
    textContent: message,
    role: 'alert',
  });
  toast.setAttribute('aria-live', 'polite');
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', left: '50%',
    transform: 'translateX(-50%) translateY(80px)',
    background: c.bg, color: '#fff', border: `1px solid ${c.border}`,
    borderRadius: '12px', padding: '14px 24px',
    fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', fontWeight: '500',
    boxShadow: '0 12px 40px rgba(0,0,0,0.3)', zIndex: '9999',
    maxWidth: '90vw', textAlign: 'center',
    transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
    opacity: '0', backdropFilter: 'blur(12px)',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  }));
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
