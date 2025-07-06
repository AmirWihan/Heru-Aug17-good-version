'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGlobalData } from '@/context/GlobalDataContext';
import { format, isFuture, isPast } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Assume the logged-in client is James Wilson, ID 5
const CURRENT_CLIENT_ID = 5;

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
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isScheduling, setIsScheduling] = useState(false);
    const { appointments, teamMembers } = useGlobalData();
    const { toast } = useToast();

    const clientAppointments = useMemo(() => {
        return (appointments || []).filter(a => a.clientId === CURRENT_CLIENT_ID);
    }, [appointments]);

    const { upcomingAppointments, pastAppointments } = useMemo(() => {
        const upcoming = clientAppointments
            .filter(a => isFuture(new Date(a.dateTime)))
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        
        const past = clientAppointments
            .filter(a => isPast(new Date(a.dateTime)))
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        return { upcomingAppointments: upcoming, pastAppointments: past };
    }, [clientAppointments]);
    
    const handleScheduleAppointment = () => {
        setIsScheduling(false);
        toast({
            title: "Appointment Scheduled!",
            description: "Your appointment has been successfully booked. You will receive a confirmation email shortly.",
        });
        // Here you would typically add the new appointment to the global state
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
                                                {(teamMembers || []).map(lawyer => (
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
                             <Tabs defaultValue="upcoming" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                                    <TabsTrigger value="past">Past</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upcoming" className="mt-4 space-y-2">
                                    {upcomingAppointments.length > 0 ? (
                                        upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
                                    ) : (
                                        <p className="text-muted-foreground p-4 text-center">No upcoming appointments.</p>
                                    )}
                                </TabsContent>
                                <TabsContent value="past" className="mt-4 space-y-2">
                                    {pastAppointments.length > 0 ? (
                                        pastAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
                                    ) : (
                                        <p className="text-muted-foreground p-4 text-center">No past appointments.</p>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="lg:col-span-1">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                                // You could add logic here to highlight days with appointments
                                />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
