'use client';
import { useAdminDashboard } from '@/context/AdminDashboardContext';
import { AdminOverviewPage } from '@/components/pages/admin-overview';
import { UserManagementPage } from '@/components/pages/admin-user-management';
import { PlatformSettingsPage } from '@/components/pages/admin-platform-settings';
import { Card, CardContent } from '@/components/ui/card';

// Placeholder for pages that are not created yet
const PlaceholderPage = ({ title }: { title: string }) => (
    <Card>
        <CardContent className="p-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">This page is under construction.</p>
        </CardContent>
    </Card>
);

export default function AdminDashboardPage() {
    const { page } = useAdminDashboard();

    const pageComponents: { [key: string]: React.ComponentType<any> } = {
        'overview': AdminOverviewPage,
        'users': UserManagementPage,
        'cases': () => <PlaceholderPage title="All Cases" />,
        'analytics': () => <PlaceholderPage title="Platform Analytics" />,
        'payments': () => <PlaceholderPage title="Payments & Subscriptions" />,
        'notifications': () => <PlaceholderPage title="System Notifications" />,
        'settings': PlatformSettingsPage,
    };

    const PageComponent = pageComponents[page] || AdminOverviewPage;
    
    return <PageComponent />;
}
