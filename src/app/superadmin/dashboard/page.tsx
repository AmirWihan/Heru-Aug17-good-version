'use client';

import { useGlobalData } from '@/context/GlobalDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Zap, 
  Globe, 
  Shield, 
  BarChart3, 
  LineChart, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  UserX,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  UserPlus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// Backup controls moved to Settings > Data

export default function SuperadminDashboard() {
  const { teamMembers, clients, notifications, leads, getWorkspaceBackup, saveDailyBackup, isAutoBackupEnabled, setAutoBackupEnabled, getCurrentWorkspaceKey } = useGlobalData();
  const router = useRouter();

  // Calculate platform metrics
  const totalLawyers = teamMembers.filter(m => m.type === 'legal').length;
  const totalClients = clients.length;
  const activeFirms = new Set(teamMembers.map(m => m.firmName)).size;
  const pendingLawyers = teamMembers.filter(m => m.status === 'Pending Activation').length;
  const totalRevenue = 0; // Placeholder - implement subscription data later
  const activeSubscriptions = 0; // Placeholder - implement subscription data later
  
  // Recent activity
  const recentNotifications = notifications.slice(0, 5);
  const recentLeads = leads.slice(0, 3);

  // Chart data
  const monthlyData = [
    { month: 'Jan', lawyers: 12, clients: 45, revenue: 12500 },
    { month: 'Feb', lawyers: 15, clients: 52, revenue: 14200 },
    { month: 'Mar', lawyers: 18, clients: 58, revenue: 15800 },
    { month: 'Apr', lawyers: 22, clients: 65, revenue: 17200 },
    { month: 'May', lawyers: 25, clients: 72, revenue: 18900 },
    { month: 'Jun', lawyers: 28, clients: 78, revenue: 20500 },
  ];

  const StatCard = ({ title, value, icon: Icon, change, changeType, description, onClick }: {
    title: string;
    value: string;
    icon: React.ElementType;
    change?: string;
    changeType?: 'up' | 'down';
    description?: string;
    onClick?: () => void;
  }) => (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground">
            {changeType === 'up' ? (
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
            )}
            {change} from last month
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const QuickActionButton = ({ title, description, icon: Icon, onClick, variant = 'default' }: {
    title: string;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'secondary';
  }) => (
    <Button
      variant={variant}
      className="h-auto p-4 flex flex-col items-start gap-2 text-left"
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-80">{description}</div>
      </div>
    </Button>
  );

  // Backup handlers removed (now managed in Settings)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Platform Overview 👋
              </h1>
              <p className="text-gray-600">
                Manage the VisaFor immigration platform, monitor performance, and support legal professionals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Platform Healthy
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Controls moved to Settings > Data */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Lawyers"
          value={totalLawyers.toString()}
          icon={Users}
          change="+12%"
          changeType="up"
          description="Legal professionals on platform"
          onClick={() => router.push('/superadmin/lawyers')}
        />
        <StatCard
          title="Total Clients"
          value={totalClients.toString()}
          icon={Building2}
          change="+8%"
          changeType="up"
          description="Immigration applicants"
          onClick={() => router.push('/superadmin/clients')}
        />
        <StatCard
          title="Active Firms"
          value={activeFirms.toString()}
          icon={Globe}
          change="+5%"
          changeType="up"
          description="Legal practices registered"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+15%"
          changeType="up"
          description="Platform subscription revenue"
          onClick={() => router.push('/superadmin/payments')}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common platform management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              title="Review Lawyers"
              description={`${pendingLawyers} pending approvals`}
              icon={UserCheck}
              onClick={() => router.push('/superadmin/lawyers')}
              variant={pendingLawyers > 0 ? 'destructive' : 'default'}
            />
            <QuickActionButton
              title="Platform Analytics"
              description="View detailed insights"
              icon={BarChart3}
              onClick={() => router.push('/superadmin/ai')}
            />
            <QuickActionButton
              title="Support Tickets"
              description="Manage user requests"
              icon={MessageSquare}
              onClick={() => router.push('/superadmin/support')}
            />
            <QuickActionButton
              title="System Settings"
              description="Configure platform"
              icon={Settings}
              onClick={() => router.push('/superadmin/settings')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-medium">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Subscription Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Subscriptions</span>
                    <span className="text-sm font-medium">{activeSubscriptions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="text-sm font-medium">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Plan</span>
                    <span className="text-sm font-medium">Pro Team</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Churn Rate</span>
                    <span className="text-sm font-medium text-green-600">2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Lawyer Growth</span>
                      <span className="text-sm font-medium">+12%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Client Growth</span>
                      <span className="text-sm font-medium">+8%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Tools Usage</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Processing</span>
                    <span className="text-sm font-medium">1,234 files</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Calls</span>
                    <span className="text-sm font-medium">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm font-medium">2.1GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        {notification.title.includes('Error') ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Recent Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">{lead.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        </div>
                      </div>
                      <Badge variant={lead.status === 'New' ? 'default' : 'secondary'}>
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
