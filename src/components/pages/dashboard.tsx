
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, CalendarCheck, CalendarPlus, CheckSquare, DollarSign, FilePlus2, FileText, Mail, Users, UserPlus, ShieldAlert, AlertTriangle, Sparkles, Loader2, CheckCircle, MoreHorizontal, Newspaper, TrendingUp, Clock, Target, Zap, Brain, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { irccNewsData, reportsData, type Task, dashboardData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TeamPerformance } from "../sales-team-performance";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { useGlobalData } from "@/context/GlobalDataContext";
import { analyzeClientRisks, type RiskAnalysisOutput, type ClientAlert, type RiskAnalysisInput } from "@/ai/flows/risk-analyzer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatCard = ({ title, value, icon: Icon, change, changeType, footer, onClick, trend }: { 
    title: string, 
    value: string, 
    icon: React.ElementType, 
    change?: string, 
    changeType?: 'up' | 'down', 
    footer?: string, 
    onClick?: () => void,
    trend?: number 
}) => (
    <Card
        className={cn("dashboard-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm", onClick && "cursor-pointer")}
        onClick={onClick}
    >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={cn(
                "p-3 rounded-full",
                trend && trend > 0 ? "bg-green-100" : trend && trend < 0 ? "bg-red-100" : "bg-blue-100"
            )}>
                <Icon className={cn(
                    "h-5 w-5",
                    trend && trend > 0 ? "text-green-600" : trend && trend < 0 ? "text-red-600" : "text-blue-600"
                )} />
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
            {trend !== undefined && (
                <div className="mt-2">
                    <Progress value={Math.abs(trend)} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                        {trend > 0 ? `${trend}% increase` : `${Math.abs(trend)}% decrease`} this month
                    </p>
                </div>
            )}
        </CardContent>
    </Card>
);

const QuickActionButton = ({ label, icon: Icon, onClick, description }: { 
    label: string, 
    icon: React.ElementType, 
    onClick?: () => void,
    description?: string 
}) => (
    <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-28 gap-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-md" 
        onClick={onClick}
    >
        <div className="bg-blue-100 p-2 rounded-full">
            <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-center">
            <span className="text-sm font-medium block">{label}</span>
            {description && (
                <span className="text-xs text-muted-foreground block mt-1">{description}</span>
            )}
        </div>
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
        color: "hsl(var(--chart-0))",
    },
    'PR': { label: "PR", color: "hsl(var(--chart-1))" },
    'Work Permit': { label: "Work Permit", color: "hsl(var(--chart-2))" },
    'Student Visa': { label: "Student Visa", color: "hsl(var(--chart-3))" },
    'Sponsorship': { label: "Sponsorship", color: "hsl(var(--chart-4))" },
    'Other': { label: "Other", color: "hsl(var(--chart-5))" },
};

// Sample data for enhanced charts
const monthlyData = [
    { month: 'Jan', clients: 12, revenue: 24000, applications: 8 },
    { month: 'Feb', clients: 18, revenue: 32000, applications: 12 },
    { month: 'Mar', clients: 25, revenue: 41000, applications: 15 },
    { month: 'Apr', clients: 22, revenue: 38000, applications: 14 },
    { month: 'May', clients: 30, revenue: 52000, applications: 20 },
    { month: 'Jun', clients: 35, revenue: 61000, applications: 25 },
];

const applicationTypes = [
    { name: 'Express Entry', value: 35, color: '#3B82F6' },
    { name: 'Work Permit', value: 25, color: '#10B981' },
    { name: 'Student Visa', value: 20, color: '#F59E0B' },
    { name: 'Family Sponsorship', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' },
];

export function DashboardPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();
    const { clients, tasks, userProfile, teamMembers, addTask } = useGlobalData();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [riskAlerts, setRiskAlerts] = useState<ClientAlert[] | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<ClientAlert | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [assignedTo, setAssignedTo] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    // Status gating for lawyer dashboard
    if (userProfile?.status === 'awaiting_approval') {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <Card className="max-w-lg w-full text-center border-0 shadow-lg">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                        <CardTitle className="text-xl">Awaiting Admin Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Your account is currently under review by the admin team. You will be notified once your account is approved.
                        </p>
                        <div className="mt-4">
                            <Progress value={65} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">Review in progress...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleRunAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const analysisInput: RiskAnalysisInput = {
                clients: clients.map(client => ({
                    id: client.id,
                    name: client.name,
                    status: client.status,
                    activity: client.activity.map(a => ({ title: a.title, timestamp: a.timestamp })),
                    documents: client.documents.map(d => ({ title: d.title, status: d.status, dateAdded: d.dateAdded })),
                    caseSummary: {
                        dueDate: client.caseSummary.dueDate,
                    }
                })),
                currentDate: new Date().toISOString().split('T')[0]
            };

            const result = await analyzeClientRisks(analysisInput);
            setRiskAlerts(result.alerts);
            toast({
                title: "AI Analysis Complete",
                description: `Found ${result.alerts.length} potential risk alerts.`,
            });
        } catch (error) {
            toast({
                title: "Analysis Failed",
                description: "Unable to complete risk analysis. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const openAssignTaskDialog = (alert: ClientAlert) => {
        setSelectedAlert(alert);
        setIsAssignDialogOpen(true);
    };

    const handleAssignTask = () => {
        if (!selectedAlert || !assignedTo || !taskDescription) return;

        const newTask: Task = {
            id: Date.now(),
            title: `Address Risk Alert: ${selectedAlert.issueSummary}`,
            description: taskDescription,
            client: {
                id: selectedAlert.clientId,
                name: selectedAlert.clientName,
                avatar: clients.find(c => c.id === selectedAlert.clientId)?.avatar || '',
            },
            assignedTo: {
                name: teamMembers.find(t => t.id === parseInt(assignedTo))?.name || 'Unknown',
                avatar: teamMembers.find(t => t.id === parseInt(assignedTo))?.avatar || '',
            },
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'High',
            status: 'To Do',
        };

        addTask(newTask);
        toast({
            title: "Task Assigned",
            description: "Risk alert has been converted to a task.",
        });
        setIsAssignDialogOpen(false);
        setSelectedAlert(null);
        setAssignedTo('');
        setTaskDescription('');
    };

    const activeClients = clients.filter(c => c.status === 'Active').length;
    const pendingApplications = clients.filter(c => c.caseSummary.currentStatus === 'Pending Review').length;
    const upcomingAppointments = 5; // This would come from appointments data
    const monthlyRevenue = 61000;

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Section */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-violet-50 mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-headline text-gray-900">Welcome back, {userProfile?.name}!</h1>
                            <p className="text-gray-600 mt-2">Here's what's happening with your practice today.</p>
                        </div>
                        <Button 
                            onClick={handleRunAnalysis} 
                            disabled={isAnalyzing}
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Brain className="mr-2 h-4 w-4" />
                                    Run AI Analysis
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Clients"
                    value={activeClients.toString()}
                    icon={Users}
                    change="+12%"
                    changeType="up"
                    trend={12}
                    onClick={() => setPage('clients')}
                />
                <StatCard
                    title="Pending Applications"
                    value={pendingApplications.toString()}
                    icon={FileText}
                    change="+5%"
                    changeType="up"
                    trend={5}
                    onClick={() => setPage('applications')}
                />
                <StatCard
                    title="Upcoming Appointments"
                    value={upcomingAppointments.toString()}
                    icon={CalendarCheck}
                    change="+2"
                    changeType="up"
                    trend={8}
                    onClick={() => setPage('appointments')}
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`$${monthlyRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    change="+18%"
                    changeType="up"
                    trend={18}
                    onClick={() => setPage('billing')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickActionButton
                                label="Add Client"
                                icon={UserPlus}
                                description="New client"
                                onClick={() => setPage('clients')}
                            />
                            <QuickActionButton
                                label="New Task"
                                icon={CheckSquare}
                                description="Create task"
                                onClick={() => setPage('tasks')}
                            />
                            <QuickActionButton
                                label="Schedule Meeting"
                                icon={CalendarPlus}
                                description="Book appointment"
                                onClick={() => setPage('appointments')}
                            />
                            <QuickActionButton
                                label="AI Tools"
                                icon={Sparkles}
                                description="Use AI features"
                                onClick={() => setPage('ai-tools')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {clients.slice(0, 5).map((client) => (
                                <div key={client.id} className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={client.avatar} />
                                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{client.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {client.caseSummary.currentStatus} • {client.caseType}
                                        </p>
                                    </div>
                                    <Badge variant={getStatusVariant(client.caseSummary.currentStatus)}>
                                        {client.caseSummary.currentStatus}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Risk Alerts */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                            AI Risk Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {riskAlerts && riskAlerts.length > 0 ? (
                            <div className="space-y-3">
                                {riskAlerts.slice(0, 3).map((alert, index) => (
                                    <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-red-800">{alert.issueSummary}</p>
                                                <p className="text-xs text-red-600 mt-1">{alert.clientName}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openAssignTaskDialog(alert)}
                                                className="text-xs h-7"
                                            >
                                                Assign
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">No risk alerts detected</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="revenue" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="types">Case Types</TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue" className="space-y-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Monthly Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Application Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="applications" fill="#10B981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="types" className="space-y-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle>Case Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={applicationTypes}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {applicationTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Assign Task Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Task for Risk Alert</DialogTitle>
                        <DialogDescription>
                            Convert this risk alert into a task for your team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Assign To</Label>
                            <Select value={assignedTo} onValueChange={setAssignedTo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teamMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.id.toString()}>
                                            {member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Task Description</Label>
                            <Textarea
                                placeholder="Describe the task to be completed..."
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssignTask} disabled={!assignedTo || !taskDescription}>
                            Assign Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
