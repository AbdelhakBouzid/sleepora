import { useState } from "react";

export default function SleepImage({
  src,
  alt,
  className = "",
  fallback = "/images/placeholders/neutral-product.svg"
}) {
  const [failed, setFailed] = useState(false);
  const resolved = failed || !src ? fallback : src;

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      src={resolved}
    />
  );
}
