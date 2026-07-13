// The brand's pixel-dissolve mark, reduced to a 3x3 cluster.
// Used as the section eyebrow marker across the site.
const PATTERNS: Record<string, number[]> = {
  a: [1, 1, 0, 1, 0, 1, 0, 1, 1],
  b: [0, 1, 1, 1, 1, 0, 1, 0, 1],
  c: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  d: [1, 1, 1, 0, 1, 0, 1, 0, 0],
};

export function PixelGlyph({
  variant = "a",
  className = "",
}: {
  variant?: keyof typeof PATTERNS;
  className?: string;
}) {
  const cells = PATTERNS[variant] ?? PATTERNS.a;
  return (
    <span
      className={`grid size-[11px] shrink-0 grid-cols-3 gap-px ${className}`}
      aria-hidden
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-coral" : "bg-transparent"} />
      ))}
    </span>
  );
}
