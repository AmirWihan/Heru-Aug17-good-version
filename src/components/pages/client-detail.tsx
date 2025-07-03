'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Client } from "@/lib/data";
import { CalendarCheck, FileText, MessageSquare, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const activityIcons: { [key: string]: React.ElementType } = {
    "Application Submitted": FileText,
    "New Message": MessageSquare,
    "Appointment Completed": CalendarCheck,
};

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active client': return 'success';
        case 'work permit': return 'info';
        case 'pending review': return 'warning';
        case 'high': return 'destructive';
        default: return 'secondary';
    }
};

interface ClientDetailSheetProps {
    client: Client;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ClientDetailSheet({ client, isOpen, onOpenChange }: ClientDetailSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-3xl p-0">
                <SheetHeader className="p-6 border-b">
                    <div className="flex justify-between items-start">
                         <SheetTitle className="text-2xl font-bold">Client Details</SheetTitle>
                         <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                            <AvatarImage src={client.avatar} alt={client.name} />
                            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h2 className="text-2xl font-bold">{client.name}</h2>
                                <Badge variant={getStatusBadgeVariant('active client')}>Active Client</Badge>
                                <Badge variant={getStatusBadgeVariant('work permit')}>{client.caseType}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{client.email} • {client.phone}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Country of Origin</p>
                                    <p className="font-medium">{client.countryOfOrigin}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Current Location</p>
                                    <p className="font-medium">{client.currentLocation}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Joined</p>
                                    <p className="font-medium">{format(new Date(client.joined), 'PP')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="mt-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="communications">Communications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Case Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Priority</p>
                                            <p className="font-bold text-base">{client.caseSummary.priority}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Case Type</p>
                                            <p className="font-semibold">{client.caseSummary.caseType}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Current Status</p>
                                            <Badge variant={getStatusBadgeVariant(client.caseSummary.currentStatus)}>{client.caseSummary.currentStatus}</Badge>
                                        </div>
                                         <div>
                                            <p className="text-muted-foreground">Next Step</p>
                                            <p className="font-semibold">{client.caseSummary.nextStep}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Due Date</p>
                                            <p className="font-semibold">{client.caseSummary.dueDate}</p>
                                        </div>
                                        <Button className="w-full">View Full Application</Button>
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-2">
                                     <CardHeader>
                                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {client.activity.map((item, index) => {
                                                const Icon = activityIcons[item.title];
                                                return (
                                                    <div key={index} className="flex items-start gap-4">
                                                        <div className="bg-muted p-3 rounded-full">
                                                            <Icon className="h-5 w-5 text-primary"/>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <p className="font-semibold">{item.title}</p>
                                                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                            <Button variant="link" className="p-0 h-auto text-sm">
                                                                View {item.title.split(' ')[0]}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Button variant="outline" className="w-full mt-6">View All Activity</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                         <TabsContent value="documents">
                            <Card><CardContent className="p-6">Documents management is under construction.</CardContent></Card>
                        </TabsContent>
                         <TabsContent value="timeline">
                            <Card><CardContent className="p-6">Timeline view is under construction.</CardContent></Card>
                        </TabsContent>
                         <TabsContent value="communications">
                            <Card><CardContent className="p-6">Communications log is under construction.</CardContent></Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
}
