const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/** Renders plain text with its URLs clickable (used for the mail log, where invite links need to be opened). */
export function Linkify({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_PATTERN).map((part, i) =>
        i % 2 === 1 ? <a key={i} href={part}>{part}</a> : part,
      )}
    </>
  );
}
