'use client';

import {
    Calendar, CreditCard, Download, DollarSign, Edit, Plus, Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invoicesData, paymentMethodsData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Let's assume the logged in client is James Wilson, who has client ID 5
const CURRENT_CLIENT_ID = 5;

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return 'success';
        case 'overdue': return 'destructive';
        case 'pending': return 'warning';
        case 'draft': return 'info';
        case 'completed': return 'success';
        default: return 'secondary';
    }
};

const InvoicesTab = () => {
    const { toast } = useToast();
    const clientInvoices = invoicesData.filter(invoice => invoice.client.id === CURRENT_CLIENT_ID);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Invoices</CardTitle>
                <CardDescription>Here is a list of your recent invoices.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientInvoices.length > 0 ? clientInvoices.map(invoice => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.service}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {invoice.status !== 'Paid' && <Button size="sm" onClick={() => toast({title: "Redirecting to payment..."})}>Pay Now</Button>}
                                    <Button variant="outline" size="icon" onClick={() => toast({ title: "Downloading Invoice...", description: `${invoice.invoiceNumber}.pdf` })}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    You have no invoices yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
};

const PaymentMethodsTab = () => {
    const { toast } = useToast();

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Saved Payment Methods</CardTitle>
                    <CardDescription>Your saved credit and debit cards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {paymentMethodsData.map(method => (
                         <Card key={method.id} className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <CreditCard className="h-8 w-8 mr-3 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-bold">{method.type} ending in {method.last4}</h4>
                                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                                    </div>
                                </div>
                                {method.isPrimary && <Badge>Primary</Badge>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4 mr-1"/> Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4 mr-1"/> Remove</Button>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Card</CardTitle>
                    <CardDescription>Securely save a card for future payments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <Label htmlFor="expiry-date">Expiration Date</Label>
                             <Input id="expiry-date" placeholder="MM/YY" />
                         </div>
                         <div>
                             <Label htmlFor="cvc">CVC</Label>
                             <Input id="cvc" placeholder="123" />
                         </div>
                     </div>
                     <div>
                         <Label htmlFor="name-on-card">Name on Card</Label>
                         <Input id="name-on-card" placeholder="John Applicant" />
                     </div>
                     <div className="flex items-center space-x-2">
                         <Checkbox id="primary-card" />
                         <Label htmlFor="primary-card" className="font-normal">Set as primary payment method</Label>
                     </div>
                     <Button className="w-full" onClick={() => toast({title: "Card Saved", description: "Your new payment method has been added."})}>
                        Add Payment Method
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};


export function ClientBillingPage() {
    const clientInvoices = invoicesData.filter(invoice => invoice.client.id === CURRENT_CLIENT_ID && invoice.status !== 'Paid');
    const totalDue = clientInvoices.reduce((acc, inv) => acc + inv.amount, 0);

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount Due</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalDue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{clientInvoices.length} outstanding invoice(s)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Invoice Due</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {clientInvoices.length > 0 ? clientInvoices[0].dueDate : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {clientInvoices.length > 0 ? `Invoice ${clientInvoices[0].invoiceNumber}` : 'No upcoming payments'}
                        </p>
                    </CardContent>
                </Card>
            </div>
            
             <Tabs defaultValue="invoices">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="invoices">My Invoices</TabsTrigger>
                    <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices" className="mt-6">
                    <InvoicesTab />
                </TabsContent>
                <TabsContent value="payment-methods" className="mt-6">
                    <PaymentMethodsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}