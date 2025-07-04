'use client';
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamMember } from "@/lib/data";
import { X, Mail, Phone, Building, Globe, Users, Award, ShieldCheck, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active': return 'success' as const;
        case 'pending activation': return 'warning' as const;
        case 'suspended': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

interface AdminUserDetailSheetProps {
    user: TeamMember;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onUpdateUser: (updatedUser: TeamMember) => void;
}

export function AdminUserDetailSheet({ user, isOpen, onOpenChange, onUpdateUser }: AdminUserDetailSheetProps) {
    const { toast } = useToast();
    const [status, setStatus] = useState(user.status);
    const [plan, setPlan] = useState(user.plan);

    const handleSaveChanges = () => {
        onUpdateUser({ ...user, status, plan });
        toast({
            title: 'User Updated',
            description: `${user.name}'s details have been updated.`,
        });
        onOpenChange(false);
    }
    
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl p-0">
                <SheetHeader className="p-6 border-b">
                    <div className="flex justify-between items-start">
                         <SheetTitle className="text-2xl font-bold">User Details</SheetTitle>
                         <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                 <div className="p-6 overflow-y-auto h-[calc(100vh-73px)]">
                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{user.role}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4"/> {user.email}</span>
                                {user.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4"/> {user.phone}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="settings">Account Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Firm Details</CardTitle></CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p><strong className="text-muted-foreground font-normal">Firm Name:</strong> {user.firmName || 'N/A'}</p>
                                    <p><strong className="text-muted-foreground font-normal">Address:</strong> {user.firmAddress || 'N/A'}</p>
                                    <p><strong className="text-muted-foreground font-normal">Website:</strong> <a href={user.firmWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{user.firmWebsite || 'N/A'}</a></p>
                                    <p><strong className="text-muted-foreground font-normal">Employees:</strong> {user.numEmployees || 'N/A'}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> License Info</CardTitle></CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p><strong className="text-muted-foreground font-normal">License #:</strong> {user.licenseNumber}</p>
                                    <p><strong className="text-muted-foreground font-normal">Registration #:</strong> {user.registrationNumber}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Subscription</CardTitle></CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p><strong className="text-muted-foreground font-normal">Plan:</strong> {user.plan}</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="settings" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manage User Account</CardTitle>
                                    <CardDescription>Update status, subscription plan, and other account settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Account Status</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Pending Activation">Pending Activation</SelectItem>
                                                <SelectItem value="Suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Subscription Plan</Label>
                                         <Select value={plan} onValueChange={(value: TeamMember['plan']) => setPlan(value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Starter">Starter</SelectItem>
                                                <SelectItem value="Pro Team">Pro Team</SelectItem>
                                                <SelectItem value="Enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                <CardContent className="border-t pt-4">
                                     <Button variant="destructive">Delete User Account</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 pt-6 border-t flex justify-end">
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
