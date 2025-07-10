
'use client';
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/lib/data";
import { ArrowRight, Calendar, Check, MessageSquare, SendHorizontal } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "../ui/input";
import { useGlobalData } from "@/context/GlobalDataContext";
import { format } from "date-fns";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface LawyerConnectDialogProps {
    lawyer: TeamMember;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

export function LawyerConnectDialog({ lawyer, isOpen, onOpenChange }: LawyerConnectDialogProps) {
    const { toast } = useToast();
    const { sendConnectionRequest, userProfile } = useGlobalData();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1);

    const handleSendRequest = () => {
        if (!userProfile) {
            toast({ title: "Error", description: "You must be logged in to connect.", variant: "destructive"});
            return;
        }
        if (!message.trim() || !selectedDate || !selectedTime) {
            toast({ title: "Missing Information", description: "Please write a message and select a date and time.", variant: "destructive"});
            return;
        }
        
        sendConnectionRequest(userProfile.id, {
            lawyerId: lawyer.id,
            message,
            proposedDate: format(selectedDate, 'PPP'),
            proposedTime: selectedTime
        });

        toast({
            title: "Request Sent!",
            description: `Your request to connect with ${lawyer.name} has been sent. They will be in touch shortly.`,
        });
        setStep(2);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a short delay to allow animation to finish
        setTimeout(() => {
            setStep(1);
            setMessage('');
            setSelectedDate(new Date());
            setSelectedTime('10:00 AM');
        }, 300);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Connect with {lawyer.name}</DialogTitle>
                            <div className="flex items-center gap-2 pt-1">
                                <Badge variant="secondary">{lawyer.role}</Badge>
                                <Badge variant="outline">{lawyer.consultationType} Consultation</Badge>
                            </div>
                        </DialogHeader>

                        {step === 1 ? (
                            <div className="flex-1 mt-6 space-y-4">
                                <div className="space-y-2">
                                     <Label htmlFor="message" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Send an introductory message</Label>
                                    <Input 
                                        id="message" 
                                        placeholder="Hi, I'd like to discuss my Express Entry profile..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Propose a meeting date & time</Label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <CalendarComponent
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            className="rounded-md border not-prose"
                                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                        />
                                        <div className="flex-1">
                                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map(time => (
                                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 mt-6 flex flex-col items-center justify-center text-center">
                                <Check className="h-16 w-16 text-green-500 bg-green-100 rounded-full p-2 mb-4" />
                                <h3 className="text-xl font-bold">Your Request is Sent!</h3>
                                <p className="text-muted-foreground mt-2">
                                    {lawyer.name} has received your information, including your AI assessment score. They will review your profile and respond to your meeting request soon.
                                </p>
                            </div>
                        )}
                        
                        <DialogFooter className="mt-6">
                            {step === 1 ? (
                                <Button className="w-full" size="lg" onClick={handleSendRequest}>
                                    Share Info & Send Request <SendHorizontal className="ml-2 h-4 w-4"/>
                                </Button>
                            ) : (
                                <Button className="w-full" size="lg" onClick={handleClose}>
                                    Close <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                            )}
                        </DialogFooter>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center bg-muted p-6 text-center">
                        <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                            <AvatarImage src={lawyer.avatar} />
                            <AvatarFallback>{lawyer.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg">{lawyer.name}</h3>
                        <p className="text-muted-foreground text-sm">{lawyer.firmName}</p>
                        <div className="mt-4 text-xs text-muted-foreground bg-background/50 border rounded-lg p-3">
                            <p>By sending a request, you agree to share your profile information and initial AI assessment score with {lawyer.name} for review.</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
