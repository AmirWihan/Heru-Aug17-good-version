'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { paymentsData, subscriptionsData, invoicesData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MoreHorizontal, DollarSign, Users, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return 'success';
        case 'completed': return 'success';
        case 'overdue': return 'destructive';
        case 'pending': return 'warning';
        case 'active': return 'success';
        case 'canceled': return 'destructive';
        default: return 'secondary';
    }
};

export function AdminPaymentsPage() {
    const { toast } = useToast();
    const totalRevenue = paymentsData.reduce((acc, p) => acc + p.amount, 0);
    const mrr = subscriptionsData.filter(s => s.status === 'Active').reduce((acc, s) => acc + s.amount, 0);
    const activeSubscriptions = subscriptionsData.filter(s => s.status === 'Active').length;

    const handleInvoiceAction = (action: string, invoiceNumber: string) => {
        toast({
            title: `Invoice ${invoiceNumber}`,
            description: `${action} successfully.`,
        });
    }

    const handleSubscriptionAction = (action: string, firmName: string) => {
        toast({
            title: `Subscription for ${firmName}`,
            description: `${action} action has been triggered.`,
        });
    }

    return (
         <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${mrr.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSubscriptions}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Payments & Subscriptions</CardTitle>
                    <CardDescription>Monitor all financial activity on the platform. Monthly subscriptions are billed automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="subscriptions">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="subscriptions">Firm Subscriptions</TabsTrigger>
                            <TabsTrigger value="invoices">Client Invoices</TabsTrigger>
                            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="subscriptions" className="mt-6">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Firm Subscriptions</CardTitle>
                                    <CardDescription>Active subscriptions are billed automatically each month.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Firm Name</TableHead>
                                                <TableHead>Plan</TableHead>
                                                <TableHead>Users</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Renews On</TableHead>
                                                <TableHead>MRR</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscriptionsData.map(sub => (
                                                <TableRow key={sub.id}>
                                                    <TableCell className="font-medium">{sub.firmName}</TableCell>
                                                    <TableCell>{sub.plan}</TableCell>
                                                    <TableCell>{sub.users}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(sub.status)}>{sub.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>{sub.nextBilling}</TableCell>
                                                    <TableCell className="font-medium">${sub.amount.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onClick={() => handleSubscriptionAction('View Details for', sub.firmName)}>View Details</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleSubscriptionAction('Manage Plan for', sub.firmName)}>Manage Plan</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleSubscriptionAction('Manage Auto-Renewal for', sub.firmName)}>Manage Auto-Renewal</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleSubscriptionAction('Cancel Subscription for', sub.firmName)}>Cancel Subscription</DropdownMenuItem>
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
                        <TabsContent value="invoices" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Client Invoices</CardTitle>
                                    <CardDescription>Manage one-time invoices for individual client services.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice #</TableHead>
                                                <TableHead>Client</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invoicesData.map(invoice => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={invoice.client.avatar} alt={invoice.client.name} />
                                                                <AvatarFallback>{invoice.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="font-medium">{invoice.client.name}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{invoice.dueDate}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onClick={() => handleInvoiceAction('Details Viewed', invoice.invoiceNumber)}>View Details</DropdownMenuItem>
                                                                {invoice.status !== 'Paid' && <DropdownMenuItem onClick={() => handleInvoiceAction('Reminder Sent', invoice.invoiceNumber)}>Send Reminder</DropdownMenuItem>}
                                                                {invoice.status !== 'Paid' && <DropdownMenuItem onClick={() => handleInvoiceAction('Marked as Paid', invoice.invoiceNumber)}>Mark as Paid</DropdownMenuItem>}
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
                        <TabsContent value="transactions" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaction History</CardTitle>
                                    <CardDescription>A log of all payments processed through the platform.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Transaction ID</TableHead>
                                                <TableHead>Client</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentsData.map(payment => (
                                                <TableRow key={payment.id}>
                                                    <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                                                    <TableCell>{payment.client.name}</TableCell>
                                                    <TableCell>{payment.date}</TableCell>
                                                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                                                    <TableCell className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                        {payment.method}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(payment.status)}>{payment.status}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
