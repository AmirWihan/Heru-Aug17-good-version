'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, AlertCircle, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickBooksIcon } from "../icons/QuickBooksIcon";

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="bg-muted p-2 rounded-full">
                <Icon className="h-4 w-4 text-primary" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold font-headline">{value}</div>
        </CardContent>
    </Card>
);

const invoices = [
    { invoiceNumber: 'INV-2023-0456', client: 'James Wilson', amount: '$3,250', status: 'Overdue' },
    { invoiceNumber: 'INV-2023-0452', client: 'Adebola Okonjo', amount: '$4,500', status: 'Paid' },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return 'success' as const;
        case 'overdue': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

export function BillingScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden">
             <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <CardHeader className="p-0 mb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle>Billing & Invoices</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <QuickBooksIcon className="h-5 w-5" />
                            <span>Synced with QuickBooks</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Total Revenue" value="$64,820" icon={DollarSign} />
                        <StatCard title="Outstanding" value="$12,450" icon={AlertCircle} />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.invoiceNumber}>
                                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.client}</TableCell>
                                    <TableCell><Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </div>
        </Card>
    );
}
