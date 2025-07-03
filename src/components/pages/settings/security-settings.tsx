import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SecuritySettings() {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and manage account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button>Update Password</Button>
            </CardFooter>
        </Card>
    )
}
