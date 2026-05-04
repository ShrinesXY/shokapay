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
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
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
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href').replace(/\/$/, '') || '/';
    link.classList.remove('active');
    if (linkHref === path || (path === '' && linkHref === '/')) {
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

/* ══════════════════════════════════════════════════════
   TESTIMONIALS DATA ENGINE
   ──────────────────────────────────────────────────────
   Cara menambah testimoni baru:
   1. Tambahkan objek baru di array TESTIMONIALS_DATA
   2. Isi semua field sesuai contoh yang ada
   3. Untuk foto: taruh file di assets/ lalu isi "photo": "assets/nama-file.jpg"
      Kalau tidak ada foto, isi "photo": "" → otomatis pakai inisial nama
   4. Untuk featured (card biru besar): "featured": true — max 1 featured
   5. Save file, refresh browser
══════════════════════════════════════════════════════ */

const TESTIMONIALS_DATA = [
  // ── TAMBAH / EDIT TESTIMONI DI SINI ──────────────────
  {
    name: "Andi Rizky",
    role: "Mahasiswa",
    method: "DANA",          // Label metode: DANA / GoPay / QRIS / Pulsa / dll
    methodIcon: "💙",
    stars: 5,
    text: "Prosesnya sangat cepat! Top up lewat DANA langsung masuk dalam hitungan detik. Nggak pake lama, admin juga responsif banget. Recommended!",
    photo: "",               // Kosongkan → pakai inisial. Isi path foto: "assets/andi.jpg"
    featured: false,
  },
  {
    name: "Sari Novita",
    role: "Freelancer",
    method: "QRIS",
    methodIcon: "⚡",
    stars: 5,
    text: "ShokaPay jadi pilihan utama saya. QRIS-nya gampang banget, tinggal scan langsung selesai. Paling suka karena bisa pakai semua e-wallet!",
    photo: "",
    featured: true,          // Featured = card biru, tampil di tengah
  },
  {
    name: "Bagus Wicaksono",
    role: "Gamer",
    method: "Pulsa Telkomsel",
    methodIcon: "📱",
    stars: 5,
    text: "Beli pulsa Telkomsel di sini paling gampang. Nomor langsung tersalin, prosesnya nggak ribet sama sekali. Sudah langganan dari lama.",
    photo: "",
    featured: false,
  },
  {
    name: "Dewi Rahayu",
    role: "Ibu Rumah Tangga",
    method: "GoPay",
    methodIcon: "💚",
    stars: 5,
    text: "Awalnya bingung cara pakainya, tapi panduan di websitenya jelas banget. Sekarang sering pakai GoPay transfer di sini, cepat dan aman.",
    photo: "",
    featured: false,
  },
  {
    name: "Reza Firmansyah",
    role: "Pengusaha Online",
    method: "QRIS",
    methodIcon: "⚡",
    stars: 5,
    text: "Saya rutin pakai ShokaPay untuk keperluan bisnis. Proses konfirmasinya cepat dan admin selalu fast response. Sangat profesional!",
    photo: "",
    featured: false,
  },
  {
    name: "Linda Kusuma",
    role: "Content Creator",
    method: "DANA",
    methodIcon: "💙",
    stars: 5,
    text: "Transfer lewat DANA super gampang, tinggal klik tombol buka DANA langsung masuk aplikasinya. Fitur salin nomor juga ngebantu banget!",
    photo: "",
    featured: false,
  },
  // ── CONTOH DENGAN FOTO ──────────────────────────────
  // {
  //   name: "Nama Pengguna",
  //   role: "Pekerjaan / Keterangan",
  //   method: "GoPay",
  //   methodIcon: "💚",
  //   stars: 5,
  //   text: "Tulis testimoni di sini. Usahakan 1-3 kalimat yang jujur dan spesifik.",
  //   photo: "assets/foto-nama.jpg",   ← taruh foto di folder assets/
  //   featured: false,
  // },
  // ────────────────────────────────────────────────────
];

/* ── TESTIMONIAL CAROUSEL ENGINE ── */
function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const dotsEl = document.getElementById('testiDots');
  const countEl = document.getElementById('testiCount');
  const btnPrev = document.getElementById('testiBtnPrev');
  const btnNext = document.getElementById('testiBtnNext');
  if (!track || !TESTIMONIALS_DATA.length) return;

  // Update count
  if (countEl) countEl.textContent = TESTIMONIALS_DATA.length + '+';

  // Sort: featured first in rotation
  const sorted = [...TESTIMONIALS_DATA].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  // Render cards
  track.innerHTML = sorted.map((t, i) => {
    const initials = t.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const avatarHtml = t.photo
      ? `<img src="${t.photo}" alt="${t.name}" class="testi-avatar" onerror="this.outerHTML='<div class=testi-avatar-fallback>${initials}</div>'">`
      : `<div class="testi-avatar-fallback">${initials}</div>`;
    const stars = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);
    return `
      <div class="testi-card${t.featured ? ' featured' : ''}">
        <span class="testi-quote-icon">"</span>
        <div class="testi-stars">${stars}</div>
        <p class="testi-text">"${t.text}"</p>
        <div class="testi-method-tag">${t.methodIcon} ${t.method}</div>
        <div class="testi-author">
          ${avatarHtml}
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-role">${t.role}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Determine visible cards count
  function getVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  let current = 0;
  let visible = getVisible();
  const total = sorted.length;

  function maxIndex() { return Math.max(0, total - visible); }

  // Render dots
  function renderDots() {
    if (!dotsEl) return;
    const pages = maxIndex() + 1;
    dotsEl.innerHTML = Array.from({ length: pages }, (_, i) =>
      `<button class="testi-dot${i === current ? ' active' : ''}" onclick="testiGoTo(${i})" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }

  window.testiGoTo = function(idx) {
    current = Math.max(0, Math.min(idx, maxIndex()));
    const cardW = track.children[0]?.offsetWidth + 20 || 0;
    track.style.transform = `translateX(-${current * cardW}px)`;
    renderDots();
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current >= maxIndex();
  };

  if (btnPrev) btnPrev.addEventListener('click', () => testiGoTo(current - 1));
  if (btnNext) btnNext.addEventListener('click', () => testiGoTo(current + 1));

  // Auto-play
  let autoplay = setInterval(() => {
    testiGoTo(current >= maxIndex() ? 0 : current + 1);
  }, 4500);

  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => testiGoTo(current >= maxIndex() ? 0 : current + 1), 4500);
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) testiGoTo(diff > 0 ? current + 1 : current - 1);
  });

  // Responsive resize
  window.addEventListener('resize', () => {
    const newVis = getVisible();
    if (newVis !== visible) {
      visible = newVis;
      current = 0;
      testiGoTo(0);
    }
    renderDots();
  });

  testiGoTo(0);
  renderDots();
}

// Init testimonials on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTestimonials();
});
