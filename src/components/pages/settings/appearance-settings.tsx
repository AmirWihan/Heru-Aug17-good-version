import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function AppearanceSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div>
                    <h3 className="text-lg font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                         <Button variant="outline">Light</Button>
                         <Button variant="default">Dark</Button>
                         <Button variant="outline">System</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
