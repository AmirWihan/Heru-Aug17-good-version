
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalData } from "@/context/GlobalDataContext";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BillingSettings() {
    const { toast } = useToast();
    const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

    // This would come from the logged-in user's context in a real app
    const [currentPlan, setCurrentPlan] = useState('Pro Team');
    const [isCanceled, setIsCanceled] = useState(false);

    const handleCancelSubscription = () => {
        setIsCanceled(true);
        setIsCancelAlertOpen(false);
        toast({
            title: "Subscription Canceled",
            description: "Your plan will remain active until the end of the billing period.",
            variant: "destructive"
        });
    }
    
     const handleReactivateSubscription = () => {
        setIsCanceled(false);
        toast({
            title: "Subscription Re-activated",
            description: "Your plan has been re-activated successfully.",
        });
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Billing & Subscription</CardTitle>
                    <CardDescription>Manage your firm's subscription plan and payment details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card>
                        <CardHeader className="flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-lg">Current Plan</CardTitle>
                                <p className="text-muted-foreground text-sm">You are currently on the <span className="font-semibold text-primary">{currentPlan}</span> plan.</p>
                            </div>
                            <Badge variant={isCanceled ? "destructive" : "success"}>{isCanceled ? 'Canceled' : 'Active'}</Badge>
                        </CardHeader>
                        <CardContent>
                            {isCanceled ? (
                                <p className="text-muted-foreground text-sm">Your subscription is canceled and will not renew. You can continue to use all features until your current billing period ends on August 1, 2024.</p>
                            ) : (
                                <p className="text-muted-foreground text-sm">Your next renewal is on August 1, 2024 for $495.00 (Pro Team Annual Plan).</p>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                             <div>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Change Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="starter">Starter Plan</SelectItem>
                                        <SelectItem value="pro">Pro Team Plan</SelectItem>
                                        <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                            {isCanceled ? (
                                <Button onClick={handleReactivateSubscription}>Re-activate Subscription</Button>
                            ) : (
                                <Button variant="destructive" onClick={() => setIsCancelAlertOpen(true)}>Cancel Subscription</Button>
                            )}
                            </div>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                            <CardDescription>The primary card used for your subscription.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <p>Visa ending in **** 4242</p>
                            <Button variant="outline">Update Card</Button>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel your subscription at the end of the current billing cycle. You can re-activate it any time before then.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Cancel Subscription
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
