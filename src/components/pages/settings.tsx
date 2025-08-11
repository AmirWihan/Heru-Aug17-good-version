
'use client';
import { useState } from 'react';
import { SettingsSidebar } from './settings/settings-sidebar';
import { ProfileSettings } from './settings/profile-settings';
import { SecuritySettings } from './settings/security-settings';
import { NotificationsSettings } from './settings/notifications-settings';
import { AppearanceSettings } from './settings/appearance-settings';
import { TeamSettings } from './settings/team-settings';
import { GeneralSettings } from './settings/general-settings';
import { RolesSettings } from './settings/roles-settings';
import { Card, CardContent } from '@/components/ui/card';
import { IntegrationsSettings } from './settings/integrations-settings';
import { BillingSettings } from './settings/billing-settings';
import { DataSettings } from './settings/data-settings';

// Diagnostic: log all imported settings tab components
const settingsTabComponents = {
    ProfileSettings,
    SecuritySettings,
    NotificationsSettings,
    AppearanceSettings,
    TeamSettings,
    GeneralSettings,
    RolesSettings,
    IntegrationsSettings,
    BillingSettings,
    DataSettings,
};

Object.entries(settingsTabComponents).forEach(([name, comp]) => {
    if (typeof comp !== 'function') {
        // eslint-disable-next-line no-console
        console.error(`[SETTINGS DIAGNOSTIC] '${name}' is`, comp, '— likely import/export or build error!');
        if (typeof window !== 'undefined') {
            const el = document.createElement('div');
            el.style.background = '#ffdddd';
            el.style.color = '#b30000';
            el.style.padding = '8px';
            el.style.margin = '8px 0';
            el.style.fontWeight = 'bold';
            el.innerText = `[SETTINGS ERROR] '${name}' is not a valid component: ${typeof comp}`;
            document.body.prepend(el);
        }
    }
});
console.log('[DEBUG] Settings imports:', settingsTabComponents);

const PlaceholderSettings = ({ title }: { title: string }) => (
    <Card>
        <CardContent className="p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2">This settings page is under construction.</p>
        </CardContent>
    </Card>
);

import React from 'react';

class ErrorBoundary extends React.Component<{ tab: string, children: React.ReactNode }, { error: Error | null }> {
    constructor(props: { tab: string, children: React.ReactNode }) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    componentDidCatch(error: Error, info: any) {
        // eslint-disable-next-line no-console
        console.error(`[SETTINGS ERROR BOUNDARY] Crash in settings tab '${this.props.tab}'`, error, info);
    }
    render() {
        if (this.state.error) {
            return (
                <div className="p-6 bg-destructive/10 text-destructive rounded-md">
                    <strong>Fatal Error:</strong> Settings tab <code>{this.props.tab}</code> crashed.<br />
                    <pre className="mt-2 text-xs whitespace-pre-wrap">{this.state.error.message}</pre>
                    Check the browser console for the full error and stack trace.
                </div>
            );
        }
        return this.props.children;
    }
}

export function SettingsPage() {
    const [activePage, setActivePage] = useState('general');

    const pageComponents: { [key: string]: React.ComponentType<any> } = {
        'general': GeneralSettings,
        'profile': ProfileSettings,
        'security': SecuritySettings,
        'notifications': NotificationsSettings,
        'appearance': AppearanceSettings,
        'team': TeamSettings,
        'roles': RolesSettings,
        'billing': BillingSettings,
        'integrations': IntegrationsSettings,
        'data': DataSettings,
    };

    const ActiveComponent = pageComponents[activePage];
    if (!ActiveComponent) {
        console.warn(`SettingsPage: No valid component for tab '${activePage}'. Check import/export for this settings tab.`);
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold font-headline text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your workspace and account settings.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
                <div className="md:col-span-1">
                    <SettingsSidebar activePage={activePage} setActivePage={setActivePage} />
                </div>
                <div className="md:col-span-3">
                    {ActiveComponent ? (
                        <ErrorBoundary tab={activePage}>
                            <ActiveComponent />
                        </ErrorBoundary>
                    ) : (
                        <div className="p-6 bg-destructive/10 text-destructive rounded-md">
                            <strong>Error:</strong> This settings tab could not be loaded.<br />
                            Please check the browser console for details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
