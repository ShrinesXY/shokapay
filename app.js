/* ============================================
   SHOKAPAY — Main JavaScript
   ============================================ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

/* ── TOAST NOTIFICATION ── */
function showToast(msg = '✅ Berhasil!') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── COPY NUMBER ── */
function copyNumber(elementId, btn) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent.trim();

  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '<span>✅</span> Tersalin!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('copied');
      }, 2000);
    }
    showToast('✅ Nomor berhasil disalin!');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ Nomor berhasil disalin!');
  });
}

/* ── DOWNLOAD QRIS ── */
function downloadQRIS() {
  const link = document.createElement('a');
  link.href = 'qris.png';
  link.download = 'ShokaPay-QRIS.png';
  link.click();
  showToast('⬇ Mengunduh QRIS...');
}

/* ── GUIDE TABS (cara.html) ── */
function initGuideTabs() {
  const tabs = document.querySelectorAll('.guide-tab');
  const contents = document.querySelectorAll('.guide-content');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetEl = document.getElementById('tab-' + target);
      if (targetEl) targetEl.classList.add('active');
    });
  });
}

/* ── FAQ ACCORDION ── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── CONTACT FORM ── */
function submitForm() {
  const name    = document.getElementById('form-name')?.value.trim();
  const phone   = document.getElementById('form-phone')?.value.trim();
  const method  = document.getElementById('form-method')?.value;
  const message = document.getElementById('form-message')?.value.trim();

  if (!name || !phone || !message) {
    showToast('⚠️ Harap isi semua kolom yang wajib diisi.');
    return;
  }

  const methodLabel = {
    qris: 'QRIS', dana: 'DANA', gopay: 'GoPay',
    telkomsel: 'Pulsa Telkomsel', indosat: 'Pulsa Indosat', other: 'Lainnya'
  };

  const text = encodeURIComponent(
    `Halo ShokaPay! 👋\n\n` +
    `Nama: ${name}\n` +
    `No. WhatsApp: ${phone}\n` +
    `Metode Pembayaran: ${methodLabel[method] || '-'}\n\n` +
    `Pesan:\n${message}`
  );

  const waUrl = `https://wa.me/6285213859916?text=${text}`;
  window.open(waUrl, '_blank', 'noopener');

  showToast('✅ Mengarahkan ke WhatsApp...');

  // Reset form
  ['form-name', 'form-phone', 'form-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sel = document.getElementById('form-method');
  if (sel) sel.value = '';
}

/* ── SCROLL REVEAL ANIMATION ── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .testimonial-card, .payment-card, .step-card, .keunggulan-card, .stat-item, .faq-item'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ── PAGE TRANSITION ── */
function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 20);
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('dana://') ||
      href.startsWith('gojek://') ||
      href.startsWith('https://wa.me') ||
      link.target === '_blank'
    ) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });
}

/* ── ACTIVE NAV HIGHLIGHT ── */
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.remove('active');
    if (
      linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

/* ── NUMBER ANIMATION (Stats) ── */
function animateNumbers() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'none';
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(10px)';
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ── PAYMENT CARD HOVER RIPPLE ── */
function initCardRipple() {
  document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, #FAFCFF, #ffffff)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  setActiveNav();
  initGuideTabs();
  initFAQ();
  initScrollReveal();
  animateNumbers();
  initCardRipple();
});

