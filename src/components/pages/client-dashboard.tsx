
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This is a placeholder component. The main dashboard view is handled by ClientOverviewPage.
// This file previously contained ClientMessagesPage, which has been moved to a correctly named file.
export function ClientDashboard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Welcome to your dashboard.</p>
            </CardContent>
        </Card>
    );
}
