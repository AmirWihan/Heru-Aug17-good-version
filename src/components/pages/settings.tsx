'use client';
import { useState } from 'react';
import { SettingsSidebar } from './settings/settings-sidebar';
import { ProfileSettings } from './settings/profile-settings';
import { SecuritySettings } from './settings/security-settings';
import { NotificationsSettings } from './settings/notifications-settings';
import { AppearanceSettings } from './settings/appearance-settings';
import { TeamSettings } from './settings/team-settings';
import { GeneralSettings } from './settings/general-settings';
import { Card, CardContent } from '@/components/ui/card';
import { IntegrationsSettings } from './settings/integrations-settings';

const PlaceholderSettings = ({ title }: { title: string }) => (
    <Card>
        <CardContent className="p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2">This settings page is under construction.</p>
        </CardContent>
    </Card>
);

export function SettingsPage() {
    const [activePage, setActivePage] = useState('general');

    const pageComponents: { [key: string]: React.ComponentType<any> } = {
        'general': GeneralSettings,
        'profile': ProfileSettings,
        'security': SecuritySettings,
        'notifications': NotificationsSettings,
        'appearance': AppearanceSettings,
        'team': TeamSettings,
        'integrations': IntegrationsSettings,
        'data': () => <PlaceholderSettings title="Data Management" />,
    };

    const ActiveComponent = pageComponents[activePage] || GeneralSettings;

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
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
}
