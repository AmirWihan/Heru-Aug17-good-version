import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is how others will see you on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sarah J." />
                        <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Photo</Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Sarah Johnson" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="sarah.j@heru.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Immigration Lawyer" />
                </div>
            </CardContent>
             <CardFooter className="border-t pt-6">
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
