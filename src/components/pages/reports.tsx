
'use client';
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { reportsData, activityLogData, teamMembers } from "@/lib/data";
import { TrendingUp, Users, CheckCircle, Clock, Phone, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const chartConfigClientGrowth = {
  clients: {
    label: "New Clients",
    color: "hsl(var(--chart-1))",
  },
};

const chartConfigRevenue = {
    value: {
        label: "Revenue",
    },
    'PR': { label: "PR", color: "hsl(var(--chart-1))" },
    'Work Permit': { label: "Work Permit", color: "hsl(var(--chart-2))" },
    'Student Visa': { label: "Student Visa", color: "hsl(var(--chart-3))" },
    'Sponsorship': { label: "Sponsorship", color: "hsl(var(--chart-4))" },
    'Other': { label: "Other", color: "hsl(var(--chart-5))" },
};

const chartConfigStatus = {
    applications: { label: 'Applications' },
    approved: { label: 'Approved' },
    pending: { label: 'Pending' },
    rejected: { label: 'Rejected' },
    'in-review': { label: 'In Review' },
};

const TeamActivityReport = () => {
    const activitySummary = useMemo(() => teamMembers.map(member => {
        const memberActivities = activityLogData.filter(log => log.teamMember.id === member.id);
        return {
            member,
            calls: memberActivities.filter(a => a.type === 'Call').length,
            emails: memberActivities.filter(a => a.type === 'Email').length,
            meetings: memberActivities.filter(a => a.type === 'Meeting').length,
            total: memberActivities.length,
        };
    }), []);

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Team Activity Breakdown</CardTitle>
                <CardDescription>Summary of client interactions per team member.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Team Member</TableHead>
                            <TableHead className="text-center">Calls</TableHead>
                            <TableHead className="text-center">Emails</TableHead>
                            <TableHead className="text-center">Meetings</TableHead>
                            <TableHead className="text-center">Total Activities</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activitySummary.map(({ member, calls, emails, meetings, total }) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-muted-foreground">{member.role}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">{calls}</TableCell>
                                <TableCell className="text-center font-medium">{emails}</TableCell>
                                <TableCell className="text-center font-medium">{meetings}</TableCell>
                                <TableCell className="text-center font-bold">{total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


export function ReportsPage() {
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Reports & Analytics</h1>
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">158</div>
                        <p className="text-xs text-muted-foreground">+12 since last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">+1.5% from last quarter</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Case Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45 Days</div>
                        <p className="text-xs text-muted-foreground">-3 days from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">38</div>
                        <p className="text-xs text-muted-foreground">+5 since last week</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamActivityReport />
                <Card>
                    <CardHeader>
                        <CardTitle>Client Growth (Last 6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigClientGrowth} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reportsData.clientGrowth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line type="monotone" dataKey="clients" stroke="var(--color-clients)" strokeWidth={2} dot={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Case Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigRevenue} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportsData.revenueByCaseType} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80}/>
                                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" layout="vertical" radius={5}>
                                        {reportsData.revenueByCaseType.map((entry) => (
                                            <Cell key={entry.name} fill={chartConfigRevenue[entry.name as keyof typeof chartConfigRevenue]?.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Application Status Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ChartContainer config={chartConfigStatus} className="h-[250px] w-full max-w-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                                    <Pie data={reportsData.applicationStatus} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                        {reportsData.applicationStatus.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
