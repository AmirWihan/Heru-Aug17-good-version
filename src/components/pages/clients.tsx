
'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { clients as initialClients, type Client } from "@/lib/data";
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


const clientFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().optional(),
    caseType: z.string({
        required_error: "Please select a case type.",
    }),
});

export function ClientsPage() {
    const [clients, setClients] = useState(initialClients);
    const [isAddClientDialogOpen, setAddClientDialogOpen] = useState(false);
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
            phone: "",
            caseType: undefined,
        },
    });

    function onSubmit(values: z.infer<typeof clientFormSchema>) {
        const newClient: Client = {
            id: clients.length + 1,
            name: values.name,
            email: values.email,
            phone: values.phone || '',
            caseType: values.caseType,
            status: 'Active',
            lastContact: new Date().toLocaleDateString('en-CA'),
            avatar: `https://i.pravatar.cc/150?u=${values.email}`,
            countryOfOrigin: 'Unknown',
            currentLocation: 'Unknown',
            joined: new Date().toISOString().split('T')[0],
            caseSummary: {
                priority: 'Medium',
                caseType: values.caseType,
                currentStatus: 'New',
                nextStep: 'Initial consultation',
                dueDate: '',
            },
            activity: [],
            documents: [],
            tasks: [],
        };
        setClients([newClient, ...clients]);
        setAddClientDialogOpen(false);
        form.reset();
        toast({
            title: "Client Added",
            description: `${values.name} has been successfully added to your client list.`,
        });
    }

    const handleViewProfile = (client: Client) => {
        setSelectedClient(client);
        setIsSheetOpen(true);
    };

    const handleUpdateClient = (updatedClient: Client) => {
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
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

    const statuses = ['all', ...Array.from(new Set(initialClients.map(c => c.status)))];
    const caseTypes = ['all', ...Array.from(new Set(initialClients.map(c => c.caseType)))];
    const countries = ['all', ...Array.from(new Set(initialClients.map(c => c.countryOfOrigin)))];

    const filteredClients = clients.filter(client => {
        return (
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'all' || client.status === statusFilter) &&
            (caseTypeFilter === 'all' || client.caseType === caseTypeFilter) &&
            (countryFilter === 'all' || client.countryOfOrigin === countryFilter)
        );
    });

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">All Clients</CardTitle>
                        <Button onClick={() => setAddClientDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Client
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
                                    <TableHead className="hidden md:table-cell">Email</TableHead>
                                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                                    <TableHead className="hidden md:table-cell">Case Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.length > 0 ? filteredClients.map((client) => (
                                    <TableRow key={client.id} onClick={() => handleViewProfile(client)} className="cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={client.avatar} alt={client.name} />
                                                    <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{client.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
                                        <TableCell className="hidden md:table-cell">{client.caseType}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">{client.lastContact}</TableCell>
                                        <TableCell>{client.activity.length} logs</TableCell>
                                        <TableCell>
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

            <Dialog open={isAddClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Client</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new client. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
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
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1-202-555-0176" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="caseType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Case Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a case type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Permanent Residency">Permanent Residency</SelectItem>
                                                <SelectItem value="Student Visa">Student Visa</SelectItem>
                                                <SelectItem value="Work Permit">Work Permit</SelectItem>
                                                <SelectItem value="Family Sponsorship">Family Sponsorship</SelectItem>
                                                <SelectItem value="Visitor Visa">Visitor Visa</SelectItem>
                                                <SelectItem value="Citizenship">Citizenship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setAddClientDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Client</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {selectedClient && (
                 <ClientDetailSheet
                    client={selectedClient}
                    isOpen={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    onUpdateClient={handleUpdateClient}
                />
            )}
        </>
    );
}
