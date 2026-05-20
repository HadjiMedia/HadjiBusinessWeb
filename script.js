/* ═══════════════════════════════════════════════════════════════
   AeroVista — script.js
   All interactive elements, form handling, modals, and UI logic
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── AIRPORT DATA ────────────────────────────────────────────────
const AIRPORTS = [
  { code: 'MNL', name: 'Manila Ninoy Aquino', city: 'Manila', country: 'Philippines' },
  { code: 'CEB', name: 'Mactan–Cebu Int\'l', city: 'Cebu', country: 'Philippines' },
  { code: 'DVO', name: 'Francisco Bangoy Int\'l', city: 'Davao', country: 'Philippines' },
  { code: 'ILO', name: 'Iloilo Int\'l', city: 'Iloilo', country: 'Philippines' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'KUL', name: 'Kuala Lumpur Int\'l', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'PVG', name: 'Shanghai Pudong Int\'l', city: 'Shanghai', country: 'China' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', country: 'Spain' },
  { code: 'FCO', name: 'Fiumicino Airport', city: 'Rome', country: 'Italy' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'JFK', name: 'John F. Kennedy Int\'l', city: 'New York', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'USA' },
  { code: 'SFO', name: 'San Francisco Int\'l', city: 'San Francisco', country: 'USA' },
  { code: 'YYZ', name: 'Toronto Pearson Int\'l', city: 'Toronto', country: 'Canada' },
  { code: 'GRU', name: 'São Paulo Guarulhos', city: 'São Paulo', country: 'Brazil' },
  { code: 'JNB', name: 'O.R. Tambo Int\'l', city: 'Johannesburg', country: 'South Africa' },
];

// ─── MOCK AIRLINES ───────────────────────────────────────────────
const AIRLINES = [
  { code: 'AV', name: 'AeroVista Air', logo: '✈' },
  { code: 'QR', name: 'Qatar Airways', logo: '🟤' },
  { code: 'EK', name: 'Emirates', logo: '🔴' },
  { code: 'SQ', name: 'Singapore Airlines', logo: '🟡' },
  { code: 'CX', name: 'Cathay Pacific', logo: '🟢' },
  { code: 'BA', name: 'British Airways', logo: '🔵' },
  { code: 'LH', name: 'Lufthansa', logo: '⚫' },
  { code: 'PR', name: 'Philippine Airlines', logo: '🔷' },
];

// ─── MOCK FLIGHT STATUS DATA ─────────────────────────────────────
const FLIGHT_STATUS_DB = {
  'AV204':  { from:'MNL', to:'DXB', dep:'09:15', arr:'14:30', gate:'B12', terminal:'3', status:'on-time',   airline:'AeroVista Air' },
  'QR815':  { from:'MNL', to:'DOH', dep:'23:55', arr:'05:10', gate:'C08', terminal:'2', status:'delayed',   airline:'Qatar Airways',  delay:'45 min' },
  'EK123':  { from:'MNL', to:'DXB', dep:'02:30', arr:'07:45', gate:'A03', terminal:'1', status:'landed',    airline:'Emirates' },
  'SQ421':  { from:'MNL', to:'SIN', dep:'08:00', arr:'11:20', gate:'D14', terminal:'2', status:'on-time',   airline:'Singapore Airlines' },
  'CX951':  { from:'MNL', to:'HKG', dep:'16:45', arr:'19:30', gate:'E05', terminal:'1', status:'on-time',   airline:'Cathay Pacific' },
  'PR101':  { from:'MNL', to:'NRT', dep:'00:20', arr:'07:15', gate:'B07', terminal:'3', status:'cancelled', airline:'Philippine Airlines' },
  'BA11':   { from:'MNL', to:'LHR', dep:'22:10', arr:'06:05', gate:'A09', terminal:'2', status:'on-time',   airline:'British Airways' },
  'LH738':  { from:'MNL', to:'FRA', dep:'20:35', arr:'06:20', gate:'C11', terminal:'1', status:'delayed',   airline:'Lufthansa', delay:'20 min' },
  'AV101':  { from:'CEB', to:'MNL', dep:'07:00', arr:'08:10', gate:'G02', terminal:'1', status:'on-time',   airline:'AeroVista Air' },
  'AV305':  { from:'MNL', to:'KUL', dep:'13:20', arr:'17:05', gate:'B15', terminal:'3', status:'on-time',   airline:'AeroVista Air' },
};

// ─── DOM READY ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBookingTabs();
  initAutocomplete();
  initDateDefaults();
  initCarousel();
  initScrollAnimations();
  initScrollTop();
  initSmoothScroll();
});

// ─── NAVBAR ──────────────────────────────────────────────────────
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveSection();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

function highlightActiveSection() {
  const sections = ['home', 'services', 'tracker', 'contact'];
  const scrollY  = window.scrollY + 100;

  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!el || !link) return;
    const inView = el.offsetTop <= scrollY && el.offsetTop + el.offsetHeight > scrollY;
    link.classList.toggle('active', inView);
  });
}

// ─── BOOKING TABS ─────────────────────────────────────────────────
function initBookingTabs() {
  const tabs = document.querySelectorAll('.booking-tab');
  const returnGroup = document.getElementById('returnGroup');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;

      document.getElementById('tab-oneway').style.display  = target !== 'multicity' ? 'block' : 'none';
      document.getElementById('tab-multicity').style.display = target === 'multicity' ? 'block' : 'none';

      // Show return date only for round-trip
      if (returnGroup) {
        returnGroup.style.display = target === 'roundtrip' ? 'block' : 'none';
        document.getElementById('returnDate').required = target === 'roundtrip';
      }
    });
  });
}

// ─── AUTOCOMPLETE ─────────────────────────────────────────────────
function initAutocomplete() {
  setupAutocompleteField('fromCity', 'fromList');
  setupAutocompleteField('toCity',   'toList');
}

function setupAutocompleteField(inputId, listId) {
  const input = document.getElementById(inputId);
  const list  = document.getElementById(listId);
  if (!input || !list) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    list.innerHTML = '';
    if (q.length < 1) { list.classList.remove('show'); return; }

    const matches = AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 6);

    if (!matches.length) { list.classList.remove('show'); return; }

    matches.forEach(a => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `<strong>${a.code}</strong> — ${a.city}, ${a.country} <small style="color:var(--muted);font-size:0.78rem;">${a.name}</small>`;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        input.value = `${a.city} (${a.code})`;
        list.classList.remove('show');
      });
      list.appendChild(item);
    });

    list.classList.add('show');
  });

  input.addEventListener('blur', () => setTimeout(() => list.classList.remove('show'), 150));
  input.addEventListener('focus', () => { if (input.value.length) input.dispatchEvent(new Event('input')); });
}

// ─── SWAP CITIES ──────────────────────────────────────────────────
function swapCities() {
  const from = document.getElementById('fromCity');
  const to   = document.getElementById('toCity');
  [from.value, to.value] = [to.value, from.value];
}

// ─── DATE DEFAULTS ────────────────────────────────────────────────
function initDateDefaults() {
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 8);

  const fmt = d => d.toISOString().split('T')[0];

  const dep = document.getElementById('departDate');
  const ret = document.getElementById('returnDate');
  if (dep) { dep.min = fmt(tomorrow); dep.value = fmt(tomorrow); }
  if (ret) { ret.min = fmt(tomorrow); ret.value = fmt(nextWeek); }
}

// ─── SEARCH FLIGHTS ───────────────────────────────────────────────
function searchFlights(event) {
  if (event) event.preventDefault();

  const from    = document.getElementById('fromCity')?.value || 'Manila (MNL)';
  const to      = document.getElementById('toCity')?.value || '';
  const date    = document.getElementById('departDate')?.value || '';
  const pax     = document.getElementById('passengers')?.value || '1';
  const cabin   = document.getElementById('cabinClass')?.value || 'economy';

  if (!to.trim()) {
    showFieldError('toCity', 'Please enter a destination.');
    return;
  }

  const fromCode = extractCode(from) || 'MNL';
  const toCode   = extractCode(to)   || 'XXX';

  document.getElementById('flightModalTitle').textContent = `Flights: ${from} → ${to}`;
  document.getElementById('flightModalSubtitle').textContent = `${formatDate(date)} · ${pax} Passenger${pax > 1 ? 's' : ''} · ${formatCabin(cabin)}`;
  document.getElementById('flightResults').innerHTML = `
    <div class="loading-state">
      <div class="loader"></div>
      <p>Searching best fares across 500+ airlines…</p>
    </div>`;

  openModal('flightModal');

  // Simulate API delay
  setTimeout(() => {
    renderFlightResults(fromCode, toCode, date, parseInt(pax), cabin);
  }, 1800);
}

function extractCode(str) {
  const match = str.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : str.slice(0, 3).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return 'Select date';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
}

function formatCabin(c) {
  const map = { economy:'Economy', premium:'Premium Economy', business:'Business Class', first:'First Class' };
  return map[c] || c;
}

function renderFlightResults(fromCode, toCode, date, pax, cabin) {
  const cabinMultiplier = { economy:1, premium:1.5, business:3.2, first:5.8 };
  const mult = cabinMultiplier[cabin] || 1;
  const basePrice = Math.floor(Math.random() * 8000 + 4000) * mult;

  const results = [];
  const shuffledAirlines = [...AIRLINES].sort(() => Math.random() - 0.5).slice(0, 5);

  shuffledAirlines.forEach((airline, i) => {
    const depHour  = 5 + Math.floor(Math.random() * 16);
    const depMin   = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const durationH = 3 + Math.floor(Math.random() * 12);
    const durationM = [0, 25, 45][Math.floor(Math.random() * 3)];
    const arrHour  = (depHour + durationH) % 24;
    const arrMin   = (depMin  + durationM) % 60;
    const price    = Math.floor(basePrice * (0.85 + Math.random() * 0.4));
    const flightNum = `${airline.code}${100 + Math.floor(Math.random() * 900)}`;
    const stops    = i === 0 ? 'Non-stop' : (Math.random() > 0.5 ? '1 Stop' : 'Non-stop');

    results.push({ airline, flightNum, depHour, depMin, arrHour, arrMin, durationH, durationM, price, stops, pax });
  });

  results.sort((a, b) => a.price - b.price);

  const html = results.map((r, i) => `
    <div class="flight-result-card" onclick="selectFlight('${r.flightNum}', ${r.price}, ${r.pax})">
      <div class="frc-airline">
        <strong>${r.airline.name}</strong>
        ${r.flightNum} · ${r.stops}
        ${i === 0 ? '<br/><span style="color:var(--gold);font-size:0.72rem;font-weight:700;">BEST VALUE</span>' : ''}
      </div>
      <div class="frc-route">
        <div class="frc-time">${pad(r.depHour)}:${pad(r.depMin)}</div>
        <div style="font-size:0.72rem;color:var(--muted);text-align:center;flex-shrink:0;">${fromCode}</div>
        <div class="frc-line-wrap" style="flex:1;position:relative;">
          <div class="frc-line">
            <span class="frc-duration">${r.durationH}h ${r.durationM ? r.durationM + 'm' : '00m'}</span>
          </div>
        </div>
        <div style="font-size:0.72rem;color:var(--muted);text-align:center;flex-shrink:0;">${toCode}</div>
        <div class="frc-time">${pad(r.arrHour)}:${pad(r.arrMin)}</div>
      </div>
      <div class="frc-price">
        ₱${r.price.toLocaleString()}
        <span>per person · ${formatCabin(cabin)}</span>
      </div>
      <button class="frc-select" onclick="event.stopPropagation();selectFlight('${r.flightNum}', ${r.price}, ${r.pax})">Select →</button>
    </div>`
  ).join('');

  document.getElementById('flightResults').innerHTML = `
    <p style="font-size:0.82rem;color:var(--muted);margin-bottom:20px;">
      ${results.length} flights found · Prices shown per person · ${formatDate(date)}
    </p>
    ${html}
    <p style="font-size:0.75rem;color:var(--muted);margin-top:16px;text-align:center;">
      * Prices are indicative. Final price confirmed at checkout. Taxes & fees may apply.
    </p>`;
}

function pad(n) { return String(n).padStart(2, '0'); }

function selectFlight(flightNum, price, pax) {
  const total = price * pax;
  closeModal('flightModal');
  showToast(`✓ Flight ${flightNum} selected — Total ₱${total.toLocaleString()}. Proceed to checkout to confirm.`, 'success', 6000);
}

// ─── ADD MULTI-CITY LEG ───────────────────────────────────────────
function addLeg() {
  const rows = document.getElementById('multiCityRows');
  const count = rows.querySelectorAll('.mc-row').length;
  if (count >= 5) { showToast('Maximum 5 flight legs allowed.', 'info'); return; }

  const newRow = document.createElement('div');
  newRow.className = 'mc-row';
  newRow.innerHTML = `
    <div class="form-group"><label>From</label><div class="input-icon-wrap"><span class="fi">🛫</span><input type="text" placeholder="City or airport" /></div></div>
    <div class="form-group"><label>To</label><div class="input-icon-wrap"><span class="fi">🛬</span><input type="text" placeholder="City or airport" /></div></div>
    <div class="form-group"><label>Date</label><div class="input-icon-wrap"><span class="fi">📅</span><input type="date" /></div></div>
    <button type="button" class="remove-leg" onclick="this.closest('.mc-row').remove()" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:1.2rem;padding:0 4px;margin-bottom:1px;align-self:flex-end;" title="Remove leg">✕</button>`;
  rows.appendChild(newRow);
}

// ─── FLIGHT TRACKER ───────────────────────────────────────────────
function trackFlight() {
  const raw    = document.getElementById('flightNumber').value.trim().toUpperCase().replace(/\s+/g, '');
  const result = document.getElementById('trackerResult');

  if (!raw) { showToast('Please enter a flight number.', 'info'); return; }

  result.style.display = 'block';
  result.innerHTML = `<div class="loading-state"><div class="loader"></div><p>Fetching real-time data…</p></div>`;

  setTimeout(() => {
    const flight = FLIGHT_STATUS_DB[raw];

    if (!flight) {
      result.innerHTML = `
        <div style="text-align:center;padding:20px;">
          <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
          <p style="font-size:0.92rem;color:var(--muted);">Flight <strong style="color:var(--white)">${raw}</strong> not found in our database.</p>
          <p style="font-size:0.8rem;color:var(--muted);margin-top:8px;">Try: AV204, QR815, EK123, SQ421, PR101</p>
        </div>`;
      return;
    }

    const statusMap = {
      'on-time':  { label: '✓ On Time',  cls: 'on-time'  },
      'delayed':  { label: '⏱ Delayed',  cls: 'delayed'  },
      'cancelled':{ label: '✕ Cancelled',cls: 'cancelled'},
      'landed':   { label: '✈ Landed',   cls: 'landed'   },
    };
    const st = statusMap[flight.status] || statusMap['on-time'];

    result.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
        <div>
          <div style="font-size:0.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Flight</div>
          <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:800;">${raw}</div>
          <div style="font-size:0.82rem;color:var(--muted);margin-top:2px;">${flight.airline}</div>
        </div>
        <span class="status-badge ${st.cls}">${st.label}${flight.delay ? ` (+${flight.delay})` : ''}</span>
      </div>
      <div class="tr-route">
        <div><div style="font-size:0.72rem;color:var(--muted)">From</div><div class="tr-city">${flight.from}</div><div style="font-size:0.82rem;color:var(--muted)">${flight.dep}</div></div>
        <div class="tr-arrow" style="flex:1;text-align:center;font-size:1.5rem;">——✈——</div>
        <div style="text-align:right;"><div style="font-size:0.72rem;color:var(--muted)">To</div><div class="tr-city">${flight.to}</div><div style="font-size:0.82rem;color:var(--muted)">${flight.arr}</div></div>
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);">
        <div><div class="tr-label">Terminal</div><div class="tr-value">${flight.terminal}</div></div>
        <div><div class="tr-label">Gate</div><div class="tr-value">${flight.gate}</div></div>
        <div><div class="tr-label">Departure</div><div class="tr-value">${flight.dep}</div></div>
        <div><div class="tr-label">Arrival</div><div class="tr-value">${flight.arr}</div></div>
      </div>`;
  }, 1400);
}

// Allow Enter key in tracker input
document.addEventListener('DOMContentLoaded', () => {
  const fnInput = document.getElementById('flightNumber');
  if (fnInput) fnInput.addEventListener('keydown', e => { if (e.key === 'Enter') trackFlight(); });
});

// ─── CAROUSEL ────────────────────────────────────────────────────
let carouselIndex = 0;

function initCarousel() {
  const carousel = document.getElementById('dealsCarousel');
  const dotsWrap = document.getElementById('carouselDots');
  if (!carousel || !dotsWrap) return;

  const cards = carousel.querySelectorAll('.deal-card');
  const total = Math.ceil(cards.length / 2);

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToCarouselPage(i));
    dotsWrap.appendChild(dot);
  }

  // Auto-advance
  setInterval(() => carouselMove(1), 5000);
}

function carouselMove(dir) {
  const carousel = document.getElementById('dealsCarousel');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.deal-card');
  const total = Math.ceil(cards.length / 2);
  carouselIndex = (carouselIndex + dir + total) % total;
  goToCarouselPage(carouselIndex);
}

function goToCarouselPage(index) {
  carouselIndex = index;
  const carousel = document.getElementById('dealsCarousel');
  const dotsWrap = document.getElementById('carouselDots');
  if (!carousel || !dotsWrap) return;

  const card = carousel.querySelector('.deal-card');
  if (!card) return;

  const cardWidth  = card.offsetWidth;
  const gap        = 20;
  const scrollLeft = index * 2 * (cardWidth + gap);
  carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });

  dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────────────
function submitContact(event) {
  event.preventDefault();

  const name    = document.getElementById('cName');
  const email   = document.getElementById('cEmail');
  const subject = document.getElementById('cSubject');
  const message = document.getElementById('cMessage');

  let valid = true;

  // Clear previous errors
  ['cName','cEmail','cMessage'].forEach(id => {
    document.getElementById(id)?.classList.remove('error');
  });
  ['errName','errEmail','errMsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add('error');
    document.getElementById('errName').textContent = 'Please enter your full name.';
    valid = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error');
    document.getElementById('errEmail').textContent = 'Please enter a valid email address.';
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    message.classList.add('error');
    document.getElementById('errMsg').textContent = 'Message must be at least 10 characters.';
    valid = false;
  }

  if (!valid) return;

  // Simulate form submission (PHP handles actual sending)
  const btn = event.target.querySelector('.btn-submit');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending…';

  setTimeout(() => {
    document.getElementById('contactForm').style.display    = 'none';
    document.getElementById('contactSuccess').style.display = 'block';
  }, 1200);
}

// ─── BOOKINGS MODAL ────────────────────────────────────────────────
function openBookingsModal() {
  openModal('bookingsModal');
}

// ─── NEWSLETTER ───────────────────────────────────────────────────
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = document.getElementById('nlEmail');
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }
  email.value = '';
  document.getElementById('nlSuccess').style.display = 'block';
  showToast('✓ You\'ve been subscribed to AeroVista deals & updates!', 'success', 4000);
}

// ─── MODALS ───────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  const existing = document.getElementById('toastContainer');
  const container = existing || (() => {
    const div = document.createElement('div');
    div.id = 'toastContainer';
    div.style.cssText = 'position:fixed;bottom:90px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:360px;';
    document.body.appendChild(div);
    return div;
  })();

  const colors = {
    success: 'rgba(34,209,122,0.15)',
    error:   'rgba(255,71,87,0.15)',
    info:    'rgba(30,144,232,0.15)',
  };
  const borders = {
    success: 'rgba(34,209,122,0.4)',
    error:   'rgba(255,71,87,0.4)',
    info:    'rgba(30,144,232,0.4)',
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${colors[type] || colors.info};
    border: 1px solid ${borders[type] || borders.info};
    color: #fff;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 0.86rem;
    line-height: 1.5;
    backdrop-filter: blur(16px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: toastIn 0.3s ease;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  `;
  toast.textContent = message;
  toast.addEventListener('click', () => toast.remove());

  // Add toast animation
  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = `
      @keyframes toastIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
      @keyframes toastOut { from { opacity:1; transform:translateX(0); }    to { opacity:0; transform:translateX(20px); } }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('.service-card, .deal-card, .contact-info-card, .contact-form-wrap, .tracker-panel, .deals-panel');

  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

// ─── SCROLL TO TOP ────────────────────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── SMOOTH SCROLL ────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}

// ─── FIELD ERROR HELPER ───────────────────────────────────────────
function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.focus();
  field.style.borderColor = 'var(--danger)';
  showToast('⚠ ' + msg, 'error');
  setTimeout(() => { field.style.borderColor = ''; }, 3000);
}
