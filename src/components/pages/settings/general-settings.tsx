import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeruLogoIcon } from "@/components/icons/HeruLogoIcon";
import { UploadCloud } from "lucide-react";

export function GeneralSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Update your workspace's details and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="company-name">Workspace Name</Label>
                    <Input id="company-name" defaultValue="Heru Immigration CRM" />
                </div>
                <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-muted rounded-lg border">
                            <HeruLogoIcon className="h-12 w-12" />
                        </div>
                        <Button variant="outline">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload Logo
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended size: 200x80px. File type: SVG, PNG, JPG.</p>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
