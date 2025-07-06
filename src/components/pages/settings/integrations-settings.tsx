
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickBooksIcon } from "@/components/icons/QuickBooksIcon";
import { useToast } from "@/hooks/use-toast";
import { GmailIcon } from "@/components/icons/GmailIcon";
import { OutlookIcon } from "@/components/icons/OutlookIcon";

export function IntegrationsSettings() {
    const { toast } = useToast();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect your firm's tools to streamline your workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <QuickBooksIcon className="h-10 w-10" />
                        <div>
                            <CardTitle>QuickBooks</CardTitle>
                            <CardDescription>Sync your invoices and payments automatically with QuickBooks Online.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter>
                         <Button onClick={() => toast({ title: "Connecting...", description: "Redirecting to QuickBooks for authorization." })}>
                            <QuickBooksIcon className="mr-2 h-5 w-5" />
                            Connect to QuickBooks
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <GmailIcon className="h-10 w-10" />
                        <div>
                            <CardTitle>Gmail</CardTitle>
                            <CardDescription>Sync your emails and contacts to manage client communication seamlessly.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter>
                         <Button onClick={() => toast({ title: "Connecting...", description: "Redirecting to Google for authorization." })}>
                            <GmailIcon className="mr-2 h-5 w-5" />
                            Connect to Gmail
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <OutlookIcon className="h-10 w-10" />
                        <div>
                            <CardTitle>Outlook</CardTitle>
                            <CardDescription>Integrate your Outlook calendar and contacts for unified scheduling.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter>
                         <Button onClick={() => toast({ title: "Connecting...", description: "Redirecting to Microsoft for authorization." })}>
                            <OutlookIcon className="mr-2 h-5 w-5" />
                            Connect to Outlook
                        </Button>
                    </CardFooter>
                </Card>
            </CardContent>
        </Card>
    );
}
