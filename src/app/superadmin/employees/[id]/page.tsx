// Superadmin Employee Info Page
'use client';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';



// Placeholder for employee data fetching
const EMPLOYEES = [
  { id: '1', name: 'Jessica Miller', email: 'jessica.miller@example.com', role: 'Sales Lead', kpi: '120%', avatar: 'https://i.pravatar.cc/150?u=jessica', phone: '555-1234', position: 'Sales', status: 'Active' },
  { id: '2', name: 'Evelyn Reed', email: 'evelyn.reed@example.com', role: 'Support', kpi: '98%', avatar: 'https://i.pravatar.cc/150?u=evelyn', phone: '555-5678', position: 'Support', status: 'Active' },
];

const PERFORMANCE = {
  '1': [
    { month: '2025-07', kpi: '120%', revenue: 12000 },
    { month: '2025-06', kpi: '110%', revenue: 10800 },
  ],
  '2': [
    { month: '2025-07', kpi: '98%', revenue: 7500 },
    { month: '2025-06', kpi: '95%', revenue: 7000 },
  ],
};

const CALL_LOGS = {
  '1': [
    { date: '2025-07-28', client: 'Acme Corp', duration: '00:23', type: 'Outbound' },
    { date: '2025-07-24', client: 'Smith Law', duration: '00:17', type: 'Inbound' },
  ],
  '2': [
    { date: '2025-07-27', client: 'Miller LLC', duration: '00:12', type: 'Outbound' },
  ],
};

const EMAIL_LOGS = {
  '1': [
    { date: '2025-07-28', subject: 'Onboarding Docs', to: 'acme@corp.com' },
    { date: '2025-07-25', subject: 'Follow-up', to: 'smith@law.com' },
  ],
  '2': [
    { date: '2025-07-26', subject: 'Support Ticket', to: 'miller@llc.com' },
  ],
};

export default function EmployeeInfoPage() {
  const params = useParams();
  const emp = EMPLOYEES.find(e => e.id === params.id);
  const perf = PERFORMANCE[params.id as keyof typeof PERFORMANCE] || [];
  const calls = CALL_LOGS[params.id as keyof typeof CALL_LOGS] || [];
  const emails = EMAIL_LOGS[params.id as keyof typeof EMAIL_LOGS] || [];

  if (!emp) return <div className="p-8">Employee not found.</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{emp.name} <span className="text-sm text-muted-foreground">({emp.status})</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-6 items-center">
          <img src={emp.avatar} alt="Avatar" className="h-32 w-32 rounded border shadow" />
          <div>
            <div className="font-semibold">Email:</div> <div>{emp.email}</div>
            <div className="font-semibold">Phone:</div> <div>{emp.phone}</div>
            <div className="font-semibold">Role:</div> <div>{emp.role}</div>
            <div className="font-semibold">Position:</div> <div>{emp.position}</div>
            <div className="font-semibold">KPI:</div> <div>{emp.kpi}</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="font-semibold mb-2">Performance (Last 2 Months)</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Month</th>
                <th>KPI</th>
                <th>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {perf.length === 0 && (
                <tr><td colSpan={3} className="text-muted-foreground">No performance data.</td></tr>
              )}
              {perf.map((row, i) => (
                <tr key={i} className="border-b">
                  <td>{row.month}</td>
                  <td>{row.kpi}</td>
                  <td>${row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <div className="font-semibold mb-2">Call Log</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Duration</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {calls.length === 0 && (
                <tr><td colSpan={4} className="text-muted-foreground">No call logs.</td></tr>
              )}
              {calls.map((call, i) => (
                <tr key={i} className="border-b">
                  <td>{call.date}</td>
                  <td>{call.client}</td>
                  <td>{call.duration}</td>
                  <td>{call.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <div className="font-semibold mb-2">Email Log</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 && (
                <tr><td colSpan={3} className="text-muted-foreground">No email logs.</td></tr>
              )}
              {emails.map((email, i) => (
                <tr key={i} className="border-b">
                  <td>{email.date}</td>
                  <td>{email.subject}</td>
                  <td>{email.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
