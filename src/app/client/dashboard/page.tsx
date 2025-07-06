'use client';
import { useClientDashboard } from '@/context/ClientDashboardContext';
import { ClientOverviewPage } from '@/components/pages/client-overview';
import { FindLawyerPage } from '@/components/pages/find-lawyer';
import { MyLawyersPage } from '@/components/pages/my-lawyers';
import { MyDocumentsPage } from '@/components/pages/my-documents';
import { ClientAppointmentsPage } from '@/components/pages/client-appointments';
import { ClientBillingPage } from '@/components/pages/client-billing';
import { ClientMessagesPage } from '@/components/pages/client-messages';
import { ClientSettingsPage } from '@/components/pages/client-settings';
import { SupportPage } from '@/components/pages/support';
import { ClientAgreementsPage } from '@/components/pages/client-agreements';

export default function ClientDashboardPage() {
    const { page, setPage } = useClientDashboard();

    const pageComponents: { [key: string]: React.ComponentType<any> } = {
        'overview': ClientOverviewPage,
        'find-lawyer': FindLawyerPage,
        'my-lawyers': MyLawyersPage,
        'documents': MyDocumentsPage,
        'appointments': ClientAppointmentsPage,
        'agreements': ClientAgreementsPage,
        'billing': ClientBillingPage,
        'messages': ClientMessagesPage,
        'settings': ClientSettingsPage,
        'support': SupportPage,
    };

    const PageComponent = pageComponents[page] || ClientOverviewPage;
    
    return <PageComponent setPage={setPage} />;
}
