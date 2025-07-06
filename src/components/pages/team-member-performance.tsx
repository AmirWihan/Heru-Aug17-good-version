'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applicationsData, activityLogData, type TeamMember } from "@/lib/data";
import { ArrowLeft, CheckCircle, DollarSign, Users, LineChart, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, formatDistanceToNow } from "date-fns";

const chartConfig = {
    clients: { label: "Clients", color: "hsl(var(--chart-1))" },
};

const clientPerformanceData = [
    { month: "Jan", clients: 4 },
    { month: "Feb", clients: 3 },
    { month: "Mar", clients: 5 },
    { month: "Apr", clients: 7 },
    { month: "May", clients: 6 },
    { month: "Jun", clients: 8 },
];


export function TeamMemberPerformancePage({ teamMember }: { teamMember: TeamMember }) {
    const router = useRouter();

    const assignedApplications = applicationsData.filter(app => app.assignedTo.name === teamMember.name);
    const memberActivity = activityLogData.filter(log => log.teamMember.id === teamMember.id).slice(0, 5);

    const memberStats = {
        clients: assignedApplications.length,
        revenue: teamMember.stats.find(s => s.label === 'Revenue')?.value || '$0',
        successRate: teamMember.stats.find(s => s.label === 'Success Rate')?.value || 'N/A'
    };
    
    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Team Management
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                            <AvatarImage src={teamMember.avatar} alt={teamMember.name} />
                            <AvatarFallback>{teamMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <h2 className="text-2xl font-bold">{teamMember.name}</h2>
                                <Badge>{teamMember.role}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{teamMember.firmName}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4"/> {teamMember.email}</span>
                                {teamMember.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4"/> {teamMember.phone}</span>}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{memberStats.clients}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{memberStats.revenue}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Case Success Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{memberStats.successRate}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><LineChart className="h-5 w-5"/> Monthly Performance</CardTitle>
                        <CardDescription>New clients acquired over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={clientPerformanceData}>
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="clients" fill="var(--color-clients)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                        <CardDescription>Last 5 activities logged by {teamMember.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {memberActivity.map(activity => (
                           <div key={activity.id} className="flex items-center gap-3">
                               <div className="p-2 rounded-full bg-muted">
                                   <Users className="h-4 w-4 text-muted-foreground" />
                               </div>
                               <div>
                                   <p className="text-sm font-medium">Logged "{activity.type}" for {activity.client.name}</p>
                                   <p className="text-xs text-muted-foreground" suppressHydrationWarning>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</p>
                               </div>
                           </div>
                       ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Assigned Cases</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Case Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedApplications.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={app.client.avatar} alt={app.client.name} />
                                                <AvatarFallback>{app.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{app.client.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{app.type}</TableCell>
                                    <TableCell><Badge variant="secondary">{app.status}</Badge></TableCell>
                                    <TableCell suppressHydrationWarning>{format(new Date(app.submitted), "PP")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
