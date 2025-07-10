
'use client';
import { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGlobalData } from '@/context/GlobalDataContext';
import { format, isPast, isFuture, isSameDay, startOfDay } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Appointment = ReturnType<typeof useGlobalData>['appointments'][0];

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    return (
        <li className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={appointment.avatar} />
                    <AvatarFallback>{appointment.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{appointment.name}</p>
                    <p suppressHydrationWarning className="text-sm text-muted-foreground">{format(new Date(appointment.dateTime), "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant="outline">{appointment.type}</Badge>
                <Button variant="ghost" size="sm">Details</Button>
            </div>
        </li>
    );
};

export function AppointmentsPage() {
    const { toast } = useToast();
    const { appointments, clients } = useGlobalData();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isScheduling, setIsScheduling] = useState(false);

    const { upcomingAppointments, pastAppointments, appointmentDates } = useMemo(() => {
        const upcoming = appointments
            .filter(a => isFuture(new Date(a.dateTime)))
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        const past = appointments
            .filter(a => isPast(new Date(a.dateTime)))
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
        
        const appointmentDates = appointments.map(a => new Date(a.dateTime));

        return { upcomingAppointments: upcoming, pastAppointments: past, appointmentDates };
    }, [appointments]);

    const appointmentsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return appointments
            .filter(a => isSameDay(new Date(a.dateTime), selectedDate))
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }, [selectedDate, appointments]);

    const handleScheduleAppointment = () => {
        toast({
            title: "Appointment Scheduled!",
            description: "The appointment has been added to your calendar.",
        });
        setIsScheduling(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Appointments</h1>
                 <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Schedule Appointment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Appointment</DialogTitle>
                            <DialogDescription>Schedule a new appointment with a client.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="client-select">Client</Label>
                                <Select>
                                    <SelectTrigger id="client-select">
                                        <SelectValue placeholder="Select a client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
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
                            <div className="space-y-2">
                                <Label htmlFor="type-select">Appointment Type</Label>
                                <Select>
                                    <SelectTrigger id="type-select">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Consultation">Consultation</SelectItem>
                                        <SelectItem value="Document Review">Document Review</SelectItem>
                                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                                        <SelectItem value="Initial Meeting">Initial Meeting</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" placeholder="Optional notes for the appointment..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancel</Button>
                            <Button onClick={handleScheduleAppointment}>Schedule</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">
                                {selectedDate ? `Appointments for ${format(selectedDate, 'PPP')}` : 'All Appointments'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointmentsForSelectedDate.length > 0 ? (
                                <ul className="space-y-2">{appointmentsForSelectedDate.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}</ul>
                            ) : (
                                <p className="text-muted-foreground p-4 text-center">No appointments scheduled for this day.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card>
                         <CardContent className="p-2">
                             <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md"
                                modifiers={{
                                    hasAppointment: appointmentDates,
                                }}
                                modifiersClassNames={{
                                    hasAppointment: 'has-appointment',
                                }}
                                />
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
