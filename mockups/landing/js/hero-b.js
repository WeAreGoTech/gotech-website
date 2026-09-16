/* Hero B "Akış": vertical scroll drives a horizontal rail; an order packet travels the line and wakes each step */
const HeroB = (() => {
  const root = qs('#concept-b');
  const pin = qs('.pin', root);
  const stage = qs('.b-stage', root);
  const dots = qs('.b-dots', root);
  const track = qs('.b-track', root);
  const intro = qs('.b-intro', root);
  const steps = qsa('.b-step', root);
  const end = qs('.b-end', root);
  const svg = qs('.b-line', root);
  const base = qs('.b-path-base', root);
  const lit = qs('.b-path-lit', root);
  const clip = qs('.b-clip-rect', root);
  const packet = qs('.b-packet', root);
  const label = qs('.b-packet-label', root);
  const stepper = qs('.b-stepper', root);
  const stepperItems = qsa('.b-stepper li', root);
  const stepperFill = qs('.b-stepper-track i', root);
  const labels = ['Yeni sipariş #1042', 'Sipariş kaydedildi', 'Stoktan 2 adet düştü', 'e-Fatura gönderildi', 'Rapora işlendi'];
  // LINE_MID must match the 54fr/46fr row split of .b-step
  const PACKET_DRAW_MS = 1300, PACKET_DELAY_MS = 450, DOT_PARALLAX = .35, LINE_MID = .54;
  let nodes = [], W = 0, H = 0, introW = 0, stepW = 1, lineEnd = 0;
  let introT = 0, lastPassed = -1;

  // line height at track x: rises out of the intro, then waves through each step
  function yAt(x) {
    const mid = H * LINE_MID;
    if (x < introW) return lerp(H * .9, mid, smooth(clamp((x - introW * .4) / (introW * .6))));
    return mid + Math.sin((x - introW) / stepW * Math.PI) * H * (isNarrow() ? .02 : .04);
  }

  return {
    enter() {
      root.classList.remove('is-ready');
      void root.offsetWidth;
      requestAnimationFrame(() => root.classList.add('is-ready'));
      lastPassed = -1;
      if (REDUCED) { introT = 1; requestRender(); return; }
      introT = 0;
      const start = performance.now() + PACKET_DELAY_MS;
      const tick = now => {
        introT = easeInOut(clamp((now - start) / PACKET_DRAW_MS));
        requestRender();
        if (introT < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    layout() {
      // measure panels, not scrollWidth: the absolutely positioned svg/nodes from a previous layout would inflate it
      W = end.offsetLeft + end.offsetWidth; H = stage.clientHeight;
      introW = intro.offsetWidth; stepW = steps[0].offsetWidth;
      lineEnd = end.offsetLeft + end.offsetWidth * (isNarrow() ? .25 : .3);
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      let d = '';
      for (let x = 0; x <= lineEnd; x += 12) d += `${x ? 'L' : 'M'}${x.toFixed(1)} ${yAt(x).toFixed(1)}`;
      base.setAttribute('d', d); lit.setAttribute('d', d);
      clip.setAttribute('height', H);
      nodes.forEach(n => n.el.remove());
      const points = steps.map(s => ({ x: s.offsetLeft + s.offsetWidth / 2, step: s }));
      points.push({ x: lineEnd, step: null });
      nodes = points.map(pt => {
        const el = document.createElement('i');
        el.className = 'b-node';
        el.style.left = pt.x + 'px'; el.style.top = yAt(pt.x) + 'px';
        track.insertBefore(el, packet);
        return { ...pt, el };
      });
    },
    update() {
      const p = pinProgress(pin);
      const tx = p * Math.max(0, W - innerWidth);
      track.style.transform = `translate3d(${-tx}px,0,0)`;
      dots.style.backgroundPosition = `${-tx * DOT_PARALLAX}px 0`;

      const px = Math.min(lineEnd, tx + innerWidth * .5) * introT;
      packet.style.transform = `translate3d(${px}px, ${yAt(px)}px, 0) translate(-50%, -50%)`;
      packet.style.opacity = clamp(introT * 3);
      clip.setAttribute('width', px);

      let passed = 0;
      nodes.forEach(nd => {
        const on = px >= nd.x - 1;
        nd.el.classList.toggle('is-on', on);
        if (nd.step) { nd.step.classList.toggle('is-on', on); if (on) passed++; }
      });
      if (passed !== lastPassed) {
        label.textContent = labels[passed];
        if (lastPassed !== -1 && !REDUCED) label.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
        lastPassed = passed;
      }

      const first = nodes[0].x, last = nodes[steps.length - 1].x;
      stepperFill.style.transform = `scaleX(${clamp((px - first) / (last - first))})`;
      stepperItems.forEach((li, i) => li.classList.toggle('is-on', i < passed));
      stepper.style.opacity = smooth(clamp((tx - introW * .35) / (introW * .3)));
      nav.dataset.tone = 'dark';
    }
  };
})();
