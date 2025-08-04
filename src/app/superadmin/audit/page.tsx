// Superadmin Audit Log Page
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SuperadminAuditPage() {
  // Placeholder: Replace with real data fetching
  const logs = [
    { id: 1, action: 'Lawyer activated', user: 'Superadmin', target: 'Sarah Johnson', date: '2025-07-29 14:23' },
    { id: 2, action: 'Employee removed', user: 'Superadmin', target: 'Ali Reza', date: '2025-07-28 09:02' },
    { id: 3, action: 'Subscription upgraded', user: 'Superadmin', target: 'Chen Wang', date: '2025-07-27 16:44' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td>{log.date}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
