// Superadmin Payments Page
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SuperadminPaymentsPage() {
  // Placeholder: Replace with real data fetching
  const payments = [
    { id: 1, date: '2025-07-01', user: 'Sarah Johnson', amount: 199, status: 'Paid', plan: 'Pro Team' },
    { id: 2, date: '2025-07-02', user: 'Chen Wang', amount: 49, status: 'Paid', plan: 'Starter' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments & Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-b">
                <td>{payment.date}</td>
                <td>{payment.user}</td>
                <td>${payment.amount}</td>
                <td>{payment.status}</td>
                <td>{payment.plan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
