"use client";

/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/site/motion";
import s from "./stage.module.css";

type Image = { src: string; srcSet?: string; alt: string; width: number; height: number };

// + iminin ilk hâli (px): logodaki kırmızı + sahnenin ortasında belirir
const PLUS_THICK = 12;
const PLUS_ARM = 58;
// + bu kadar büyüyünce çerçeveyi tamamen kaplar (ekranın uzun kenarı x katsayı)
const COVER_FACTOR = 1.2;
const START_DELAY = 0.2;
// açılış ziyarette bir kez oynar; ana sayfaya geri dönülünce fotoğraf hemen görünür
let played = false;

/**
 * Giriş fotoğrafı logodaki + imiyle açılır: önce ortada kırmızı + belirir, sonra + büyüyerek fotoğrafı gösterir.
 * Bitince kırpma kalkar (data-played). Ziyarette bir kez oynar; hareketi kapatan ziyaretçide fotoğraf baştan görünür;
 * JS çalışmazsa CSS 4 sn sonra açar.
 */
export function PlusReveal({ image }: { image: Image }) {
  const ref = useRef<HTMLDivElement>(null);

  // daha önce oynadıysa (başka sayfadan dönüş) ya da hareket kapalıysa: çizilmeden önce açık gelsin, boş çerçeve görünmesin
  useLayoutEffect(() => {
    if (ref.current && (played || prefersReducedMotion())) ref.current.dataset.played = "";
  }, []);

  useEffect(() => {
    const el = ref.current;
    const img = el?.querySelector("img");
    if (!el || !img || el.dataset.played !== undefined) return;
    const cover = Math.max(window.innerWidth, window.innerHeight) * COVER_FACTOR;
    const tl = gsap.timeline({
      delay: START_DELAY,
      onComplete: () => {
        played = true;
        el.dataset.played = "";
        gsap.set(el, { clearProps: "--t,--l" });
        gsap.set(img, { clearProps: "opacity,scale" });
      },
    });
    tl.fromTo(el, { "--t": "0px", "--l": "0px" }, { "--t": `${PLUS_THICK}px`, "--l": `${PLUS_ARM}px`, duration: 0.7, ease: "back.out(2.2)" })
      .to(img, { opacity: 1, duration: 0.4, ease: "power1.out" }, "+=0.1")
      .to(el, { "--t": `${cover}px`, "--l": `${cover}px`, duration: 1.5, ease: "expo.inOut" }, "<")
      .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: "expo.out" }, "<");
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={s.mask} data-parallax="">
      <img src={image.src} srcSet={image.srcSet} sizes="100vw" alt={image.alt} width={image.width} height={image.height} fetchPriority="high" />
    </div>
  );
}
