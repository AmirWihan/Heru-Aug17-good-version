// Superadmin Lawyer Info Page
'use client';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';


import { Button } from '@/components/ui/button';

// Placeholder for lawyer data fetching
const LAWYERS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', firm: 'Waystar', regNo: 'ICCRC-12345', status: 'pending', idCardUrl: 'https://i.pravatar.cc/150?u=sarah', address: '123 Main St', website: 'waystar.com', employees: 6, subscription: 'Pro Team', clients: 7 },
  { id: '2', name: 'Chen Wang', email: 'chen.wang@example.com', firm: 'Waystar', regNo: 'ICCRC-67890', status: 'active', idCardUrl: 'https://i.pravatar.cc/150?u=chen', address: '456 Elm St', website: 'waystar.com', employees: 3, subscription: 'Starter', clients: 2 },
];

const PAYMENTS = {
  '1': [
    { id: 101, date: '2025-07-01', amount: 199, status: 'Paid', plan: 'Pro Team' },
    { id: 102, date: '2025-06-01', amount: 199, status: 'Paid', plan: 'Pro Team' },
  ],
  '2': [
    { id: 201, date: '2025-07-01', amount: 49, status: 'Paid', plan: 'Starter' },
  ],
};

export default function LawyerInfoPage() {
  const params = useParams();
  const lawyer = LAWYERS.find(l => l.id === params.id);
  const payments = PAYMENTS[params.id as keyof typeof PAYMENTS] || [];

  if (!lawyer) return <div className="p-8">Lawyer not found.</div>;

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{lawyer.name} <span className="text-sm text-muted-foreground">({lawyer.status})</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center">
            <a href={lawyer.idCardUrl} target="_blank" rel="noopener noreferrer">
              <img src={lawyer.idCardUrl} alt="ID Card" className="h-40 w-40 rounded border shadow mb-2" />
            </a>
            <div className="text-xs text-muted-foreground">Identity Card</div>
          </div>
          <div className="flex-1">
            <div className="font-semibold">Email:</div> <div>{lawyer.email}</div>
            <div className="font-semibold">Firm:</div> <div>{lawyer.firm}</div>
            <div className="font-semibold">Registration #:</div> <div>{lawyer.regNo}</div>
            <div className="font-semibold">Subscription:</div> <div>{lawyer.subscription}</div>
            <div className="font-semibold">Address:</div> <div>{lawyer.address}</div>
            <div className="font-semibold">Website:</div> <div>{lawyer.website}</div>
            <div className="font-semibold">Employees:</div> <div>{lawyer.employees}</div>
            <div className="font-semibold">Number of Clients:</div> <div>{lawyer.clients}</div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          {lawyer.status !== 'active' && (
            <Button size="sm" variant="default">Activate</Button>
          )}
          {lawyer.status === 'active' && (
            <Button size="sm" variant="outline">Deactivate</Button>
          )}
          <Button size="sm" variant="destructive">Remove</Button>
        </div>
        <div className="mt-8">
          <div className="font-semibold mb-2">Payment History</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr><td colSpan={4} className="text-muted-foreground">No payment history found.</td></tr>
              )}
              {payments.map(payment => (
                <tr key={payment.id} className="border-b">
                  <td>{payment.date}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.status}</td>
                  <td>{payment.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
