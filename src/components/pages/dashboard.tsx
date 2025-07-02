'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, CalendarCheck, CalendarPlus, DollarSign, Edit, Eye, FilePlus2, FileText, LayoutDashboard, Mail, MoreHorizontal, Percent, Phone, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { dashboardData } from "@/lib/data";

const StatCard = ({ title, value, icon: Icon, change, changeType, footer }: { title: string, value: string, icon: React.ElementType, change?: string, changeType?: 'up' | 'down', footer?: string }) => (
    <Card className="dashboard-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="bg-muted p-2 rounded-full">
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

const QuickActionButton = ({ label, icon: Icon }: { label: string, icon: React.ElementType }) => (
    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 transition hover:bg-muted">
        <Icon className="h-6 w-6 text-primary" />
        <span className="text-sm font-medium">{label}</span>
    </Button>
);

export function DashboardPage() {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Approved': return 'success';
            case 'Under Review': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative rounded-xl shadow-lg overflow-hidden bg-primary text-primary-foreground p-8">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">Welcome back, Sarah! 👋</h2>
                        <p className="text-lg text-primary-foreground/80">
                            You have <span className="font-semibold text-white">5 new client applications</span> and 
                            <span className="font-semibold text-white"> 3 upcoming appointments</span>.
                        </p>
                    </div>
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold transition-transform hover:-translate-y-0.5 active:scale-95">
                        View Applications
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Clients" value="142" icon={Users} change="12% from last month" changeType="up" />
                <StatCard title="Pending Applications" value="24" icon={FileText} change="3 urgent cases" changeType="down" />
                <StatCard title="Upcoming Appointments" value="7" icon={CalendarCheck} footer="Next: Today at 2:30 PM" />
                <StatCard title="Revenue This Month" value="$24,580" icon={DollarSign} change="18% from last month" changeType="up" />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton label="New Client" icon={UserPlus} />
                    <QuickActionButton label="New Application" icon={FilePlus2} />
                    <QuickActionButton label="Schedule Meeting" icon={CalendarPlus} />
                    <QuickActionButton label="Generate Invoice" icon={FileText} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
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
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="font-medium">{app.clientName}</div>
                                            <div className="text-sm text-muted-foreground">{app.country}</div>
                                        </TableCell>
                                        <TableCell>{app.type}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(app.status)}>{app.status}</Badge></TableCell>
                                        <TableCell>{app.submitted}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {dashboardData.recentMessages.map(msg => (
                            <div key={msg.id} className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarImage src={msg.avatar} />
                                    <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold">{msg.name}</p>
                                        <p className="text-xs text-muted-foreground">{msg.time}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
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
                                    <Button variant="outline" size="sm">
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
    )
}
