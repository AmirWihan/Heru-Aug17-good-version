'use client';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { reportsData, activityLogData, teamMembers, clients } from "@/lib/data";
import { TrendingUp, Users, CheckCircle, Clock, DollarSign, UserCheck, UserX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from '../ui/input';

const StatCard = ({ title, value, change, icon: Icon, changeType = 'up' }: { title: string, value: string, change: string, icon: React.ElementType, changeType?: 'up' | 'down' }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className={`text-xs text-muted-foreground ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
        </CardContent>
    </Card>
);

const UserManagementTab = () => (
    <Card>
        <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, manage, approve, or block user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="clients">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="lawyers">Lawyers / Team</TabsTrigger>
                </TabsList>
                <TabsContent value="clients" className="mt-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Case Type</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.slice(0, 5).map(client => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="font-medium">{client.name}</div>
                                            <div className="text-sm text-muted-foreground">{client.email}</div>
                                        </TableCell>
                                        <TableCell>{client.caseType}</TableCell>
                                        <TableCell>{client.joined}</TableCell>
                                        <TableCell><Badge variant={client.status === 'Active' ? 'success' : 'secondary'}>{client.status}</Badge></TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm">View Profile</Button>
                                            <Button variant="destructive" size="sm">Block</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="lawyers" className="mt-4">
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Team Member</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembers.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="font-medium">{member.name}</div>
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm">View Profile</Button>
                                            <Button variant="destructive" size="sm">Deactivate</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
);

const PlatformSettingsTab = () => (
    <Card>
        <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Manage global settings for the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="pricing">Subscription Price ($/month)</Label>
                <Input id="pricing" type="number" defaultValue="99" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email-template">Welcome Email Template</Label>
                <Textarea id="email-template" rows={5} defaultValue="Welcome to Heru, {{name}}! We're excited to have you." />
            </div>
             <Button>Save Settings</Button>
        </CardContent>
    </Card>
);


export function AdminDashboard() {
    const [activePage, setActivePage] = useState('overview');

    return (
        <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value="1,254" change="+120 this month" icon={Users} />
                <StatCard title="Active Clients" value="158" change="+12 this month" icon={UserCheck} />
                <StatCard title="Total Revenue" value="$245,670" change="+15% vs last quarter" icon={DollarSign} />
                <StatCard title="Blocked Accounts" value="12" change="+2 this week" icon={UserX} changeType="down" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                     <UserManagementTab />
                </div>
                 <div className="lg:col-span-2">
                    <PlatformSettingsTab />
                 </div>
            </div>
        </div>
    );
}
