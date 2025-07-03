import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NotificationsSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">New Client Message</h4>
                        <p className="text-sm text-muted-foreground">Receive an email when a client sends a new message.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Application Updates</h4>
                        <p className="text-sm text-muted-foreground">Get notified about status changes on applications.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Appointment Reminders</h4>
                        <p className="text-sm text-muted-foreground">Receive reminders for upcoming appointments.</p>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Weekly Summary</h4>
                        <p className="text-sm text-muted-foreground">Get a weekly report of your activities.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button>Save Preferences</Button>
            </CardFooter>
        </Card>
    );
}
