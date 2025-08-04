'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PendingApprovalPage() {
  const { userProfile } = useGlobalData();
  const router = useRouter();

  useEffect(() => {
    // If user is not a lawyer or not awaiting approval, redirect
    if (userProfile && userProfile.authRole === 'lawyer') {
      const lawyer = userProfile as any;
      if (lawyer.status !== 'awaiting_approval') {
        router.push('/lawyer/dashboard');
      }
    }
  }, [userProfile, router]);

  if (!userProfile || userProfile.authRole !== 'lawyer') {
    return null;
  }

  const lawyer = userProfile as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Account Pending Approval</CardTitle>
          <CardDescription>
            Your lawyer account is currently under review by our team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">What happens next?</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Our team will review your application and verify your credentials. 
                  You'll receive an email notification once your account is approved.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{lawyer.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{lawyer.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Firm:</span>
                <p className="font-medium">{lawyer.firmName || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium text-yellow-600">Pending Approval</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">What you can do while waiting</h4>
                <ul className="text-sm text-green-800 mt-2 space-y-1">
                  <li>• Prepare your firm documents and credentials</li>
                  <li>• Review our platform features and documentation</li>
                  <li>• Contact support if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/support')}
            >
              Contact Support
            </Button>
            <Button 
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Check Status
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>Typical approval time: 1-3 business days</p>
            <p>Need urgent approval? Contact our support team</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 