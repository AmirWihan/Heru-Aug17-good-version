'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export function ClientAppointmentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Appointments page is under construction. Here is a calendar component for preview.</p>
                <Calendar
                    mode="single"
                    className="rounded-md border"
                />
            </CardContent>
        </Card>
    );
}
