import type { SVGProps } from "react";

export function HeruLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.22,77.5C32.11,48.2,68.89,48.2,85.78,77.5"
        stroke="hsl(var(--primary))"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5,39.25C28.5,10,72.5,10,93.5,39.25"
        stroke="hsl(var(--accent))"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50.5" cy="42.5" r="11" fill="hsl(var(--accent))" />
    </svg>
  );
}
