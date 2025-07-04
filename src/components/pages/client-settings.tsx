'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

function ProfileSettingsTab() {
     return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://i.pravatar.cc/150?u=client" alt="Client" />
                    <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Applicant" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.applicant@example.com" />
            </div>
        </div>
    );
}

function AppearanceSettingsTab() {
    return (
        <div className="space-y-6">
             <div>
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">Select the color scheme for your dashboard.</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                     <Button variant="outline">Light</Button>
                     <Button variant="default">Dark</Button>
                     <Button variant="outline">System</Button>
                </div>
            </div>
        </div>
    );
}

function SecuritySettingsTab() {
    return (
        <div className="space-y-6">
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
             <div className="border-t pt-6">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between mt-4 p-4 border rounded-lg">
                    <p className="text-muted-foreground max-w-sm">Enable 2FA to add an extra layer of security to your account.</p>
                    <Switch />
                </div>
            </div>
        </div>
    );
}


export function ClientSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your profile, appearance, and account security.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="mt-6">
                        <ProfileSettingsTab />
                    </TabsContent>
                    <TabsContent value="appearance" className="mt-6">
                        <AppearanceSettingsTab />
                    </TabsContent>
                    <TabsContent value="security" className="mt-6">
                        <SecuritySettingsTab />
                    </TabsContent>
                </Tabs>
            </CardContent>
             <CardFooter className="border-t pt-6 flex justify-end">
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
