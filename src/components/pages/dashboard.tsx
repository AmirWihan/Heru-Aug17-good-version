
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, CalendarCheck, CalendarPlus, CheckSquare, DollarSign, FilePlus2, FileText, Mail, Users, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { dashboardData, tasksData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TeamPerformance } from "../sales-team-performance";


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
                 <p className={`text-xs text-muted-foreground mt-2 flex items-center ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {changeType === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {change}
                </p>
            )}
            {footer && !change && (
                <p className="text-xs text-muted-foreground mt-2">{footer}</p>
            )}
        </CardContent>
    </Card>
);

const QuickActionButton = ({ label, icon: Icon, onClick }: { label: string, icon: React.ElementType, onClick?: () => void }) => (
    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 transition hover:bg-muted" onClick={onClick}>
        <Icon className="h-6 w-6 text-primary" />
        <span className="text-sm font-medium">{label}</span>
    </Button>
);

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Pending': return 'warning' as const;
        case 'Approved': return 'success' as const;
        case 'Under Review': return 'info' as const;
        default: return 'secondary' as const;
    }
};

export function DashboardPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Clients" value="142" icon={Users} change="12% from last month" changeType="up" />
                <StatCard title="Pending Applications" value="24" icon={FileText} change="3 urgent cases" changeType="down" />
                <StatCard title="Upcoming Appointments" value="7" icon={CalendarCheck} footer="Next: Today at 2:30 PM" />
                <StatCard title="Revenue This Month" value="$24,580" icon={DollarSign} change="18% from last month" changeType="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Recent Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dashboardData.recentApplications.map(app => (
                                        <TableRow key={app.id} className="cursor-pointer" onClick={() => setPage('applications')}>
                                            <TableCell>
                                                <div className="font-medium">{app.clientName}</div>
                                                <div className="text-sm text-muted-foreground">{app.country}</div>
                                            </TableCell>
                                            <TableCell>{app.type}</TableCell>
                                            <TableCell><Badge variant={getStatusVariant(app.status)}>{app.status}</Badge></TableCell>
                                            <TableCell>{app.submitted}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon"><ArrowRight className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Upcoming Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dashboardData.upcomingAppointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={appt.avatar} />
                                                    <AvatarFallback>{appt.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {appt.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{appt.dateTime}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{appt.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => toast({ title: "Joining meeting...", description: `Connecting to meeting with ${appt.name}.` })}>
                                                Join
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Upcoming Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tasksData.filter(t => t.status !== 'Completed').slice(0, 3).map(task => (
                                <div key={task.id} className="flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted cursor-pointer transition-colors" onClick={() => setPage('tasks')}>
                                    <div className="bg-muted p-2 rounded-full mt-1">
                                      <CheckSquare className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold line-clamp-1">{task.title}</p>
                                        <p className="text-sm text-muted-foreground">Due: {format(new Date(task.dueDate), 'PP')}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <QuickActionButton label="New Client" icon={UserPlus} onClick={() => setPage('clients')} />
                            <QuickActionButton label="New Application" icon={FilePlus2} onClick={() => setPage('applications')} />
                            <QuickActionButton label="Schedule Meeting" icon={CalendarPlus} onClick={() => setPage('appointments')} />
                            <QuickActionButton label="Generate Invoice" icon={FileText} onClick={() => setPage('billing')} />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <TeamPerformance />
        </div>
    );
}
