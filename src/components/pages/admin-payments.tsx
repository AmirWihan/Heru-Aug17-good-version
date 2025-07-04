'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { paymentsData, subscriptionsData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MoreHorizontal, DollarSign, Users, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

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
    const totalRevenue = paymentsData.reduce((acc, p) => acc + p.amount, 0);
    const mrr = subscriptionsData.filter(s => s.status === 'Active').reduce((acc, s) => acc + s.amount, 0);
    const activeSubscriptions = subscriptionsData.filter(s => s.status === 'Active').length;

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
                    <CardDescription>Monitor all financial activity on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="subscriptions">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="subscriptions">Firm Subscriptions</TabsTrigger>
                            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="subscriptions" className="mt-6">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Firm Subscriptions</CardTitle>
                                    <CardDescription>Overview of all active and past subscriptions from law firms.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Firm Name</TableHead>
                                                <TableHead>Plan</TableHead>
                                                <TableHead>Users</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Next Billing</TableHead>
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
                                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                                <DropdownMenuItem>Manage Plan</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive">Cancel Subscription</DropdownMenuItem>
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
