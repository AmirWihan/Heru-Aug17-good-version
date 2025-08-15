// src/components/HeuLogo.tsx
import Image from "next/image";

export default function HeuLogo({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/icons/icon-192x192.png"
      alt="Heu Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
