'use client';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { reportsData, clients } from "@/lib/data";
import { Users, FileCheck, Banknote, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const chartConfigUserGrowth = {
  lawyers: { label: "Lawyers", color: "hsl(var(--chart-1))" },
  clients: { label: "Clients", color: "hsl(var(--chart-2))" },
};

const chartConfigRevenue = {
    value: { label: "Revenue" },
    'Q1': { label: "Q1", color: "hsl(var(--chart-1))" },
    'Q2': { label: "Q2", color: "hsl(var(--chart-2))" },
    'Q3': { label: "Q3", color: "hsl(var(--chart-3))" },
    'Q4': { label: "Q4", color: "hsl(var(--chart-4))" },
};

const chartConfigCaseStatus = {
    applications: { label: 'Applications' },
    approved: { label: 'Approved' },
    pending: { label: 'Pending' },
    rejected: { label: 'Rejected' },
    'in-review': { label: 'In Review' },
};

export function AdminPlatformAnalyticsPage() {
    const geoDistribution = clients.reduce((acc, client) => {
        acc[client.countryOfOrigin] = (acc[client.countryOfOrigin] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,284</div>
                        <p className="text-xs text-muted-foreground">+95 since last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$312,890</div>
                        <p className="text-xs text-muted-foreground">+22% vs last quarter</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Case Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">52 Days</div>
                        <p className="text-xs text-muted-foreground">-5 days vs last quarter</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,254</div>
                        <p className="text-xs text-muted-foreground">+120 this month</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>New user signups over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigUserGrowth} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reportsData.userGrowth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line type="monotone" dataKey="lawyers" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={true} />
                                    <Line type="monotone" dataKey="clients" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Case Status Overview</CardTitle>
                        <CardDescription>Breakdown of all application statuses.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                         <ChartContainer config={chartConfigCaseStatus} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                                    <Pie data={reportsData.applicationStatus} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {reportsData.applicationStatus.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Quarterly Revenue</CardTitle>
                        <CardDescription>Total revenue generated per quarter.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigRevenue} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportsData.quarterlyRevenue}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="revenue" radius={8}>
                                        {reportsData.quarterlyRevenue.map((entry) => (
                                            <Cell key={entry.quarter} fill={chartConfigRevenue[entry.quarter as keyof typeof chartConfigRevenue]?.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Client Geographic Distribution</CardTitle>
                        <CardDescription>Top countries of origin for clients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Country</TableHead>
                                    <TableHead className="text-right">Number of Clients</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(geoDistribution).sort(([,a],[,b]) => b-a).slice(0, 5).map(([country, count]) => (
                                    <TableRow key={country}>
                                        <TableCell className="font-medium">{country}</TableCell>
                                        <TableCell className="text-right">{count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
