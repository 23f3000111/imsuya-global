import { PixelGlyph } from "./PixelGlyph";

export function Eyebrow({
  children,
  variant = "a",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "a" | "b" | "c" | "d";
  className?: string;
}) {
  return (
    <p className={`text-eyebrow flex items-center gap-3 text-muted ${className}`}>
      <PixelGlyph variant={variant} />
      {children}
    </p>
  );
}
