'use client';
import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp, CalendarCheck, CalendarPlus, DollarSign, Edit, Eye, FilePlus2, FileText, Users, X, Grid, Lock, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { dashboardData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

const ResponsiveGridLayout = WidthProvider(Responsive);

const StatCard = ({ title, value, icon: Icon, change, changeType, footer }: { title: string, value: string, icon: React.ElementType, change?: string, changeType?: 'up' | 'down', footer?: string }) => (
    <Card className="dashboard-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
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

const QuickActionButton = ({ label, icon: Icon, onClick }: { label: string, icon: React.ElementType, onClick?: () => void }) => (
    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 transition hover:bg-muted" onClick={onClick}>
        <Icon className="h-6 w-6 text-primary" />
        <span className="text-sm font-medium">{label}</span>
    </Button>
);

const WelcomeWidget = ({ setPage }: { setPage: (page: string) => void }) => (
    <div className="relative rounded-xl shadow-lg overflow-hidden bg-primary text-primary-foreground p-8 h-full flex items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">Welcome back, Sarah! 👋</h2>
                <p className="text-lg text-primary-foreground/80">
                    You have <span className="font-semibold text-white">5 new client applications</span> and 
                    <span className="font-semibold text-white"> 3 upcoming appointments</span>.
                </p>
            </div>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold transition-transform hover:-translate-y-0.5 active:scale-95" onClick={() => setPage('applications')}>
                View Applications
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
);

const StatsWidget = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        <StatCard title="Total Clients" value="142" icon={Users} change="12% from last month" changeType="up" />
        <StatCard title="Pending Applications" value="24" icon={FileText} change="3 urgent cases" changeType="down" />
        <StatCard title="Upcoming Appointments" value="7" icon={CalendarCheck} footer="Next: Today at 2:30 PM" />
        <StatCard title="Revenue This Month" value="$24,580" icon={DollarSign} change="18% from last month" changeType="up" />
    </div>
);

const QuickActionsWidget = ({ setPage }: { setPage: (page: string) => void }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="font-headline text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton label="New Client" icon={UserPlus} onClick={() => setPage('clients')} />
            <QuickActionButton label="New Application" icon={FilePlus2} onClick={() => setPage('applications')} />
            <QuickActionButton label="Schedule Meeting" icon={CalendarPlus} onClick={() => setPage('appointments')} />
            <QuickActionButton label="Generate Invoice" icon={FileText} onClick={() => setPage('billing')} />
        </CardContent>
    </Card>
);

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Pending': return 'warning' as const;
        case 'Approved': return 'success' as const;
        case 'Under Review': return 'info' as const;
        default: return 'secondary' as const;
    }
};

const RecentAppsWidget = ({ setPage }: { setPage: (page: string) => void }) => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="font-headline text-lg">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
            <ScrollArea className="h-full">
                <div className="p-6">
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
                                            <Button variant="ghost" size="icon" onClick={() => setPage('applications')}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setPage('applications')}><Edit className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
);

const RecentMessagesWidget = ({ setPage }: { setPage: (page: string) => void }) => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="font-headline text-lg">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 flex-grow p-0">
            <ScrollArea className="h-full">
                <div className="p-6">
                    {dashboardData.recentMessages.map(msg => (
                        <div key={msg.id} className="flex items-start gap-3 p-3 -m-2 rounded-lg hover:bg-muted cursor-pointer transition-colors" onClick={() => setPage('messages')}>
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
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
);

const UpcomingAppointmentsWidget = ({ toast }: { toast: any }) => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="font-headline text-lg">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
            <ScrollArea className="h-full">
                <div className="p-6">
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
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
);


const WIDGETS = {
  welcome: { id: 'welcome', title: 'Welcome Banner', Component: WelcomeWidget },
  stats: { id: 'stats', title: 'Statistics', Component: StatsWidget },
  quickActions: { id: 'quickActions', title: 'Quick Actions', Component: QuickActionsWidget },
  recentApps: { id: 'recentApps', title: 'Recent Applications', Component: RecentAppsWidget },
  recentMessages: { id: 'recentMessages', title: 'Recent Messages', Component: RecentMessagesWidget },
  upcomingAppointments: { id: 'upcomingAppointments', title: 'Upcoming Appointments', Component: UpcomingAppointmentsWidget },
};

const initialLayouts = {
  lg: [
    { i: 'welcome', x: 0, y: 0, w: 12, h: 2, static: true },
    { i: 'stats', x: 0, y: 2, w: 12, h: 2 },
    { i: 'quickActions', x: 0, y: 4, w: 12, h: 2.5 },
    { i: 'recentApps', x: 0, y: 6, w: 8, h: 6 },
    { i: 'recentMessages', x: 8, y: 6, w: 4, h: 6 },
    { i: 'upcomingAppointments', x: 0, y: 12, w: 12, h: 5 },
  ],
};


export function DashboardPage({ setPage }: { setPage: (page: string) => void }) {
    const { toast } = useToast();
    const [isEditMode, setIsEditMode] = useState(false);
    const [layouts, setLayouts] = useState(initialLayouts);
    const [activeWidgets, setActiveWidgets] = useState(Object.keys(WIDGETS));

    useEffect(() => {
        try {
            const savedLayouts = localStorage.getItem('dashboard-layouts');
            const savedWidgets = localStorage.getItem('dashboard-widgets');
            if (savedLayouts) setLayouts(JSON.parse(savedLayouts));
            if (savedWidgets) setActiveWidgets(JSON.parse(savedWidgets));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const onLayoutChange = (layout: any, newLayouts: any) => {
        if (isEditMode) {
            localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts));
            setLayouts(newLayouts);
        }
    };

    const onRemoveWidget = (widgetId: string) => {
        const newWidgets = activeWidgets.filter(w => w !== widgetId);
        setActiveWidgets(newWidgets);
        localStorage.setItem('dashboard-widgets', JSON.stringify(newWidgets));
    };
  
    const onAddWidget = (widgetId: string) => {
        if (!activeWidgets.includes(widgetId)) {
            const newWidgets = [...activeWidgets, widgetId];
            setActiveWidgets(newWidgets);
            localStorage.setItem('dashboard-widgets', JSON.stringify(newWidgets));
        }
    };

    const availableWidgets = Object.values(WIDGETS).filter(w => !activeWidgets.includes(w.id));

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={!isEditMode}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Widget
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {availableWidgets.length > 0 ? (
                            availableWidgets.map(widget => (
                                <DropdownMenuItem key={widget.id} onClick={() => onAddWidget(widget.id)}>
                                    {widget.title}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No more widgets to add</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => setIsEditMode(!isEditMode)} variant={isEditMode ? "default" : "outline"}>
                    {isEditMode ? <Lock className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
                    {isEditMode ? 'Lock Layout' : 'Edit Layout'}
                </Button>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                onLayoutChange={onLayoutChange}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={50}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".dashboard-card, .relative.rounded-xl"
            >
                {activeWidgets.map((widgetId) => {
                    const widget = WIDGETS[widgetId as keyof typeof WIDGETS];
                    if (!widget) return null;
                    const { Component } = widget;
                  
                    return (
                        <div key={widget.id} className="relative group/widget">
                            <Component setPage={setPage} toast={toast} />
                            {isEditMode && widget.id !== 'welcome' && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/widget:opacity-100 transition-opacity z-10"
                                    onClick={() => onRemoveWidget(widget.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
        </div>
    )
}
