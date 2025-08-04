// Superadmin Clients CRM Page
'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SuperadminClientsPage() {
  // Placeholder: Replace with real data fetching
  const clients = [
    { id: '1', name: 'Waystar Law', status: 'Lead', assignedTo: 'Jessica Miller', owner: 'Sarah Johnson', email: 'info@waystar.com', phone: '555-1000', website: 'waystar.com', created: '2025-06-20' },
    { id: '2', name: 'Acme Legal', status: 'Customer', assignedTo: 'Evelyn Reed', owner: 'Chen Wang', email: 'contact@acmelegal.com', phone: '555-2000', website: 'acmelegal.com', created: '2025-05-11' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle>Clients CRM</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="default">Import Clients</Button>
          <Button size="sm" variant="outline">Add Client</Button>
          <Button size="sm" variant="outline">Add Employee</Button>
          <Button size="sm" variant="outline">Add Lawyer</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Account Owner</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b">
                <td>
                  <Link href={`/superadmin/clients/${client.id}`} className="text-primary underline hover:text-primary/80">
                    {client.name}
                  </Link>
                </td>
                <td>{client.status}</td>
                <td>{client.assignedTo}</td>
                <td>{client.owner}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.website}</td>
                <td>{client.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
