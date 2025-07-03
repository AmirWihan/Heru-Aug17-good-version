
'use client';

import {
    AlertCircle, ArrowUp, Calendar, ChevronLeft, ChevronRight, CreditCard, Download, DollarSign, Edit, Eye, Filter, Landmark, LineChart, Plus, Printer, Search, Share2, Trash2, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { billingSummary, invoicesData, paymentsData, paymentMethodsData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const StatCard = ({ title, value, icon: Icon, change, changeType, footer }: { title: string, value: string, icon: React.ElementType, change?: string, changeType?: 'up' | 'down', footer?: string }) => (
    <Card className="dashboard-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="bg-muted p-3 rounded-full">
                <Icon className="h-5 w-5 text-primary" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold font-headline">{value}</div>
            {change && (
                 <p className={`text-xs mt-2 flex items-center ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {changeType === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                    {change}
                </p>
            )}
             {footer && !change && (
                <p className="text-xs text-muted-foreground mt-2">{footer}</p>
            )}
        </CardContent>
    </Card>
);

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

const InvoiceTable = () => (
    <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="font-headline text-lg">All Invoices</h3>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search invoices..." className="pl-10 w-full sm:w-64" />
                    </div>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="mr-2 h-4 w-4" /> Apply Filters
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoicesData.map(invoice => (
                            <TableRow key={invoice.id}>
                                <TableCell>
                                    <div className="font-medium">{invoice.invoiceNumber}</div>
                                    <div className="text-sm text-muted-foreground">{invoice.service}</div>
                                </TableCell>
                                <TableCell>
                                     <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={invoice.client.avatar} alt={invoice.client.name} />
                                            <AvatarFallback>{invoice.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{invoice.client.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell>{invoice.dueDate}</TableCell>
                                <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">Showing 1 to 4 of 24 results</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" /> Previous</Button>
                    <Button variant="outline" size="sm">Next <ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>
        </CardContent>
    </Card>
);

const InvoicePreview = () => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <h3 className="font-headline text-lg">Invoice Preview</h3>
                <div className="flex space-x-2">
                    <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                    <Button><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-8">
            <div className="border rounded-xl p-8">
                <div className="flex justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Heru Immigration Services</h2>
                        <p>123 Immigration Road, Suite 100</p>
                        <p>Toronto, ON M1A 2B3, Canada</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold">INVOICE</h1>
                        <p className="mt-4">Invoice #: INV-2023-0456</p>
                        <p>Date: Jun 10, 2023</p>
                        <p>Due Date: <span className="text-red-600">Jun 24, 2023</span></p>
                        <div className="mt-4">Status: <Badge variant="destructive">Overdue</Badge></div>
                    </div>
                </div>
                 <div className="mb-12">
                     <Table>
                         <TableHeader>
                             <TableRow>
                                 <TableHead>Description</TableHead>
                                 <TableHead>Hours</TableHead>
                                 <TableHead>Rate</TableHead>
                                 <TableHead>Amount</TableHead>
                             </TableRow>
                         </TableHeader>
                         <TableBody>
                             <TableRow>
                                 <TableCell>Initial Consultation</TableCell>
                                 <TableCell>2.0</TableCell>
                                 <TableCell>$250/hr</TableCell>
                                 <TableCell>$500.00</TableCell>
                             </TableRow>
                             <TableRow>
                                 <TableCell>Document Preparation & Review</TableCell>
                                 <TableCell>5.5</TableCell>
                                 <TableCell>$250/hr</TableCell>
                                 <TableCell>$1,375.00</TableCell>
                             </TableRow>
                             <TableRow>
                                 <TableCell>Application Submission</TableCell>
                                 <TableCell>3.0</TableCell>
                                 <TableCell>$250/hr</TableCell>
                                 <TableCell>$750.00</TableCell>
                             </TableRow>
                             <TableRow>
                                 <TableCell>Government Fees & Disbursements</TableCell>
                                 <TableCell>-</TableCell>
                                 <TableCell>-</TableCell>
                                 <TableCell>$625.00</TableCell>
                             </TableRow>
                         </TableBody>
                     </Table>
                 </div>
                 <div className="flex justify-end">
                     <div className="w-full md:w-1/3 space-y-2">
                         <div className="flex justify-between"><span>Subtotal:</span><span>$3,250.00</span></div>
                         <div className="flex justify-between"><span>Tax (13% HST):</span><span>$422.50</span></div>
                         <div className="flex justify-between font-bold"><span>Total:</span><span>$3,672.50</span></div>
                     </div>
                 </div>
            </div>
        </CardContent>
    </Card>
);

const PaymentsTable = () => (
    <Card>
        <CardHeader>
            <h3 className="font-headline text-lg">Payment History</h3>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Payment #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paymentsData.map(payment => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={payment.client.avatar} alt={payment.client.name} />
                                        <AvatarFallback>{payment.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{payment.client.name}</div>
                                </div>
                            </TableCell>
                            <TableCell>{payment.invoiceNumber}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-muted-foreground"/>
                                    <span>{payment.method}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium text-green-600">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(payment.status)}>{payment.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const PaymentMethods = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader><CardTitle className="font-headline text-lg">Saved Payment Methods</CardTitle></CardHeader>
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
                 <Button variant="outline" className="w-full mt-4 border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add New Payment Method
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="font-headline text-lg">Add New Card</CardTitle></CardHeader>
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
                     <Input id="name-on-card" placeholder="Sarah Johnson" />
                 </div>
                 <div className="flex items-center space-x-2">
                     <Checkbox id="primary-card" />
                     <Label htmlFor="primary-card" className="font-normal">Set as primary payment method</Label>
                 </div>
                 <Button className="w-full">Add Payment Method</Button>
            </CardContent>
        </Card>
    </div>
);


export function BillingPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Billing & Invoices</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${billingSummary.totalRevenue.toLocaleString()}`} icon={DollarSign} change="15% from last quarter" changeType="up" />
                <StatCard title="Outstanding" value={`$${billingSummary.outstanding.toLocaleString()}`} icon={AlertCircle} change={`${billingSummary.overdueInvoices} overdue invoices`} changeType="down" />
                <StatCard title="This Month" value={`$${billingSummary.thisMonth.toLocaleString()}`} icon={Calendar} footer={`$${billingSummary.collected.toLocaleString()} collected`} />
                <StatCard title="Avg. Payment" value={`$${billingSummary.avgPayment.toLocaleString()}`} icon={LineChart} change="8% from last month" changeType="up" />
            </div>

            <Tabs defaultValue="invoices" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
                    <TabsTrigger value="tax-settings">Tax Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices" className="space-y-6 mt-6">
                    <InvoiceTable />
                    <InvoicePreview />
                </TabsContent>
                <TabsContent value="payments" className="mt-6">
                    <PaymentsTable />
                </TabsContent>
                 <TabsContent value="subscriptions" className="mt-6">
                    <Card><CardContent className="p-6">Subscriptions management is under construction.</CardContent></Card>
                </TabsContent>
                <TabsContent value="payment-methods" className="mt-6">
                    <PaymentMethods />
                </TabsContent>
                <TabsContent value="tax-settings" className="mt-6">
                    <Card><CardContent className="p-6">Tax settings are under construction.</CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
