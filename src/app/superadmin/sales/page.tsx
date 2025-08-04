// Superadmin Sales & Marketing Page
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SuperadminSalesPage() {
  // Placeholder: Replace with real data fetching
  const pipeline = [
    { stage: 'Lead', count: 18 },
    { stage: 'Opportunity', count: 7 },
    { stage: 'Closed', count: 4 },
  ];
  const callLogs = [
    { id: 1, employee: 'Jessica Miller', type: 'Call', date: '2025-07-28', notes: 'Intro call with John Smith' },
    { id: 2, employee: 'Ali Reza', type: 'Email', date: '2025-07-29', notes: 'Follow-up sent to Maria Garcia' },
  ];
  const campaigns = [
    { id: 1, name: 'Summer Promo', status: 'Active', leads: 24, conversions: 5 },
    { id: 2, name: 'Webinar', status: 'Completed', leads: 12, conversions: 3 },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex gap-8">
            {pipeline.map(stage => (
              <li key={stage.stage} className="flex flex-col items-center">
                <span className="font-bold text-lg">{stage.count}</span>
                <span className="text-muted-foreground">{stage.stage}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Call Logs & Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {callLogs.map(log => (
                <tr key={log.id} className="border-b">
                  <td>{log.date}</td>
                  <td>{log.employee}</td>
                  <td>{log.type}</td>
                  <td>{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Leads</th>
                <th>Conversions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(camp => (
                <tr key={camp.id} className="border-b">
                  <td>{camp.name}</td>
                  <td>{camp.status}</td>
                  <td>{camp.leads}</td>
                  <td>{camp.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
