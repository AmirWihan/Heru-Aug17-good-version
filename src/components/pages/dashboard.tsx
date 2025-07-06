'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, CalendarCheck, CalendarPlus, CheckSquare, DollarSign, FilePlus2, FileText, Mail, Users, UserPlus, ShieldAlert, AlertTriangle, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { dashboardData, reportsData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TeamPerformance } from "../sales-team-performance";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { useGlobalData } from "@/context/GlobalDataContext";
import { analyzeClientRisks, type ClientAlert } from "@/ai/flows/risk-analyzer";


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

export function DashboardPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();
    const { clients, tasks } = useGlobalData();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [riskAlerts, setRiskAlerts] = useState<ClientAlert[] | null>(null);

    const handleRunAnalysis = async () => {
        setIsAnalyzing(true);
        setRiskAlerts(null);
        try {
            const activeClients = (clients || []).filter(c => c.status === 'Active');
            const analysisInput = activeClients.map(c => ({
                id: c.id,
                name: c.name,
                status: c.status,
                activity: (c.activity || []).map(a => ({ title: a.title, timestamp: a.timestamp })),
                documents: (c.documents || []).map(d => ({ title: d.title, status: d.status, dateAdded: d.dateAdded })),
                caseSummary: {
                    dueDate: c.caseSummary.dueDate,
                }
            }));

            const response = await analyzeClientRisks({
                clients: analysisInput,
                currentDate: new Date().toISOString().split('T')[0]
            });
            setRiskAlerts(response.alerts);
            toast({
                title: "Analysis Complete",
                description: `Found ${response.alerts.length} potential risks.`,
            });
        } catch (error) {
            console.error("Risk analysis failed:", error);
            toast({
                title: "Analysis Failed",
                description: "Could not run the risk analysis at this time. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg border-0">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">Welcome back, Sarah! 👋</h2>
                        <p className="text-primary-foreground/90 mt-1">
                            You have <span className="font-bold">5 new client applications</span> and <span className="font-bold">3 upcoming appointments</span> needing your attention today.
                        </p>
                    </div>
                    <Button 
                        className="bg-primary-foreground/90 text-primary hover:bg-primary-foreground w-full md:w-auto"
                        onClick={() => setPage('applications')}>
                        View Applications <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Clients" value="142" icon={Users} change="12% from last month" changeType="up" />
                <StatCard title="Pending Applications" value="24" icon={FileText} change="3 urgent cases" changeType="down" />
                <StatCard title="Upcoming Appointments" value="7" icon={CalendarCheck} footer="Next: Today at 2:30 PM" />
                <StatCard title="Revenue This Month" value="$24,580" icon={DollarSign} change="18% from last month" changeType="up" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        AI Risk Alerts
                    </CardTitle>
                    <CardDescription>
                        AI-powered analysis to flag files needing attention.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isAnalyzing ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Analyzing client files...</p>
                        </div>
                    ) : riskAlerts ? (
                        riskAlerts.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {(riskAlerts || []).map((alert, index) => (
                                    <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                        <div className="bg-destructive/10 p-2 rounded-full mt-1">
                                            <AlertTriangle className="h-5 w-5 text-destructive" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{alert.clientName}</p>
                                            <p className="text-sm text-destructive">{alert.issueSummary}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                <span className="font-medium">Suggested Action:</span> {alert.suggestedAction}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline" className="ml-auto" onClick={() => setPage('clients')}>View</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                                <p className="font-semibold">All Clear!</p>
                                <p className="text-muted-foreground">No immediate risks found in active files.</p>
                                <Button variant="link" onClick={handleRunAnalysis}>Re-run analysis</Button>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <p className="text-muted-foreground mb-4">Click the button to scan all active client files for potential risks like missing documents, approaching deadlines, and stalled cases.</p>
                            <Button onClick={handleRunAnalysis}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Run AI Risk Analysis
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

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
                                    {(dashboardData.recentApplications || []).map(app => (
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
                                    {(dashboardData.upcomingAppointments || []).map((appt) => (
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
                            {(tasks || []).filter(t => t.status !== 'Completed').slice(0, 3).map(task => (
                                <div key={task.id} className="flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-muted cursor-pointer transition-colors" onClick={() => setPage('tasks')}>
                                    <div className="bg-muted p-2 rounded-full mt-1">
                                      <CheckSquare className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold line-clamp-1">{task.title}</p>
                                        <p className="text-sm text-muted-foreground" suppressHydrationWarning>{format(new Date(task.dueDate), 'PP')}</p>
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
                                    {(reportsData.revenueByCaseType || []).map((entry) => (
                                        <Cell key={entry.name} fill={chartConfigRevenue[entry.name as keyof typeof chartConfigRevenue]?.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <TeamPerformance />
        </div>
    );
}
