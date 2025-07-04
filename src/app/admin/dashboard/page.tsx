'use client';
import { useAdminDashboard } from '@/context/AdminDashboardContext';
import { AdminOverviewPage } from '@/components/pages/admin-overview';
import { UserManagementPage } from '@/components/pages/admin-user-management';
import { PlatformSettingsPage } from '@/components/pages/admin-platform-settings';
import { Card, CardContent } from '@/components/ui/card';
import { AdminAllCasesPage } from '@/components/pages/admin-all-cases';
import { AdminPlatformAnalyticsPage } from '@/components/pages/admin-platform-analytics';
import { AdminPaymentsPage } from '@/components/pages/admin-payments';
import { AdminSystemNotificationsPage } from '@/components/pages/admin-system-notifications';
import { AdminTeamManagementPage } from '@/components/pages/admin-team-management';
import { AdminAllTasksPage } from '@/components/pages/admin-all-tasks';
import { AdminLeadManagementPage } from '@/components/pages/admin-lead-management';

export default function AdminDashboardPage() {
    const { page } = useAdminDashboard();

    const pageComponents: { [key: string]: React.ComponentType<any> } = {
        'overview': AdminOverviewPage,
        'users': UserManagementPage,
        'team': AdminTeamManagementPage,
        'leads': AdminLeadManagementPage,
        'cases': AdminAllCasesPage,
        'tasks': AdminAllTasksPage,
        'analytics': AdminPlatformAnalyticsPage,
        'payments': AdminPaymentsPage,
        'notifications': AdminSystemNotificationsPage,
        'settings': PlatformSettingsPage,
    };

    const PageComponent = pageComponents[page] || AdminOverviewPage;
    
    return <PageComponent />;
}
