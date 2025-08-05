"use client";
import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/registerServiceWorker";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return null;
}
