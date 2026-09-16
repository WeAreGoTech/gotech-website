"use client";

import { useState } from "react";
import { FormMessage } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import type { ActionState } from "@/lib/forms";
import { Icon } from "./Icon";

const SCORES = [1, 2, 3, 4, 5];
const SCORE_LABELS = ["", "Hiç memnun kalmadım", "Memnun kalmadım", "Fena değil", "Memnun kaldım", "Çok memnun kaldım"];

export function RatingStars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <span className="rating-given" aria-label={`5 üzerinden ${rating}`}>
      {SCORES.map((s) => (
        <span key={s} className={s <= rating ? undefined : "is-off"}><Icon name="star" size={size} filled /></span>
      ))}
    </span>
  );
}

type RateAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function RatingForm({ action }: { action: RateAction }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || score;

  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <h2>Nasıl yardımcı olduk?</h2>
      <input type="hidden" name="rating" value={score || ""} />
      <div className="stars" role="radiogroup" aria-label="Puan" onMouseLeave={() => setHover(0)}>
        {SCORES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={score === s}
            aria-label={SCORE_LABELS[s]}
            className={`star-btn${s <= shown ? " is-on" : ""}`}
            onClick={() => setScore(s)}
            onMouseEnter={() => setHover(s)}
          >
            <Icon name="star" size={22} filled={s <= shown} />
          </button>
        ))}
      </div>
      <p className="muted" style={{ margin: 0, minHeight: "1.5em" }}>{SCORE_LABELS[shown] || "Bir puan seçin"}</p>
      {errorFor("rating") && <p className="field-error">{errorFor("rating")}</p>}
      <label className="sr-only" htmlFor="rating-comment">Yorum</label>
      <textarea id="rating-comment" className="input" name="comment" rows={2} placeholder="Eklemek istediğiniz bir şey var mı? (isteğe bağlı)" />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Gönderiliyor…" : "Değerlendirmeyi gönder"}</button>
    </form>
  );
}
