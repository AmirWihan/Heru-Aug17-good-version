import React, { Suspense } from "react";
import LoginPage from "./page";

export default function LoginSuspenseWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
