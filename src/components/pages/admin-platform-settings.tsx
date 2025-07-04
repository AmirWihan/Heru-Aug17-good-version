
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
import { UploadCloud } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsappIcon } from "../icons/WhatsappIcon";

export function PlatformSettingsPage() {
    const { setLogoSrc } = useGlobalData();
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
                setLogoSrc(e.target?.result as string);
                toast({
                    title: "Logo updated",
                    description: "Your new logo has been applied."
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Manage global settings for the Heru platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="general">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="general">General</TabsTrigger>
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
                                        <Input id="platform-name" defaultValue="Heru Immigration CRM" />
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
                        <TabsContent value="billing" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscription Plans</CardTitle>
                                    <CardDescription>Manage the pricing and features for each subscription tier.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-3 gap-6">
                                    <Card>
                                        <CardHeader><CardTitle>Starter</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="starter-price">Price ($/month/user)</Label>
                                                <Input id="starter-price" type="number" defaultValue="49" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="starter-features">Features (one per line)</Label>
                                                <Textarea id="starter-features" rows={5} defaultValue={"Up to 2 users\nUp to 50 clients\nBasic AI Tools\nStandard Support"} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle>Pro Team</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="pro-price">Price ($/month/user)</Label>
                                                <Input id="pro-price" type="number" defaultValue="99" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pro-features">Features (one per line)</Label>
                                                <Textarea id="pro-features" rows={5} defaultValue={"Up to 10 users\nUp to 500 clients\nAdvanced AI Tools\nTeam Collaboration Features\nPriority Email Support"} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle>Enterprise</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="enterprise-price">Price</Label>
                                                <Input id="enterprise-price" defaultValue="Custom" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="enterprise-features">Features (one per line)</Label>
                                                <Textarea id="enterprise-features" rows={5} defaultValue={"Unlimited users & clients\nDedicated Support & Onboarding\nCustom Integrations\nAdvanced Security & Compliance"} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="integrations" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>API Keys</CardTitle>
                                </CardHeader>
                                 <CardContent className="space-y-4">
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
                    <Button>Save All Settings</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
