import type { SVGProps } from "react";

export function OutlookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 5H8v14h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
        fill="#0078D4"
      ></path>
      <path
        d="M8.2 19h5.6l5.2-5.2V8.2L13.8 3H8.2L3 8.2v5.6L8.2 19Z"
        fill="#0078D4"
      ></path>
    </svg>
  );
}
