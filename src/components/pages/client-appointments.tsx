
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGlobalData } from '@/context/GlobalDataContext';
import { format, isFuture, isPast, isSameDay } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import type { Client } from '@/lib/data';

type Appointment = ReturnType<typeof useGlobalData>['appointments'][0];

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const { toast } = useToast();
    return (
        <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={appointment.avatar} />
                    <AvatarFallback>{appointment.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{`Consultation with ${appointment.name}`}</p>
                    <p suppressHydrationWarning className="text-sm text-muted-foreground">{format(new Date(appointment.dateTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant="outline">{appointment.type}</Badge>
                <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Feature coming soon', description: 'Rescheduling will be available in a future update.' })}>Reschedule</Button>
            </div>
        </div>
    );
};

export function ClientAppointmentsPage() {
    const { toast } = useToast();
    const { userProfile, appointments, teamMembers } = useGlobalData();
    const client = userProfile as Client;
    
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isScheduling, setIsScheduling] = useState(false);

    const { clientAppointments, appointmentDates } = useMemo(() => {
        if (!client) return { clientAppointments: [], appointmentDates: [] };
        const appointmentsForClient = appointments.filter(a => a.clientId === client.id);
        const dates = appointmentsForClient.map(a => new Date(a.dateTime));
        return { clientAppointments: appointmentsForClient, appointmentDates: dates };
    }, [appointments, client]);

    const appointmentsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return clientAppointments
            .filter(a => isSameDay(new Date(a.dateTime), selectedDate))
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }, [selectedDate, clientAppointments]);
    
    const handleScheduleAppointment = () => {
        setIsScheduling(false);
        toast({
            title: "Appointment Scheduled!",
            description: "Your appointment has been successfully booked. You will receive a confirmation email shortly.",
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>My Appointments</CardTitle>
                            <CardDescription>View, schedule, and manage your appointments with your legal team.</CardDescription>
                        </div>
                        <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Schedule Appointment
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Schedule a New Appointment</DialogTitle>
                                    <DialogDescription>
                                        Choose a lawyer, date, and time that works for you.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lawyer">Lawyer</Label>
                                        <Select>
                                            <SelectTrigger id="lawyer">
                                                <SelectValue placeholder="Select a lawyer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(teamMembers || []).filter(m => m.type === 'legal' && m.id === client?.connectedLawyerId).map(lawyer => (
                                                    <SelectItem key={lawyer.id} value={lawyer.id.toString()}>{lawyer.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input id="date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="time">Time</Label>
                                            <Input id="time" type="time" defaultValue="10:00" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancel</Button>
                                    <Button onClick={handleScheduleAppointment}>Confirm Appointment</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <h3 className="font-semibold mb-4">
                                {selectedDate ? `Appointments for ${format(selectedDate, 'PPP')}` : 'All Appointments'}
                            </h3>
                             {appointmentsForSelectedDate.length > 0 ? (
                                <ul className="space-y-2">
                                    {appointmentsForSelectedDate.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground p-4 text-center border rounded-md">No appointments scheduled for this day.</p>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                             <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                                modifiers={{
                                    hasAppointment: appointmentDates,
                                }}
                                modifiersClassNames={{
                                    hasAppointment: 'has-appointment',
                                }}
                                />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
