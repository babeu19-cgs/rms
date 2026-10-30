'use strict';
(() => {
  const viewport = document.getElementById('slide-viewport');
  if (!viewport) return;
  const panels = [...viewport.querySelectorAll('.panel')];
  const total = panels.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const currentNumber = document.getElementById('current-number');
  const currentLabel = document.getElementById('current-label');
  const fill = document.getElementById('progress-fill');
  const dots = document.getElementById('progress-dots');
  const prev = document.getElementById('prev-slide');
  const next = document.getElementById('next-slide');
  const menuToggle = document.querySelector('.menu-trigger');
  const menu = document.getElementById('mobile-menu');
  const serviceField = document.getElementById('service');
  const scrollHint = document.getElementById('scroll-hint');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  let active = 0;
  let wheelLockedUntil = 0;
  let scrollingRAF = 0;
  let touchStart = null;

  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menü öffnen');
  }
  menuToggle?.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !willOpen;
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  function goTo(index, options = {}) {
    const chosen = Math.max(0, Math.min(total - 1, index));
    const smooth = !reduceMotion.matches && options.smooth !== false;
    viewport.scrollTo({ left: chosen * viewport.clientWidth, behavior: smooth ? 'smooth' : 'instant' });
    update(chosen);
    if (options.updateHash) history.replaceState(null, '', '#' + panels[chosen].id);
    closeMenu();
  }
  function update(index) {
    if (index < 0 || index >= total) return;
    active = index;
    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));
    currentNumber.textContent = String(index + 1).padStart(2, '0');
    currentLabel.textContent = panels[index].dataset.label.toUpperCase();
    fill.style.width = `${((index + 1) / total) * 100}%`;
    prev.disabled = index === 0;
    next.disabled = index === total - 1;
    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle('is-current', i === index);
      if (i === index) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    document.querySelectorAll('.desktop-nav a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-go') === panels[index].id);
    });
    if (scrollHint) scrollHint.hidden = index !== 0;
  }

  panels.forEach((panel, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `${String(i + 1).padStart(2, '0')} – ${panel.dataset.label}`);
    dot.title = panel.dataset.label;
    dot.addEventListener('click', () => goTo(i, {updateHash: true}));
    dots.appendChild(dot);
  });
  update(0);
  prev.addEventListener('click', () => goTo(active - 1, {updateHash: true}));
  next.addEventListener('click', () => goTo(active + 1, {updateHash: true}));

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[data-go]');
    if (!anchor) return;
    const destination = panels.findIndex(panel => panel.id === anchor.dataset.go);
    if (destination < 0) return;
    event.preventDefault();
    if (serviceField && anchor.dataset.service) serviceField.value = anchor.dataset.service;
    goTo(destination, {updateHash: true});
  });

  viewport.addEventListener('scroll', () => {
    if (scrollingRAF) return;
    scrollingRAF = requestAnimationFrame(() => {
      const newIndex = Math.round(viewport.scrollLeft / Math.max(1, viewport.clientWidth));
      if (newIndex !== active) update(newIndex);
      scrollingRAF = 0;
    });
  }, {passive: true});

  viewport.addEventListener('wheel', event => {
    if (event.ctrlKey) return;
    // Browsers/trackpads already handle genuine horizontal scrolling natively.
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.1) return;
    if (Math.abs(event.deltaY) < 9) return;
    const scroller = event.target.closest('.panel-scroll');
    if (scroller) {
      const maxVertical = scroller.scrollHeight - scroller.clientHeight;
      const canScrollWithin = maxVertical > 3 && (event.deltaY > 0 ? scroller.scrollTop < maxVertical - 2 : scroller.scrollTop > 2);
      if (canScrollWithin) return;
    }
    if (event.cancelable) event.preventDefault();
    const now = performance.now();
    if (now < wheelLockedUntil) return;
    wheelLockedUntil = now + (reduceMotion.matches ? 280 : 720);
    goTo(active + (event.deltaY > 0 ? 1 : -1), {updateHash: true});
  }, {passive: false});

  document.addEventListener('keydown', event => {
    const tag = event.target.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY'].includes(tag) || event.target.isContentEditable || event.altKey || event.ctrlKey || event.metaKey) return;
    let index = null;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') index = active + 1;
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') index = active - 1;
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = total - 1;
    if (event.key === 'Escape') closeMenu();
    if (index === null) return;
    event.preventDefault();
    goTo(index, {updateHash: true});
  });

  // Touch devices can swipe horizontally while retaining vertical scroll inside each section.
  viewport.addEventListener('touchstart', event => {
    const t = event.touches[0];
    touchStart = {x: t.clientX, y: t.clientY, time: Date.now(), element: event.target, index: active};
  }, {passive: true});
  viewport.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const duration = Date.now() - touchStart.time;
    const startElement = touchStart.element;
    const startIndex = touchStart.index;
    touchStart = null;
    if (startElement.closest('input, textarea, select, button, a, summary, details')) return;
    if (duration < 950 && Math.abs(dx) > 75 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      goTo(startIndex + (dx < 0 ? 1 : -1), {updateHash: true});
    }
  }, {passive: true});

  window.addEventListener('resize', () => goTo(active, {smooth: false}));
  if (location.hash) {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) requestAnimationFrame(() => goTo(index, {smooth: false}));
  }
  window.addEventListener('hashchange', () => {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) goTo(index);
  });

  // Click ripple: small feedback detail, no third-party JS library needed.
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (reduceMotion.matches) return;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), {once: true});
    });
  });

  const form = document.getElementById('contact-form');
  const fallback = document.getElementById('email-fallback');
  const status = document.getElementById('form-status');
  let composedMessage = '';
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = key => String(data.get(key) || '').trim();
    const name = text('name');
    const service = text('service');
    const subject = `Anfrage über die Website – ${service} – ${name}`;
    composedMessage = [
      'Guten Tag Rund ums Haus,', '',
      'ich möchte folgende Leistung anfragen:', '',
      `Leistung: ${service}`, `Name: ${name}`,
      `E-Mail: ${text('email')}`, `Telefon: ${text('phone') || 'Nicht angegeben'}`,
      `Einsatzort / PLZ: ${text('city') || 'Nicht angegeben'}`, '',
      'Meine Anfrage:', text('message'), '', 'Mit freundlichen Grüßen', name
    ].join('\n');
    if (fallback) fallback.hidden = false;
    if (status) status.textContent = 'Ihre E-Mail ist vorbereitet. Bitte senden Sie sie in Ihrem E-Mail-Programm ab.';
    window.location.href = `mailto:info.ums.haus@web.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composedMessage)}`;
  });
  document.getElementById('copy-email')?.addEventListener('click', async event => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      event.currentTarget.textContent = 'Text kopiert ✓';
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = composedMessage;
      textarea.style.position = 'fixed'; textarea.style.left = '-9999px';
      document.body.appendChild(textarea); textarea.select();
      const ok = document.execCommand('copy');
      textarea.remove();
      event.currentTarget.textContent = ok ? 'Text kopiert ✓' : 'Bitte Text manuell kopieren';
    }
  });
})();
