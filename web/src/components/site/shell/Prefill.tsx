"use client";

import { useEffect } from "react";

/**
 * data-konu taşıyan bağlantılar (ör. "Demo isteyin", "Kurulumunuzu inceleyelim") iletişim formundaki konuyu seçili getirir;
 * data-mesaj varsa ve mesaj alanı boşsa onu da yazar. Kaydırmayı Motion yapar; odak formun ilk boş alanına gider.
 */
export function Prefill({ rootId }: { rootId: string }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-konu]");
      if (!trigger) return;
      const form = document.querySelector<HTMLFormElement>(`#${rootId} #iletisim form`);
      if (!form) return;
      const topic = form.querySelector<HTMLSelectElement>('select[name="topic"]');
      if (trigger.dataset.konu && topic) topic.value = trigger.dataset.konu;
      const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
      if (trigger.dataset.mesaj && message && !message.value.trim()) message.value = trigger.dataset.mesaj;
      const first = form.querySelector<HTMLInputElement>('input[name="name"]');
      if (first && !first.value) first.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [rootId]);

  return null;
}
