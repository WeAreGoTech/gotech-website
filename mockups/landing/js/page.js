/* Page behaviour: nav, section scroll states, in-page links, mobile menu, contact form, hero switcher, render loop */

/* ---------- nav: solid after the hero, tone follows the section underneath ---------- */
const NAV_PROBE_Y = 36;
const heroSlot = qs('.hero-slot');
const toneSections = qsa('[data-nav-tone]');
function updateNav() {
  const pastHero = heroSlot.getBoundingClientRect().bottom <= NAV_PROBE_Y;
  nav.classList.toggle('is-solid', pastHero);
  document.body.classList.toggle('past-hero', pastHero);
  if (!pastHero) return; // the active hero concept sets the tone while it is on screen
  const under = toneSections.find(s => {
    const r = s.getBoundingClientRect();
    return r.top <= NAV_PROBE_Y && r.bottom > NAV_PROBE_Y;
  });
  if (under) nav.dataset.tone = under.dataset.navTone;
}

/* ---------- services: mark the service being read ---------- */
const serviceLinks = qsa('.services-index a');
const serviceItems = qsa('.service');
function updateServices() {
  const line = innerHeight * .45;
  let current = 0;
  serviceItems.forEach((s, i) => { if (s.getBoundingClientRect().top < line) current = i; });
  serviceLinks.forEach((a, i) => a.classList.toggle('is-active', i === current));
}

/* ---------- process: rail fills and steps light up as they cross the reading line ---------- */
const railBox = qs('.steps-rail');
const railFill = qs('.steps-rail i');
const processNums = qsa('.step-num');
function layoutProcess() {
  const wrapTop = railBox.parentElement.getBoundingClientRect().top;
  const centerOf = el => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 - wrapTop; };
  const first = centerOf(processNums[0]);
  railBox.style.top = first + 'px';
  railBox.style.height = centerOf(processNums[processNums.length - 1]) - first + 'px';
}
function updateProcess() {
  const line = innerHeight * .6;
  const r = railBox.getBoundingClientRect();
  railFill.style.transform = `scaleY(${clamp((line - r.top) / r.height)})`;
  processNums.forEach(num => {
    const n = num.getBoundingClientRect();
    num.parentElement.classList.toggle('is-on', n.top + n.height / 2 < line);
  });
}

/* ---------- mobile menu ---------- */
const menuBtn = qs('.menu-btn');
const menu = qs('#mobile-menu');
function setMenu(open) {
  if (menu.hidden === !open) return;
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? 'Kapat' : 'Menü';
  document.body.classList.toggle('menu-open', open);
  if (lenis) open ? lenis.stop() : lenis.start();
  (open ? qs('a', menu) : menuBtn).focus();
}
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ---------- in-page links ---------- */
function scrollToTarget(target) {
  const offset = target.matches('section, main') ? 0 : -(nav.offsetHeight + 24);
  if (lenis) lenis.scrollTo(target, { offset });
  else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY + offset, behavior: REDUCED ? 'auto' : 'smooth' });
}
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const id = link.getAttribute('href');
  const target = id.length > 1 ? qs(id) : null;
  setMenu(false);
  if (target) scrollToTarget(target);
});

/* ---------- contact form (mockup: validates and shows the sent state, nothing is sent) ---------- */
const form = qs('#contact-form');
const formDone = qs('.form-done');
const validated = qsa('[data-validate]', form);
function validateField(input) {
  const ok = input.checkValidity();
  const wrap = input.closest('[data-field]');
  wrap.classList.toggle('is-invalid', !ok);
  input.setAttribute('aria-invalid', !ok);
  qs('.field-error', wrap).hidden = ok;
  return ok;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const invalid = validated.filter(input => !validateField(input));
  if (invalid.length) { invalid[0].focus(); return; }
  form.hidden = true;
  formDone.hidden = false;
  qs('h3', formDone).focus();
  requestRender();
});
validated.forEach(input => input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
  if (input.closest('[data-field]').classList.contains('is-invalid')) validateField(input);
}));
qs('button', formDone).addEventListener('click', () => {
  form.reset();
  formDone.hidden = true;
  form.hidden = false;
  qs('input', form).focus();
  requestRender();
});

/* ---------- hero switcher + concept notes (mockup only) ---------- */
const NOTES = {
  b: {
    title: 'B. Akış',
    body: 'Dikey scroll yatay bir hatta dönüşüyor. Sarı sipariş etiketi web sitesinden rapora kadar yolculuk ediyor; geçtiği her durakta kart canlanıyor (stok düşüyor, fatura gönderiliyor, grafik yükseliyor) ve üstteki adım göstergesi ilerliyor.',
    why: 'Web sitesi, ERP ve paneli tek hikâyede bağlıyor. Yumuşak ama büyük tipografi ile kurumsal ve canlı hissi bir arada veriyor.',
    care: 'Kartlardaki örnek (kahve dükkânı) gerçek bir müşteri senaryosuyla değiştirilmeli. Yatay akış mobilde gerçek cihazda test edilmeli.'
  },
  c: {
    title: 'C. Dalış',
    body: 'Başlığın ortasındaki küçük ekran scroll ile büyüyüp tüm sayfayı kaplıyor; ziyaretçi panelin içine giriyor ve sonunda davet kartı beliriyor.',
    why: 'En sade ve premium duran seçenek. Kurumsal müşteriye ve "ciddi firma" algısına iyi gider.',
    care: 'Ekrandaki panelin çok iyi görünmesi şart: gerçek bir panel tasarımı ya da özenle hazırlanmış demo ekranı gerekiyor.'
  }
};
const concepts = { b: HeroB, c: HeroC };
let active = 'b';

const note = qs('.note');
const noteToggle = qs('.note-toggle');
noteToggle.addEventListener('click', () => {
  const open = note.hidden;
  note.hidden = !open;
  noteToggle.setAttribute('aria-expanded', open);
});

function setConcept(key) {
  active = key;
  document.body.dataset.concept = key;
  qsa('.concept').forEach(c => { c.hidden = c.dataset.key !== key; });
  qsa('.switch button[data-key]').forEach(b => b.setAttribute('aria-pressed', b.dataset.key === key));
  const n = NOTES[key];
  qs('.note-title').textContent = n.title;
  qs('.note-body').textContent = n.body;
  qs('.note-why').textContent = n.why;
  qs('.note-care').textContent = n.care;
  history.replaceState(null, '', '#' + key);
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
  concepts[key].layout();
  concepts[key].enter();
  layoutProcess();
  requestRender();
}
qsa('.switch button[data-key]').forEach(b => b.addEventListener('click', () => setConcept(b.dataset.key)));

/* ---------- render loop ---------- */
const hint = qs('.scroll-hint');
function relayout() { concepts[active].layout(); layoutProcess(); requestRender(); }
addEventListener('scroll', requestRender, { passive: true });
addEventListener('resize', relayout);
document.fonts && document.fonts.ready.then(relayout);

setConcept(NOTES[location.hash.slice(1)] ? location.hash.slice(1) : 'b');

(function loop() {
  requestAnimationFrame(loop);
  if (!frame.dirty) return;
  frame.dirty = false;
  concepts[active].update();
  updateNav();
  updateServices();
  updateProcess();
  hint.classList.toggle('is-gone', scrollY > 40);
})();
