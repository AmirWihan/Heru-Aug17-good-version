'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Settings, 
  BarChart3, 
  Zap,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  UserPlus,
  FolderOpen,
  Bell,
  Target
} from 'lucide-react';

export default function LawyerDemoDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const mockData = {
    totalClients: 47,
    activeCases: 23,
    pendingDocuments: 8,
    revenueThisMonth: 12500,
    newLeads: 5,
    upcomingAppointments: 3
  };

  return (
    <div className="p-6 space-y-6">
      {/* Demo Mode Alert */}
      <Alert className="border-green-200 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Demo Mode Active:</strong> You're viewing the lawyer dashboard with full access to all features. 
          No payment required - all functionality is available for testing.
        </AlertDescription>
      </Alert>

      {/* Welcome Banner */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-violet-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, Demo Lawyer! 👋
              </h1>
              <p className="text-gray-600 mb-4">
                Here's your practice overview and latest updates.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-800 border">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Practice
                </Badge>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {mockData.totalClients} Clients
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-600">${mockData.revenueThisMonth.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.totalClients}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.activeCases}</div>
                <p className="text-xs text-muted-foreground">+3 new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.pendingDocuments}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.newLeads}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New client registration</p>
                    <p className="text-xs text-gray-600">Sarah Johnson - Express Entry</p>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Document uploaded</p>
                    <p className="text-xs text-gray-600">Work permit application</p>
                  </div>
                  <span className="text-xs text-gray-500">4h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-gray-600">$2,500 - Consultation fee</p>
                  </div>
                  <span className="text-xs text-gray-500">1d ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Client Consultation</p>
                    <p className="text-xs text-gray-600">Michael Chen - 2:00 PM</p>
                  </div>
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Document Review</p>
                    <p className="text-xs text-gray-600">Emma Rodriguez - 10:00 AM</p>
                  </div>
                  <span className="text-xs text-gray-500">Tomorrow</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Management
              </CardTitle>
              <CardDescription>
                Manage your client relationships and case information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Active Clients</h3>
                  <p className="text-2xl font-bold text-blue-600">23</p>
                  <p className="text-sm text-gray-600">Currently managed</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">New This Month</h3>
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">Recent additions</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Pending Cases</h3>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                  <p className="text-sm text-gray-600">Awaiting documents</p>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="ai-tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI-Powered Tools
              </CardTitle>
              <CardDescription>
                Leverage artificial intelligence to streamline your practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold">Document Analysis</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    AI-powered document review and analysis for immigration applications
                  </p>
                  <Button size="sm" variant="outline">Try Now</Button>
                </div>
                <div className="p-4 border rounded-lg hover:bg-green-50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold">Risk Assessment</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Evaluate application risks and success probability
                  </p>
                  <Button size="sm" variant="outline">Try Now</Button>
                </div>
                <div className="p-4 border rounded-lg hover:bg-purple-50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                    <h3 className="font-semibold">AI Assistant</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Intelligent chat assistant for client queries
                  </p>
                  <Button size="sm" variant="outline">Try Now</Button>
                </div>
                <div className="p-4 border rounded-lg hover:bg-orange-50 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                    <h3 className="font-semibold">Success Predictor</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Predict application success rates based on historical data
                  </p>
                  <Button size="sm" variant="outline">Try Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Document Management
              </CardTitle>
              <CardDescription>
                Organize and manage client documents securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Total Documents</h3>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-sm text-gray-600">Stored securely</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Pending Review</h3>
                  <p className="text-2xl font-bold text-orange-600">8</p>
                  <p className="text-sm text-gray-600">Requires attention</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Recently Uploaded</h3>
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-sm text-gray-600">This week</p>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload New Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Management
              </CardTitle>
              <CardDescription>
                Track and manage immigration applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">In Progress</h3>
                  <p className="text-2xl font-bold text-blue-600">15</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Under Review</h3>
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Approved</h3>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Pending</h3>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Billing & Payments
              </CardTitle>
              <CardDescription>
                Manage invoices and track payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">This Month</h3>
                  <p className="text-2xl font-bold text-green-600">$12,500</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Outstanding</h3>
                  <p className="text-2xl font-bold text-orange-600">$3,200</p>
                  <p className="text-sm text-gray-600">Pending payments</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Invoices</h3>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Create New Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>
                View detailed analytics and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Success Rate</h3>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-gray-600">Application approval rate</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Average Processing</h3>
                  <p className="text-2xl font-bold text-blue-600">45 days</p>
                  <p className="text-sm text-gray-600">Time to decision</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Profile Information</h3>
                  <p className="text-sm text-gray-600 mb-3">Update your personal and professional information</p>
                  <Button size="sm" variant="outline">Edit Profile</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Notification Preferences</h3>
                  <p className="text-sm text-gray-600 mb-3">Configure email and push notifications</p>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Security Settings</h3>
                  <p className="text-sm text-gray-600 mb-3">Manage password and security options</p>
                  <Button size="sm" variant="outline">Update Security</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 