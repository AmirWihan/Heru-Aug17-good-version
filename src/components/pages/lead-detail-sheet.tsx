
'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import type { Lead } from "@/lib/data";
import { X, User, Building, Phone, Mail, FileText, CalendarCheck, MessageSquare, CheckSquare, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface LeadDetailSheetProps {
    lead: Lead;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConvert: (leadId: number) => void;
}

const activityIcons: { [key: string]: React.ElementType } = {
    "Call": Phone,
    "Email": Mail,
    "Note": MessageSquare,
};

export function LeadDetailSheet({ lead, isOpen, onOpenChange, onConvert }: LeadDetailSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b shrink-0">
                    <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={lead.avatar} />
                                <AvatarFallback><User className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-2xl font-bold">{lead.name}</SheetTitle>
                                <SheetDescription className="flex items-center gap-2"><Building className="h-4 w-4" />{lead.company}</SheetDescription>
                            </div>
                        </div>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Lead Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Status</p><p><Badge>{lead.status}</Badge></p></div>
                            <div><p className="text-muted-foreground">Source</p><p>{lead.source}</p></div>
                            <div><p className="text-muted-foreground">Email</p><p className="truncate">{lead.email}</p></div>
                            <div><p className="text-muted-foreground">Phone</p><p>{lead.phone}</p></div>
                            <div><p className="text-muted-foreground">Owner</p><p>{lead.owner.name}</p></div>
                            <div><p className="text-muted-foreground">Created</p><p>{new Date(lead.createdDate).toLocaleDateString()}</p></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Activity Log</CardTitle>
                                <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4"/>Log Activity</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {(lead.activity || []).map((item) => {
                                const Icon = activityIcons[item.type] || FileText;
                                return (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="bg-muted p-2 rounded-full mt-1"><Icon className="h-4 w-4 text-primary"/></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Logged a "{item.type}"</p>
                                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                                            <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                                                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                );
                           })}
                           {(lead.activity || []).length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-4">No activities logged for this lead.</p>
                           )}
                        </CardContent>
                    </Card>
                </div>
                 <SheetFooter className="p-6 border-t shrink-0">
                    <Button className="w-full" size="lg" onClick={() => onConvert(lead.id)}>Convert to Client</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
