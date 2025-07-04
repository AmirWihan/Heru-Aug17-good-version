'use client';
import { Users, UserCheck, DollarSign, Bell, ShieldCheck, FileWarning, FileClock, CheckSquare, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applicationsData, invoicesData, paymentsData, reportsData, tasksData, dashboardData } from "@/lib/data";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { AdminTeamPerformance } from "../admin-team-performance";
import { useGlobalData } from "@/context/GlobalDataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const StatCard = ({ title, value, change, icon: Icon, changeType = 'up' }: { title: string, value: string, change: string, icon: React.ElementType, changeType?: 'up' | 'down' }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{change}</p>
        </CardContent>
    </Card>
);

const chartConfigClientGrowth = {
  clients: {
    label: "New Clients",
    color: "hsl(var(--chart-1))",
  },
};

const chartConfigRevenue = {
    value: { label: "Revenue" },
    'Q1': { label: "Q1", color: "hsl(var(--chart-1))" },
    'Q2': { label: "Q2", color: "hsl(var(--chart-2))" },
    'Q3': { label: "Q3", color: "hsl(var(--chart-3))" },
    'Q4': { label: "Q4", color: "hsl(var(--chart-4))" },
};

export function AdminOverviewPage() {
    const { setPage } = useAdminDashboard();
    const { teamMembers, clients } = useGlobalData();

    const totalUsers = teamMembers.length + clients.length;
    const activeFirms = new Set(teamMembers.filter(m => m.status === 'Active' && m.type === 'legal').map(m => m.firmName)).size;
    const totalRevenue = paymentsData.filter(p => p.status === 'Completed').reduce((acc, p) => acc + p.amount, 0);

    const pendingActivations = teamMembers.filter(m => m.status === 'Pending Activation').length;
    const casesForReview = applicationsData.filter(a => a.status === 'Additional Info Requested').length;
    const overdueInvoices = invoicesData.filter(i => i.status === 'Overdue').length;

    const actionItems = [
        {
            count: pendingActivations,
            title: "Pending Lawyer Activations",
            description: "accounts waiting for verification.",
            icon: ShieldCheck,
            page: "users",
        },
        {
            count: casesForReview,
            title: "Cases Requiring Attention",
            description: "cases need additional information.",
            icon: FileWarning,
            page: "cases",
        },
        {
            count: overdueInvoices,
            title: "Overdue Invoices",
            description: "invoices are past their due date.",
            icon: FileClock,
            page: "payments",
        }
    ].filter(item => item.count > 0);

    const totalActionItems = actionItems.reduce((acc, item) => acc + item.count, 0);

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground border-0">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome, Super Admin!</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Here's your platform summary and urgent tasks for today.</CardDescription>
                </CardHeader>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={totalUsers.toLocaleString()} change="All firms and clients" icon={Users} />
                <StatCard title="Active Firms" value={activeFirms.toLocaleString()} change="Verified legal firms" icon={UserCheck} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="From all completed payments" icon={DollarSign} />
                <StatCard title="Action Items" value={totalActionItems.toString()} change="Pending across platform" icon={Bell} changeType="down"/>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                    <CardDescription>Tasks that require your immediate attention.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {actionItems.length > 0 ? actionItems.map(item => (
                        <div key={item.title} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <item.icon className="h-6 w-6 text-destructive" />
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.count} {item.description}</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => setPage(item.page)}>Review</Button>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-center py-4">No urgent tasks. All clear!</p>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Growth</CardTitle>
                         <CardDescription>User signups over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigClientGrowth} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reportsData.clientGrowth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line type="monotone" dataKey="clients" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                                </LineChart>
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
                         <ChartContainer config={chartConfigRevenue} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportsData.quarterlyRevenue} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                             <CheckSquare className="h-5 w-5 text-primary" />
                             Platform-wide Tasks
                         </CardTitle>
                         <CardDescription>A summary of upcoming tasks across all teams.</CardDescription>
                     </CardHeader>
                     <CardContent>
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead>Task</TableHead>
                                     <TableHead>Client</TableHead>
                                     <TableHead>Due Date</TableHead>
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {tasksData.filter(t => t.status !== 'Completed').slice(0, 4).map(task => (
                                     <TableRow key={task.id} className="cursor-pointer" onClick={() => setPage('tasks')}>
                                         <TableCell className="font-medium">{task.title}</TableCell>
                                         <TableCell>
                                             <div className="flex items-center gap-2">
                                                 <Avatar className="h-6 w-6">
                                                     <AvatarImage src={task.client.avatar} alt={task.client.name} />
                                                     <AvatarFallback>{task.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                 </Avatar>
                                                 <span className="text-sm">{task.client.name}</span>
                                             </div>
                                         </TableCell>
                                         <TableCell>{format(new Date(task.dueDate), "PP")}</TableCell>
                                     </TableRow>
                                 ))}
                             </TableBody>
                         </Table>
                         <Button variant="outline" className="w-full mt-4" onClick={() => setPage('tasks')}>View All Tasks</Button>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <Mail className="h-5 w-5 text-primary" />
                             Recent Messages
                         </CardTitle>
                         <CardDescription>Latest messages from clients across the platform.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         {dashboardData.recentMessages.slice(0, 3).map((message) => (
                             <div key={message.id} className="flex items-start gap-4 p-2 -m-2 rounded-lg hover:bg-muted cursor-pointer" onClick={() => setPage('notifications')}>
                                 <Avatar className="h-10 w-10 border">
                                     <AvatarImage src={message.avatar} alt={message.name} />
                                     <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                 </Avatar>
                                 <div className="flex-1">
                                     <div className="flex justify-between items-center">
                                         <p className="font-semibold">{message.name}</p>
                                         <p className="text-xs text-muted-foreground">{message.time}</p>
                                     </div>
                                     <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                                 </div>
                             </div>
                         ))}
                         <Button variant="outline" className="w-full mt-4" onClick={() => setPage('notifications')}>View System Notifications</Button>
                     </CardContent>
                 </Card>
            </div>
             <AdminTeamPerformance />
        </div>
    );
}
