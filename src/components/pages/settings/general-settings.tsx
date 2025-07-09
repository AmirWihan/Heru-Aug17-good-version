
'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGlobalData } from '@/context/GlobalDataContext';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import type { TeamMember } from '@/lib/data';

export function GeneralSettings() {
    const { toast } = useToast();
    const { userProfile, setWorkspaceLogo, updateTeamMember } = useGlobalData();
    const lawyerProfile = userProfile as TeamMember;

    const [firmName, setFirmName] = useState(lawyerProfile?.firmName || '');
    const [firmAddress, setFirmAddress] = useState(lawyerProfile?.firmAddress || '');
    const [firmPhone, setFirmPhone] = useState(lawyerProfile?.phone || '');
    const [firmEmail, setFirmEmail] = useState(lawyerProfile?.email || '');
    
    useEffect(() => {
        setFirmName(lawyerProfile?.firmName || '');
        setFirmAddress(lawyerProfile?.firmAddress || '');
        setFirmPhone(lawyerProfile?.phone || '');
        setFirmEmail(lawyerProfile?.email || '');
    }, [lawyerProfile]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!userProfile || !lawyerProfile.firmName) {
            toast({ title: "Error", description: "Firm information is not available."});
            return;
        }

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
                setWorkspaceLogo(lawyerProfile.firmName!, newLogoSrc);
                toast({
                    title: "Logo updated",
                    description: "Your new workspace logo has been applied."
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        if (!lawyerProfile) return;

        const updatedProfile = {
            ...lawyerProfile,
            firmName,
            firmAddress,
            phone: firmPhone,
            email: firmEmail,
        };

        updateTeamMember(updatedProfile);
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
                        <Input id="firm-name" value={firmName} onChange={(e) => setFirmName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="firm-address">Address</Label>
                        <Textarea id="firm-address" value={firmAddress} onChange={(e) => setFirmAddress(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firm-phone">Phone Number</Label>
                            <Input id="firm-phone" value={firmPhone} onChange={(e) => setFirmPhone(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firm-email">Email</Label>
                            <Input id="firm-email" type="email" value={firmEmail} onChange={(e) => setFirmEmail(e.target.value)} />
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
