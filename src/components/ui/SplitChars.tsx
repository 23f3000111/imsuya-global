// Deterministic char splitter — SSR-safe alternative to SplitText.
// Each char is wrapped in a span (`.char`) inside an overflow-clipped line.
export function SplitChars({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`} aria-label={text} role="text">
      {text.split("").map((char, i) => (
        <span key={i} className="char inline-block will-change-transform" aria-hidden>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
