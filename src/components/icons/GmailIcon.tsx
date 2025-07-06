import type { SVGProps } from "react";

export function GmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 5.88V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.88l8.43 5.4a4 4 0 0 0 3.14 0L22 5.88Z"
        fill="#EA4335"
      ></path>
      <path
        d="m22 5.88-9.57 6.13a2 2 0 0 1-2.86 0L2 5.88V5.3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.58Z"
        fill="#C5221F"
      ></path>
      <path
        d="m2 5.88 7.33 4.69V4.4a1 1 0 0 0-1.6-.8L2 5.88Z"
        fill="#4285F4"
      ></path>
      <path
        d="m22 5.88-7.33 4.69V4.4a1 1 0 0 1 1.6-.8L22 5.88Z"
        fill="#34A853"
      ></path>
    </svg>
  );
}
