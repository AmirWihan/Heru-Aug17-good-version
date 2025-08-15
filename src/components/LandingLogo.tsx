// src/components/LandingLogo.tsx
import Image from "next/image";

export default function LandingLogo({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/landing-logo.png"
      alt="Heu Landing Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
