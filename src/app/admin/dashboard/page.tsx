
'use client';
import { useAdminDashboard } from '@/context/AdminDashboardContext';
import { AdminOverviewPage } from '@/components/pages/admin-overview';
import { UserManagementPage } from '@/components/pages/admin-user-management';
import { PlatformSettingsPage } from '@/components/pages/admin-platform-settings';
import { AdminPlatformAnalyticsPage } from '@/components/pages/admin-platform-analytics';
import { AdminPaymentsPage } from '@/components/pages/admin-payments';
import { AdminSystemNotificationsPage } from '@/components/pages/admin-system-notifications';
import { AdminTeamManagementPage } from '@/components/pages/admin-team-management';
import { AdminAllTasksPage } from '@/components/pages/admin-all-tasks';
import { AdminSupportTicketsPage } from '@/components/pages/admin-support-tickets';
import { AdminDocumentsPage } from '@/components/pages/admin-documents';

export default function AdminDashboardPage() {
    const { page } = useAdminDashboard();

    const pageComponents: { [key: string]: React.ComponentType<any> } = {
        'overview': AdminOverviewPage,
        'users': UserManagementPage,
        'team': AdminTeamManagementPage,
        'tasks': AdminAllTasksPage,
        'documents': AdminDocumentsPage,
        'analytics': AdminPlatformAnalyticsPage,
        'payments': AdminPaymentsPage,
        'notifications': AdminSystemNotificationsPage,
        'support-tickets': AdminSupportTicketsPage,
        'settings': PlatformSettingsPage,
    };

    const PageComponent = pageComponents[page] || AdminOverviewPage;
    
    return <PageComponent />;
}
