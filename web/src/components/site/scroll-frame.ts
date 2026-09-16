"use client";

import type Lenis from "lenis";
import { useEffect, useRef } from "react";

/*
 * One requestAnimationFrame loop for every scroll-driven piece of the landing page.
 * Callbacks run at most once per frame, and only after a scroll, resize or explicit request.
 */
type FrameCallback = () => void;

const callbacks = new Set<FrameCallback>();
let dirty = true;
let rafId = 0;
let lenis: Lenis | null = null;

export const requestFrame = () => {
  dirty = true;
};

function tick() {
  rafId = requestAnimationFrame(tick);
  if (!dirty) return;
  dirty = false;
  callbacks.forEach((cb) => cb());
}

export function subscribeFrame(callback: FrameCallback) {
  callbacks.add(callback);
  if (callbacks.size === 1) {
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", requestFrame);
    rafId = requestAnimationFrame(tick);
  }
  requestFrame();
  return () => {
    callbacks.delete(callback);
    if (callbacks.size > 0) return;
    cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestFrame);
    window.removeEventListener("resize", requestFrame);
  };
}

export function useScrollFrame(callback: FrameCallback) {
  const latest = useRef(callback);
  useEffect(() => {
    latest.current = callback;
  });
  useEffect(() => subscribeFrame(() => latest.current()), []);
}

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;
