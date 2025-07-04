
'use client';
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { appointmentsData as initialAppointmentsData, clients } from '@/lib/data';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

type Appointment = typeof initialAppointmentsData[0];

export function AppointmentsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = useState(initialAppointmentsData);
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [isScheduling, setIsScheduling] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        const now = new Date();
        const upcoming = appointments
            .filter(a => new Date(a.dateTime) >= now)
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        setUpcomingAppointments(upcoming);
    }, [appointments]);

    const handleScheduleAppointment = () => {
        // In a real app, you'd collect form data and create a new appointment object
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
