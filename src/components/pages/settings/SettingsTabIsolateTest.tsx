"use client";
import React from "react";
import { GeneralSettings } from "./general-settings";
import { TeamSettings } from "./team-settings";
import { RolesSettings } from "./roles-settings";
import { BillingSettings } from "./billing-settings";
import { DataSettings } from "./data-settings";
import { ProfileSettings } from "./profile-settings";
import { AppearanceSettings } from "./appearance-settings";
import { SecuritySettings } from "./security-settings";
import { NotificationsSettings } from "./notifications-settings";
import { IntegrationsSettings } from "./integrations-settings";

const tabs = [
  { name: "GeneralSettings", Comp: GeneralSettings },
  { name: "TeamSettings", Comp: TeamSettings },
  { name: "RolesSettings", Comp: RolesSettings },
  { name: "BillingSettings", Comp: BillingSettings },
  { name: "DataSettings", Comp: DataSettings },
  { name: "ProfileSettings", Comp: ProfileSettings },
  { name: "AppearanceSettings", Comp: AppearanceSettings },
  { name: "SecuritySettings", Comp: SecuritySettings },
  { name: "NotificationsSettings", Comp: NotificationsSettings },
  { name: "IntegrationsSettings", Comp: IntegrationsSettings },
];

export default function SettingsTabIsolateTest() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Settings Tab Isolation Test</h2>
      {tabs.map(({ name, Comp }) => {
        try {
          return (
            <div key={name} style={{ marginBottom: 32, border: '1px solid #ccc', padding: 16 }}>
              <h3>{name}</h3>
              <React.Suspense fallback={<div>Loading...</div>}>
                <Comp />
              </React.Suspense>
            </div>
          );
        } catch (err) {
          return (
            <div key={name} style={{ color: 'red' }}>
              {name} crashed: {String(err)}
            </div>
          );
        }
      })}
    </div>
  );
}
