// Superadmin Support Tickets Page
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SuperadminSupportPage() {
  // Placeholder: Replace with real data fetching
  const tickets = [
    { id: 1, subject: 'Payment Issue', client: 'John Smith', assignedTo: 'Evelyn Reed', status: 'Open', created: '2025-07-28' },
    { id: 2, subject: 'Account Locked', client: 'Maria Garcia', assignedTo: 'Jessica Miller', status: 'Resolved', created: '2025-07-27' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Client</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b">
                <td>{ticket.subject}</td>
                <td>{ticket.client}</td>
                <td>{ticket.assignedTo}</td>
                <td>{ticket.status}</td>
                <td>{ticket.created}</td>
                <td>
                  <button className="text-primary underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
