// Superadmin Employees & CRM Page
'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SuperadminEmployeesPage() {
  // Placeholder: Replace with real data fetching
  const employees = [
    { id: '1', name: 'Jessica Miller', role: 'Sales Lead', kpi: '120%', avatar: 'https://i.pravatar.cc/150?u=jessica', email: 'jessica.miller@example.com' },
    { id: '2', name: 'Evelyn Reed', role: 'Support', kpi: '98%', avatar: 'https://i.pravatar.cc/150?u=evelyn', email: 'evelyn.reed@example.com' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees & CRM</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>KPI</th>
              <th>Avatar</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b">
                <td>
                  <Link href={`/superadmin/employees/${emp.id}`} className="text-primary underline hover:text-primary/80">
                    {emp.name}
                  </Link>
                </td>
                <td>{emp.role}</td>
                <td>{emp.kpi}</td>
                <td><img src={emp.avatar} alt="Avatar" className="h-8 w-8 rounded" /></td>
                <td>
                  <Button size="sm" variant="outline" className="mr-2">View</Button>
                  <Button size="sm" variant="destructive">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
