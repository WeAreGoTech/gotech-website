import { randomInt } from "node:crypto";
import { MIN_PASSWORD_LENGTH } from "./password-rules";

// Telefonda okunacagi icin karistirilabilecek karakterler yok: I l 1, O 0, B 8, S 5.
const HARFLER = "abcdefghijkmnopqrstuvwxyz";
const BUYUKLER = "ACDEFGHJKLMNPQRTUVWXYZ";
const RAKAMLAR = "234679";
const HEPSI = HARFLER + BUYUKLER + RAKAMLAR;

const UZUNLUK = Math.max(14, MIN_PASSWORD_LENGTH);

const sec = (havuz: string) => havuz[randomInt(havuz.length)];

/**
 * Personelin musteriye telefonda/yazili olarak verebilecegi gecici sifre.
 * Her tur karakterden en az bir tane garanti edilir, sonra Fisher-Yates ile
 * karistirilir ki o karakterler hep bastaki sabit yerlerde olmasin.
 */
export function randomPassword(): string {
  const karakterler = [sec(HARFLER), sec(BUYUKLER), sec(RAKAMLAR)];
  while (karakterler.length < UZUNLUK) karakterler.push(sec(HEPSI));
  for (let i = karakterler.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [karakterler[i], karakterler[j]] = [karakterler[j], karakterler[i]];
  }
  return karakterler.join("");
}
