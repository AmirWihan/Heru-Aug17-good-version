"use client";
import dynamic from "next/dynamic";

const SettingsTabIsolateTest = dynamic(
  () => import("@/components/pages/settings/SettingsTabIsolateTest"),
  { ssr: false }
);

export function SettingsTabTestClient() {
  return <SettingsTabIsolateTest />;
}
