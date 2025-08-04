// Superadmin Lawyer Onboarding Page
'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function SuperadminLawyersPage() {
  const { teamMembers, updateTeamMember } = useGlobalData();
  const { toast } = useToast();
  
  // Filter only lawyers
  const lawyers = teamMembers.filter(member => member.authRole === 'lawyer');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lawyer Onboarding & Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pending Approvals ({lawyers.filter(l => l.status === 'awaiting_approval').length})</h3>
          </div>
          
          {lawyers.filter(lawyer => lawyer.status === 'awaiting_approval').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending lawyer approvals</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {lawyers.filter(lawyer => lawyer.status === 'awaiting_approval').map(lawyer => (
                <Card key={lawyer.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={lawyer.avatar} alt={lawyer.name} className="h-12 w-12 rounded-full" />
                      <div>
                        <h4 className="font-semibold">{lawyer.name}</h4>
                        <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                        <p className="text-sm text-muted-foreground">Firm: {lawyer.firmName || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Pending Approval</Badge>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          updateTeamMember({
                            ...lawyer,
                            status: 'Active',
                            role: 'Active Lawyer'
                          });
                          toast({
                            title: 'Lawyer Activated',
                            description: `${lawyer.name} has been activated successfully.`,
                          });
                        }}
                      >
                        Activate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          updateTeamMember({
                            ...lawyer,
                            status: 'Rejected'
                          });
                          toast({
                            title: 'Lawyer Rejected',
                            description: `${lawyer.name} has been rejected.`,
                            variant: 'destructive',
                          });
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">All Lawyers</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Firm</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lawyers.map(lawyer => (
                  <tr key={lawyer.id} className="border-b">
                    <td className="py-3">
                      <Link href={`/superadmin/lawyers/${lawyer.id}`} className="text-primary underline hover:text-primary/80">
                        {lawyer.name}
                      </Link>
                    </td>
                    <td className="py-3">{lawyer.email}</td>
                    <td className="py-3">{lawyer.firmName || 'Not specified'}</td>
                    <td className="py-3">
                      <Badge variant={lawyer.status === 'Active' ? 'default' : lawyer.status === 'awaiting_approval' ? 'secondary' : 'destructive'}>
                        {lawyer.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {lawyer.status === 'awaiting_approval' && (
                        <Button 
                          size="sm" 
                          className="mr-2"
                          onClick={() => {
                            updateTeamMember({
                              ...lawyer,
                              status: 'Active',
                              role: 'Active Lawyer'
                            });
                            toast({
                              title: 'Lawyer Activated',
                              description: `${lawyer.name} has been activated successfully.`,
                            });
                          }}
                        >
                          Activate
                        </Button>
                      )}
                      <Button size="sm" variant="destructive">Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
