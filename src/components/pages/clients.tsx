
'use client';
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search, Send } from "lucide-react";
import type { Client } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ClientDetailSheet } from "./client-detail";
import { useGlobalData } from "@/context/GlobalDataContext";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { ClientInvitationDialog } from "../client-invitation-dialog";


const clientFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export function ClientsPage() {
    const { clients, sendClientInvitation, updateClient, userProfile } = useGlobalData();
    const [isInviteClientDialogOpen, setInviteClientDialogOpen] = useState(false);
    const [clientToInvite, setClientToInvite] = useState<Client | null>(null);
    const [invitationLink, setInvitationLink] = useState('');

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [caseTypeFilter, setCaseTypeFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');

    const form = useForm<z.infer<typeof clientFormSchema>>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const handleOpenInvitationDialog = (client: Client) => {
        const lawyerId = userProfile?.id;
        if (!lawyerId) {
            toast({ title: "Error", description: "Could not identify inviting lawyer.", variant: 'destructive' });
            return;
        }
        
        const generatedLink = `${window.location.origin}/register?ref=${lawyerId}&email=${encodeURIComponent(client.email)}`;
        setInvitationLink(generatedLink);
        setClientToInvite(client);
    };

    const handleSendInvitation = () => {
        if (!clientToInvite) return;
        updateClient({ ...clientToInvite, portalStatus: 'Invited' });
        
        toast({
            title: "Invitation Sent!",
            description: `An email invitation has been sent to ${clientToInvite.name}.`,
        });
        setClientToInvite(null);
    };
    
    function onSubmit(values: z.infer<typeof clientFormSchema>) {
        const lawyerId = userProfile?.id;
        if (!lawyerId) {
            toast({ title: "Error", description: "Could not identify inviting lawyer.", variant: 'destructive' });
            return;
        }

        const invitationLink = `${window.location.origin}/register?ref=${lawyerId}&email=${encodeURIComponent(values.email)}`;
        
        sendClientInvitation({
            email: values.email,
            invitingLawyerId: lawyerId
        });

        // In a real app, this would be an email. For the demo, we show a toast with the link.
        navigator.clipboard.writeText(invitationLink);

        setInviteClientDialogOpen(false);
        form.reset();
        toast({
            title: "Invitation Sent (Link Copied!)",
            description: `An invitation for ${values.name} has been created. The unique registration link has been copied to your clipboard.`,
        });
    }

    const handleViewProfile = (client: Client) => {
        setSelectedClient(client);
        setIsSheetOpen(true);
    };

    const handleUpdateClient = (updatedClient: Client) => {
        updateClient(updatedClient);
        setSelectedClient(updatedClient);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'success' as const;
            case 'on-hold':
                return 'warning' as const;
            case 'closed':
                return 'secondary' as const;
            default:
                return 'default' as const;
        }
    }
    
    const getPortalStatusBadgeVariant = (status: Client['portalStatus']) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Invited': return 'info';
            case 'Not Invited': return 'secondary';
            default: return 'secondary';
        }
    };

    const statuses = ['all', ...Array.from(new Set(clients.map(c => c.status)))];
    const caseTypes = ['all', ...Array.from(new Set(clients.map(c => c.caseType)))];
    const countries = ['all', ...Array.from(new Set(clients.map(c => c.countryOfOrigin)))];

    const filteredClients = useMemo(() => clients.filter(client => {
        return (
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'all' || client.status === statusFilter) &&
            (caseTypeFilter === 'all' || client.caseType === caseTypeFilter) &&
            (countryFilter === 'all' || client.countryOfOrigin === countryFilter)
        );
    }), [clients, searchTerm, statusFilter, caseTypeFilter, countryFilter]);

    return (
        <TooltipProvider>
            <>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="font-headline">All Clients</CardTitle>
                            <Button onClick={() => setInviteClientDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Client
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center flex-wrap">
                            <div className="relative w-full sm:w-auto sm:flex-grow md:flex-grow-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-64"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map(status => <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Case Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {caseTypes.map(type => <SelectItem key={type} value={type}>{type === 'all' ? 'All Case Types' : type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={countryFilter} onValueChange={setCountryFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(country => <SelectItem key={country} value={country}>{country === 'all' ? 'All Countries' : country}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setCaseTypeFilter('all');
                                setCountryFilter('all');
                            }}>Reset Filters</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Case Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Portal Access</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.length > 0 ? filteredClients.map((client) => (
                                        <TableRow key={client.id} onClick={() => handleViewProfile(client)} className="cursor-pointer">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {client.analysis ? (
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <div className={cn(
                                                                    'h-2.5 w-2.5 rounded-full',
                                                                    client.analysis.scoreLabel === 'Green' && 'bg-green-500',
                                                                    client.analysis.scoreLabel === 'Yellow' && 'bg-yellow-500',
                                                                    client.analysis.scoreLabel === 'Red' && 'bg-red-500'
                                                                )} />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Success Probability: {client.analysis.successProbability}%</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        <div className="w-2.5 h-2.5" /> // Placeholder for alignment
                                                    )}
                                                    <Avatar>
                                                        <AvatarImage src={client.avatar} alt={client.name} />
                                                        <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">{client.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{client.caseType}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                 <Badge variant={getPortalStatusBadgeVariant(client.portalStatus)}>{client.portalStatus}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                 {client.portalStatus === 'Not Invited' && (
                                                    <Button size="sm" onClick={(e) => { e.stopPropagation(); handleOpenInvitationDialog(client); }}>
                                                        <Send className="mr-2 h-4 w-4" /> Invite to Portal
                                                    </Button>
                                                )}
                                                {client.portalStatus === 'Invited' && (
                                                    <Button size="sm" variant="outline" disabled>
                                                        Invitation Sent
                                                    </Button>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewProfile(client)}>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No clients found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isInviteClientDialogOpen} onOpenChange={setInviteClientDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                            <DialogDescription>
                                Add a new client to your list. An invitation link will be generated for them to join the portal.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Client's Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Client's Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="button" variant="secondary" onClick={() => setInviteClientDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Add Client & Get Invite Link</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {clientToInvite && (
                    <ClientInvitationDialog
                        isOpen={!!clientToInvite}
                        onOpenChange={(isOpen) => !isOpen && setClientToInvite(null)}
                        client={clientToInvite}
                        invitationLink={invitationLink}
                        onSend={handleSendInvitation}
                    />
                )}

                {selectedClient && (
                    <ClientDetailSheet
                        client={selectedClient}
                        isOpen={isSheetOpen}
                        onOpenChange={setIsSheetOpen}
                        onUpdateClient={handleUpdateClient}
                    />
                )}
            </>
        </TooltipProvider>
    );
}
