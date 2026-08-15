/**
 * Service icon rendered as a CSS mask rather than an <img>, so the artwork
 * takes `currentColor`. That lets one file serve every state the client asked
 * for: navy at rest, orange on hover, orange when it is the active service.
 */
export function ServiceIcon({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const url = `url(/services/icons/${slug}.png)`;
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
