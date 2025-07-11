
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickBooksIcon } from "@/components/icons/QuickBooksIcon";
import { useGlobalData } from "@/context/GlobalDataContext";
import { DynamicLogoIcon } from "../icons/DynamicLogoIcon";
import { Check, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsappIcon } from "../icons/WhatsappIcon";
import { plans, themes } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GmailIcon } from "@/components/icons/GmailIcon";
import { OutlookIcon } from "@/components/icons/OutlookIcon";

export function PlatformSettingsPage() {
    const { setWorkspaceLogo, theme, setTheme, userProfile } = useGlobalData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleLogoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({
                    title: "File too large",
                    description: "Please upload an image smaller than 2MB.",
                    variant: "destructive",
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const newLogoSrc = e.target?.result as string;
                setWorkspaceLogo('platform', newLogoSrc);
                toast({
                    title: "Logo updated",
                    description: "Your new platform logo has been applied."
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAll = () => {
        toast({
            title: "Settings Saved",
            description: "Platform settings have been updated.",
        });
    };

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Manage global settings for the VisaFor platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="general">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="admin-account">Admin Account</TabsTrigger>
                            <TabsTrigger value="billing">Billing & Subscriptions</TabsTrigger>
                            <TabsTrigger value="integrations">Integrations</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Branding</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="platform-name">Platform Name</Label>
                                        <Input id="platform-name" defaultValue="VisaFor Immigration CRM" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label>Platform Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 border rounded-lg bg-muted flex items-center justify-center h-20 w-20">
                                                <DynamicLogoIcon className="h-12 w-12" />
                                            </div>
                                            <Button type="button" variant="outline" onClick={handleLogoUploadClick}>
                                                <UploadCloud className="mr-2 h-4 w-4" />
                                                Upload Logo
                                            </Button>
                                            <Input 
                                                id="logo-upload"
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/svg+xml"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                         <p className="text-xs text-muted-foreground">Recommended: SVG, PNG, or JPG. Max 2MB.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Theme Color</Label>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {themes.map((t) => (
                                                <TooltipProvider key={t.id}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => setTheme(t.id)}
                                                                className={cn(
                                                                    "h-8 w-8 rounded-full border-2 flex items-center justify-center",
                                                                    theme === t.id ? 'border-primary' : 'border-muted'
                                                                )}
                                                                style={{ backgroundColor: t.colors.primary }}
                                                            >
                                                                {theme === t.id && <Check className="h-4 w-4 text-primary-foreground" />}
                                                                <span className="sr-only">{t.name}</span>
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Feature Flags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Enable New Client Onboarding</h4>
                                            <p className="text-sm text-muted-foreground">Allow new clients to self-register and onboard.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Enable AI Tools for All Users</h4>
                                            <p className="text-sm text-muted-foreground">Give all lawyer accounts access to AI features.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="admin-account" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Profile</CardTitle>
                                    <CardDescription>Manage the main administrator account credentials.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-name">Full Name</Label>
                                        <Input id="admin-name" defaultValue={userProfile?.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-email">Email Address</Label>
                                        <Input id="admin-email" type="email" defaultValue={userProfile?.email} />
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="billing" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscription Plans</CardTitle>
                                    <CardDescription>Manage the pricing and features for each subscription tier.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-3 gap-6">
                                    {plans.map(plan => (
                                         <Card key={plan.id}>
                                            <CardHeader><CardTitle>{plan.name}</CardTitle></CardHeader>
                                            <CardContent className="space-y-4">
                                                 {typeof plan.price === 'object' ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`${plan.id}-price-monthly`}>Monthly ($)</Label>
                                                            <Input id={`${plan.id}-price-monthly`} type="number" defaultValue={plan.price.monthly} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`${plan.id}-price-annually`}>Annually ($)</Label>
                                                            <Input id={`${plan.id}-price-annually`} type="number" defaultValue={plan.price.annually} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Label>Price</Label>
                                                        <Input defaultValue="Custom" disabled />
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`${plan.id}-user-limit`}>User Limit</Label>
                                                        <Input id={`${plan.id}-user-limit`} defaultValue={plan.userLimit} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`${plan.id}-client-limit`}>Client Limit</Label>
                                                        <Input id={`${plan.id}-client-limit`} defaultValue={plan.clientLimit} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`${plan.id}-features`}>Features (one per line)</Label>
                                                    <Textarea id={`${plan.id}-features`} rows={5} defaultValue={plan.features.join('\n')} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="integrations" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>API Keys & Platform Connections</CardTitle>
                                    <CardDescription>Manage global API keys and third-party service connections for the entire platform.</CardDescription>
                                </CardHeader>
                                 <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="google-api-key">Google Cloud API Key</Label>
                                        <Input id="google-api-key" type="password" defaultValue="......." />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="stripe-api-key">Stripe API Key</Label>
                                        <Input id="stripe-api-key" type="password" defaultValue="......." />
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <QuickBooksIcon className="h-10 w-10" />
                                    <div>
                                        <CardTitle>QuickBooks Integration</CardTitle>
                                        <CardDescription>Connect your platform's master account to QuickBooks for centralized accounting.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <Button>
                                        <QuickBooksIcon className="mr-2 h-5 w-5" />
                                        Connect to QuickBooks
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <GmailIcon className="h-10 w-10" />
                                    <div>
                                        <CardTitle>Google Workspace</CardTitle>
                                        <CardDescription>Connect a master Google account to handle system-wide emails.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <Button>
                                        <GmailIcon className="mr-2 h-5 w-5" />
                                        Connect to Google
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <OutlookIcon className="h-10 w-10" />
                                    <div>
                                        <CardTitle>Microsoft 365</CardTitle>
                                        <CardDescription>Connect a master Outlook account for platform notifications.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <Button>
                                        <OutlookIcon className="mr-2 h-5 w-5" />
                                        Connect to Microsoft
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <WhatsappIcon className="h-10 w-10 text-green-500" />
                                    <div>
                                        <CardTitle>WhatsApp Integration</CardTitle>
                                        <CardDescription>Connect your WhatsApp Business account to send and receive messages directly.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <Button>
                                        <WhatsappIcon className="mr-2 h-5 w-5" />
                                        Connect to WhatsApp
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-end">
                    <Button onClick={handleSaveAll}>Save All Settings</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
