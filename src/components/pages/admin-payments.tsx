'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { paymentsData, subscriptionsData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';

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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payments & Subscriptions</CardTitle>
                <CardDescription>Monitor all financial activity on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="transactions">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="transactions">All Transactions</TabsTrigger>
                        <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
                    </TabsList>
                    
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
                                            <TableHead>Next Billing Date</TableHead>
                                            <TableHead className="text-right">Monthly Amount</TableHead>
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
                                                <TableCell className="text-right">${sub.amount.toLocaleString()}</TableCell>
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
    );
}
