'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlatformSettingsPage() {
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
                                        <Label htmlFor="platform-logo">Platform Logo</Label>
                                        <Input id="platform-logo" type="file" />
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
