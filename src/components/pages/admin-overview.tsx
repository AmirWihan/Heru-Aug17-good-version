'use client';
import { Users, UserCheck, UserX, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { teamMembers, reportsData } from "@/lib/data";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const StatCard = ({ title, value, change, icon: Icon, changeType = 'up' }: { title: string, value: string, change: string, icon: React.ElementType, changeType?: 'up' | 'down' }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className={`text-xs ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
        </CardContent>
    </Card>
);

const chartConfigClientGrowth = {
  clients: {
    label: "New Clients",
    color: "hsl(var(--chart-1))",
  },
};

export function AdminOverviewPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value="1,254" change="+120 this month" icon={Users} />
                <StatCard title="Active Firms" value="84" change="+5 this month" icon={UserCheck} />
                <StatCard title="Total Revenue" value="$245,670" change="+15% vs last quarter" icon={DollarSign} />
                <StatCard title="New Signups (24h)" value="12" change="+200% vs yesterday" icon={UserX} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Signups</CardTitle>
                        <CardDescription>Recently registered lawyers and firms.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembers.slice(0, 5).map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>2 days ago</TableCell>
                                        <TableCell><Badge variant="success">Active</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
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
            </div>
        </div>
    );
}
