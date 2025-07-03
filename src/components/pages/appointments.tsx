'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { appointmentsData as initialAppointmentsData } from '@/lib/data';
import { format } from 'date-fns';

export function AppointmentsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = useState(initialAppointmentsData);
    
    const upcomingAppointments = appointments
        .filter(a => new Date(a.dateTime) >= new Date())
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Appointments</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Appointment
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-4">
                                {upcomingAppointments.map(appt => (
                                    <li key={appt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={appt.avatar} />
                                                <AvatarFallback>{appt.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{appt.name}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date(appt.dateTime), "MMMM d, yyyy 'at' h:mm a")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline">{appt.type}</Badge>
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </div>
                                    </li>
                                ))}
                             </ul>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card>
                         <CardContent className="p-2">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                                />
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
