'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { paymentsData, subscriptionsData as initialSubscriptionsData, invoicesData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, MoreHorizontal, DollarSign, Users, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

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

type Subscription = typeof initialSubscriptionsData[0];

export function AdminPaymentsPage() {
    const { toast } = useToast();
    const [subscriptions, setSubscriptions] = useState(initialSubscriptionsData);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [isDetailsOpen, setDetailsOpen] = useState(false);
    const [isManagePlanOpen, setManagePlanOpen] = useState(false);
    const [isManageRenewalOpen, setManageRenewalOpen] = useState(false);
    const [isCancelAlertOpen, setCancelAlertOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState('');
    const [autoRenew, setAutoRenew] = useState(true);

    const totalRevenue = paymentsData.reduce((acc, p) => acc + p.amount, 0);
    const mrr = subscriptions.filter(s => s.status === 'Active').reduce((acc, s) => acc + s.amount, 0);
    const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;

    const handleInvoiceAction = (action: string, invoiceNumber: string) => {
        toast({
            title: `Invoice ${invoiceNumber}`,
            description: `${action} successfully.`,
        });
    }

    const openDialog = (sub: Subscription, dialog: 'details' | 'plan' | 'renewal' | 'cancel') => {
        setSelectedSubscription(sub);
        switch (dialog) {
            case 'details': setDetailsOpen(true); break;
            case 'plan':
                setCurrentPlan(sub.plan);
                setManagePlanOpen(true);
                break;
            case 'renewal':
                setAutoRenew(sub.status === 'Active'); // Assume active means auto-renew is on
                setManageRenewalOpen(true);
                break;
            case 'cancel': setCancelAlertOpen(true); break;
        }
    }

    const handleUpdatePlan = () => {
        if (!selectedSubscription) return;
        setSubscriptions(subs => subs.map(s => s.id === selectedSubscription.id ? {...s, plan: currentPlan} : s));
        toast({ title: 'Subscription Updated', description: `${selectedSubscription.firmName}'s plan has been changed to ${currentPlan}.` });
        setManagePlanOpen(false);
    };

    const handleUpdateRenewal = () => {
        if (!selectedSubscription) return;
        toast({ title: 'Subscription Updated', description: `Auto-renewal for ${selectedSubscription.firmName} has been ${autoRenew ? 'enabled' : 'disabled'}.` });
        setManageRenewalOpen(false);
    }
    
    const handleCancelSubscription = () => {
        if (!selectedSubscription) return;
        setSubscriptions(subs => subs.map(s => s.id === selectedSubscription.id ? {...s, status: 'Canceled', nextBilling: 'N/A' } : s));
        toast({ title: 'Subscription Canceled', description: `${selectedSubscription.firmName}'s subscription has been canceled.`, variant: 'destructive' });
        setCancelAlertOpen(false);
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
                                            {subscriptions.map(sub => (
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
                                                                <DropdownMenuItem onClick={() => openDialog(sub, 'details')}>View Details</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDialog(sub, 'plan')}>Manage Plan</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDialog(sub, 'renewal')}>Manage Auto-Renewal</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive" onClick={() => openDialog(sub, 'cancel')}>Cancel Subscription</DropdownMenuItem>
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

            {selectedSubscription && (
                <>
                    <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Subscription Details</DialogTitle>
                                <DialogDescription>Viewing details for {selectedSubscription.firmName}.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 py-4 text-sm">
                                <p><strong>Plan:</strong> {selectedSubscription.plan}</p>
                                <p><strong>Status:</strong> {selectedSubscription.status}</p>
                                <p><strong>Users:</strong> {selectedSubscription.users}</p>
                                <p><strong>Monthly Cost:</strong> ${selectedSubscription.amount.toLocaleString()}</p>
                                <p><strong>Next Renewal:</strong> {selectedSubscription.nextBilling}</p>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isManagePlanOpen} onOpenChange={setManagePlanOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Manage Plan</DialogTitle>
                                <DialogDescription>Change the subscription plan for {selectedSubscription.firmName}.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-2">
                                <Label htmlFor="plan-select">New Plan</Label>
                                <Select value={currentPlan} onValueChange={setCurrentPlan}>
                                    <SelectTrigger id="plan-select"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Basic Tier">Basic Tier</SelectItem>
                                        <SelectItem value="Pro Tier">Pro Tier</SelectItem>
                                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setManagePlanOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdatePlan}>Update Plan</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isManageRenewalOpen} onOpenChange={setManageRenewalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Manage Auto-Renewal</DialogTitle>
                                <DialogDescription>Enable or disable automatic renewal for {selectedSubscription.firmName}.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 flex items-center space-x-2">
                                <Switch id="auto-renew-switch" checked={autoRenew} onCheckedChange={setAutoRenew} />
                                <Label htmlFor="auto-renew-switch">Auto-renewal is {autoRenew ? 'ON' : 'OFF'}</Label>
                            </div>
                             <DialogFooter>
                                <Button variant="outline" onClick={() => setManageRenewalOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateRenewal}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    <AlertDialog open={isCancelAlertOpen} onOpenChange={setCancelAlertOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will cancel the subscription for {selectedSubscription.firmName} at the end of the current billing period. This cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Confirm Cancellation
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}

        </div>
    );
}
