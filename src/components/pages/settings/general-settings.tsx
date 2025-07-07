
'use client';

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGlobalData } from '@/context/GlobalDataContext';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';

export function GeneralSettings() {
    const { toast } = useToast();
    const { setLogoSrc } = useGlobalData();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    description: "Your new workspace logo has been applied."
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        toast({ title: "Settings Saved", description: "Your workspace settings have been updated." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Workspace & Branding</CardTitle>
                <CardDescription>Customize your firm's details, branding, and letterhead information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-muted rounded-lg border flex items-center justify-center h-20 w-20">
                            <DynamicLogoIcon className="h-12 w-12" />
                        </div>
                        <Button variant="outline" type="button" onClick={handleLogoUploadClick}>
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
                    <p className="text-xs text-muted-foreground">This logo will appear at the top of your CRM. Recommended: SVG, PNG, or JPG. Max 2MB.</p>
                </div>

                <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-medium">Letterhead Information</h3>
                    <p className="text-sm text-muted-foreground">This information will be used to automatically generate letterheads for official documents.</p>
                    <div className="space-y-2">
                        <Label htmlFor="firm-name">Firm Name</Label>
                        <Input id="firm-name" defaultValue="Johnson Legal" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="firm-address">Address</Label>
                        <Textarea id="firm-address" defaultValue="789 Bay Street, Toronto, ON M5G 2C2" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firm-phone">Phone Number</Label>
                            <Input id="firm-phone" defaultValue="+1-202-555-0101" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firm-email">Email</Label>
                            <Input id="firm-email" type="email" defaultValue="contact@johnsonlegal.ca" />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
