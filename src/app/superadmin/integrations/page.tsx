// Superadmin API & Integrations Page
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SuperadminIntegrationsPage() {
  // Placeholder: Replace with real data fetching
  const integrations = [
    { id: 1, name: 'Zapier', status: 'Connected' },
    { id: 2, name: 'Slack', status: 'Not Connected' },
    { id: 3, name: 'Google Workspace', status: 'Connected' },
  ];
  const apiKeys = [
    { id: 1, key: 'sk-1234...abcd', usage: '1,200 calls/mo', status: 'Active' },
    { id: 2, key: 'sk-5678...efgh', usage: '300 calls/mo', status: 'Revoked' },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {integrations.map(intg => (
              <li key={intg.id} className="flex justify-between">
                <span>{intg.name}</span>
                <span className={intg.status === 'Connected' ? 'text-green-600' : 'text-muted-foreground'}>{intg.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Key</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(api => (
                <tr key={api.id} className="border-b">
                  <td>{api.key}</td>
                  <td>{api.usage}</td>
                  <td>{api.status}</td>
                  <td>
                    <button className="text-primary underline">Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
