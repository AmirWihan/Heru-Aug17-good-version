
'use client';
import { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { adminAppointmentsData } from '@/lib/data';
import { format, isFuture, isPast } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Appointment = typeof adminAppointmentsData[0];

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    return (
        <li className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={appointment.avatar} />
                    <AvatarFallback>{appointment.firmName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{appointment.type} with {appointment.firmName}</p>
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

export function AdminAppointmentsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = useState(adminAppointmentsData);
    const [isScheduling, setIsScheduling] = useState(false);
    const { toast } = useToast();
    
    const { upcomingAppointments, pastAppointments } = useMemo(() => {
        const upcoming = appointments
            .filter(a => isFuture(new Date(a.dateTime)))
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        const past = appointments
            .filter(a => isPast(new Date(a.dateTime)))
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        return { upcomingAppointments, pastAppointments };
    }, [appointments]);

    const handleScheduleAppointment = () => {
        // In a real app, you'd collect form data and create a new appointment object
        toast({
            title: "Meeting Scheduled!",
            description: "The meeting has been added to your calendar.",
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
                            Schedule Meeting
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Meeting</DialogTitle>
                            <DialogDescription>Schedule a new meeting with a lead or law firm.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="firm-name">Firm Name</Label>
                                <Input id="firm-name" placeholder="e.g. Innovate Legal" />
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
                                <Label htmlFor="type-select">Meeting Type</Label>
                                <Select>
                                    <SelectTrigger id="type-select">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sales Demo">Sales Demo</SelectItem>
                                        <SelectItem value="Onboarding">Onboarding Call</SelectItem>
                                        <SelectItem value="Support">Support Call</SelectItem>
                                        <SelectItem value="Account Review">Account Review</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" placeholder="Optional notes for the meeting..." />
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
                            <CardTitle className="font-headline">All Meetings</CardTitle>
                            <CardDescription>View upcoming and past business meetings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Tabs defaultValue="upcoming" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                                    <TabsTrigger value="past">Past</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upcoming" className="mt-4 space-y-2">
                                    {upcomingAppointments.length > 0 ? (
                                        <ul className="space-y-2">{upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}</ul>
                                    ) : (
                                        <p className="text-muted-foreground p-4 text-center">No upcoming meetings.</p>
                                    )}
                                </TabsContent>
                                <TabsContent value="past" className="mt-4 space-y-2">
                                    {pastAppointments.length > 0 ? (
                                        <ul className="space-y-2">{pastAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}</ul>
                                    ) : (
                                        <p className="text-muted-foreground p-4 text-center">No past meetings.</p>
                                    )}
                                </TabsContent>
                            </Tabs>
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
