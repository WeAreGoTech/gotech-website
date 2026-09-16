/* Hero C "Dalış": the small screen between the headline words grows until the visitor is inside the panel */
const HeroC = (() => {
  const root = qs('#concept-c');
  const pin = qs('.pin', root);
  const stage = qs('.c-stage', root);
  const screen = qs('.c-screen', root);
  const inner = qs('.c-inner', root);
  const wl = qs('.c-word-l', root);
  const wr = qs('.c-word-r', root);
  const sub = qs('.c-sub', root);
  const endCard = qs('.c-end', root);
  const DASH_W = 1440, DASH_H = 900, DASH_MAX_H = 1600;
  return {
    enter() {},
    layout() {},
    update() {
      const p = pinProgress(pin);
      const vw = stage.clientWidth, vh = stage.clientHeight;
      const narrow = isNarrow();
      const w0 = narrow ? vw * .74 : Math.min(vw * .28, 460);
      const h0 = w0 * DASH_H / DASH_W;
      const k = easeInOut(clamp((p - .04) / .7));
      const w = lerp(w0, vw, k), h = lerp(h0, vh, k);
      screen.style.width = w + 'px';
      screen.style.height = h + 'px';
      screen.style.borderRadius = lerp(20, 0, k) + 'px';
      // scale by width, let the dashboard reflow vertically so the full-screen state never crops the sidebar
      const scale = Math.max(w / DASH_W, h / DASH_MAX_H);
      inner.style.width = w / scale + 'px';
      inner.style.height = h / scale + 'px';
      inner.style.transform = `translate(-50%, -50%) scale(${scale})`;
      const fade = 1 - clamp(k * 1.6);
      wl.style.opacity = wr.style.opacity = fade;
      const fs = parseFloat(getComputedStyle(wr).fontSize);
      if (narrow) {
        const push = k * vh * .4;
        wl.style.transform = `translate(-50%, calc(${-h0 / 2 - 14 - push}px - 100%))`;
        wr.style.transform = `translate(-50%, ${h0 / 2 + 14 + push}px)`;
        sub.style.top = `calc(50% + ${h0 / 2 + 30 + fs}px)`;
      } else {
        const gap = vw * .02, out = k * vw * .6;
        wl.style.transform = `translate(calc(${-w0 / 2 - gap - out}px - 100%), -50%)`;
        wr.style.transform = `translate(${w0 / 2 + gap + out}px, -50%)`;
        sub.style.top = `calc(50% + ${h0 / 2 + vh * .06}px)`;
      }
      const s = 1 - clamp(p * 6);
      sub.style.opacity = s;
      sub.style.visibility = s <= 0 ? 'hidden' : 'visible';
      stage.style.setProperty('--k', k.toFixed(3));
      const e = easeOut(clamp((p - .8) / .12));
      endCard.style.opacity = e;
      endCard.style.transform = `translateY(${(1 - e) * 20}px)`;
      endCard.style.visibility = e <= 0 ? 'hidden' : 'visible';
      nav.dataset.tone = k > .5 ? 'dark' : 'light';
    }
  };
})();
