// Superadmin Dashboard Widgets (Owner Portal)
'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, BarChart2, Users, BriefcaseBusiness, DollarSign, Activity, Award, FileText, UserCheck, UserPlus } from 'lucide-react';

export function RevenueWidget() {
  // Shortcut to Payments
  return (
    <Link href="/superadmin/payments" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Revenue (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">$42,500</div>
          <div className="h-24 bg-muted rounded flex items-center justify-center text-muted-foreground">[Graph]</div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PlatformStatsWidget() {
  // Shortcut to Lawyers
  return (
    <Link href="/superadmin/lawyers" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Platform Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            <li>Lawyers: <span className="font-bold">38</span></li>
            <li>Clients: <span className="font-bold">214</span></li>
            <li>Employees: <span className="font-bold">12</span></li>
            <li>Active Subscriptions: <span className="font-bold">31</span></li>
            <li>Active Cases: <span className="font-bold">19</span></li>
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}

export function GrowthTrendsWidget() {
  // Shortcut to Sales
  return (
    <Link href="/superadmin/sales" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5" /> Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted rounded flex items-center justify-center text-muted-foreground">[Growth Graph]</div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function EmployeeActivityWidget() {
  // Shortcut to Employees
  return (
    <Link href="/superadmin/employees" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Employee Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            <li>Jessica Miller: 34 calls, 12 emails</li>
            <li>Evelyn Reed: 21 tickets, 3 sales</li>
            <li>Ali Reza: 15 sales, 7 demos</li>
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}

export function SubscriptionBreakdownWidget() {
  // Shortcut to Payments
  return (
    <Link href="/superadmin/payments" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Subscription Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            <li>Pro Team: <span className="font-bold">18</span></li>
            <li>Starter: <span className="font-bold">9</span></li>
            <li>Enterprise: <span className="font-bold">4</span></li>
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}

export function RecentActivityFeedWidget() {
  // Shortcut to Audit Log
  return (
    <Link href="/superadmin/audit" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            <li>Sarah Johnson (lawyer) uploaded ID card</li>
            <li>Jessica Miller (employee) closed ticket #123</li>
            <li>Ali Reza (employee) made 2 sales</li>
            <li>New client registered: John Smith</li>
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PerformanceLeaderboardWidget() {
  // Shortcut to Employees
  return (
    <Link href="/superadmin/employees" className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Performance Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Ali Reza (Sales) - 15 sales</li>
            <li>Jessica Miller (Support) - 34 calls</li>
            <li>Evelyn Reed (Support) - 21 tickets</li>
          </ol>
        </CardContent>
      </Card>
    </Link>
  );
}
