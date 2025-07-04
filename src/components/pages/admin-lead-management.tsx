'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { leadsData as initialLeadsData, teamMembers, type Lead } from '@/lib/data';
import { MoreHorizontal, PlusCircle, Search, Users, Target, Check, KanbanSquare, List } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LeadStatsCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'qualified': return 'success';
        case 'contacted': return 'info';
        case 'new': return 'warning';
        case 'unqualified': return 'destructive';
        default: return 'secondary';
    }
};

export function AdminLeadManagementPage() {
    const { toast } = useToast();
    const [leads, setLeads] = useState<Lead[]>(initialLeadsData);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ownerFilter, setOwnerFilter] = useState('all');

    const salesTeam = teamMembers.filter(m => m.type === 'sales' || m.type === 'advisor');
    const owners = ['all', ...salesTeam.map(m => m.name)];
    const statuses = ['all', ...Array.from(new Set(leads.map(l => l.status)))];

    const filteredLeads = leads.filter(lead => {
        const searchMatch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.company.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
        const ownerMatch = ownerFilter === 'all' || lead.owner.name === ownerFilter;
        return searchMatch && statusMatch && ownerMatch;
    });
    
    const kanbanColumns = ['New', 'Contacted', 'Qualified', 'Unqualified'];
    const leadsByStatus = kanbanColumns.reduce((acc, status) => {
        acc[status] = leads.filter(lead => lead.status === status);
        return acc;
    }, {} as Record<string, Lead[]>);

    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
    const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <LeadStatsCard title="Total Leads" value={totalLeads.toString()} icon={Users} description="All potential clients in the pipeline." />
                <LeadStatsCard title="Qualified Leads" value={qualifiedLeads.toString()} icon={Check} description="Leads ready for sales engagement." />
                <LeadStatsCard title="Conversion Rate" value={`${conversionRate}%`} icon={Target} description="From new lead to qualified." />
            </div>

            <Tabs defaultValue="table" className="w-full">
                <div className="flex justify-between items-center mb-4">
                     <TabsList>
                        <TabsTrigger value="table"><List className="mr-2 h-4 w-4" />Table View</TabsTrigger>
                        <TabsTrigger value="kanban"><KanbanSquare className="mr-2 h-4 w-4" />Kanban View</TabsTrigger>
                    </TabsList>
                     <Button onClick={() => setAddDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                </div>

                <TabsContent value="table">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads Table</CardTitle>
                             <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                                <div className="relative w-full sm:w-auto flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search by name or company..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                    <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Owner" /></SelectTrigger>
                                    <SelectContent>{owners.map(o => <SelectItem key={o} value={o}>{o === 'all' ? 'All Owners' : o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lead</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Last Contacted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeads.map(lead => (
                                        <TableRow key={lead.id}>
                                            <TableCell>
                                                <div className="font-medium">{lead.name}</div>
                                                <div className="text-sm text-muted-foreground">{lead.email}</div>
                                            </TableCell>
                                            <TableCell>{lead.company}</TableCell>
                                            <TableCell><Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6"><AvatarImage src={lead.owner.avatar} /><AvatarFallback>{lead.owner.name.charAt(0)}</AvatarFallback></Avatar>
                                                    <span className="text-sm">{lead.owner.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDistanceToNow(new Date(lead.lastContacted), { addSuffix: true })}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Assign Lead</DropdownMenuItem>
                                                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="kanban">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kanbanColumns.map(status => (
                             <Card key={status} className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-base flex justify-between items-center">
                                        <span>{status}</span>
                                        <span className="text-sm font-normal text-muted-foreground">{leadsByStatus[status].length}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 h-[500px] overflow-y-auto">
                                    {leadsByStatus[status].map(lead => (
                                        <Card key={lead.id} className="p-3 bg-card shadow-sm">
                                            <p className="font-semibold text-sm">{lead.name}</p>
                                            <p className="text-xs text-muted-foreground">{lead.company}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(lead.createdDate), { addSuffix: true })}</span>
                                                <Avatar className="h-6 w-6"><AvatarImage src={lead.owner.avatar} /><AvatarFallback>{lead.owner.name.charAt(0)}</AvatarFallback></Avatar>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Lead</DialogTitle>
                        <DialogDescription>Enter the details for the new lead.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Lead Name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" placeholder="Acme Inc." />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="owner">Lead Owner</Label>
                            <Select><SelectTrigger id="owner"><SelectValue placeholder="Assign an owner" /></SelectTrigger>
                                <SelectContent>{salesTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
                            toast({ title: 'Lead Added', description: 'The new lead has been added to your pipeline.' });
                            setAddDialogOpen(false);
                        }}>Save Lead</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
