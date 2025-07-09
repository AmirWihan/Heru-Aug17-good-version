import type { SVGProps } from "react";

export function HeruLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H100V100H0V0Z" fill="#F31E24"/>
        <path d="M48 42H71L71 21H48V42Z" fill="white"/>
        <path d="M28 80V42L48 42L48 60H85V80H28Z" fill="white"/>
    </svg>
  );
}
