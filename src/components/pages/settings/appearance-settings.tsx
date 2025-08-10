
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalData } from "@/context/GlobalDataContext";
import { themes } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";


export function AppearanceSettings() {
    const { userProfile, getWorkspaceThemeId, setWorkspaceThemeId, getWorkspaceThemeMode, setWorkspaceThemeMode } = useGlobalData();
    const { toast } = useToast();

    const workspaceKey = (() => {
        if (userProfile?.authRole === 'lawyer' && (userProfile as any).firmName) return (userProfile as any).firmName as string;
        if (userProfile?.authRole === 'superadmin') return 'superadmin';
        return 'platform';
    })();

    const theme = getWorkspaceThemeId(workspaceKey);
    const mode = getWorkspaceThemeMode(workspaceKey);

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your appearance settings have been updated.",
        });
    };

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
                    <div className="grid grid-cols-3 gap-2 mt-4">
                         <Button
                           variant={mode === 'light' ? 'default' : 'outline'}
                           onClick={() => setWorkspaceThemeMode(workspaceKey, 'light')}
                         >Light</Button>
                         <Button
                           variant={mode === 'dark' ? 'default' : 'outline'}
                           onClick={() => setWorkspaceThemeMode(workspaceKey, 'dark')}
                         >Dark</Button>
                         <Button
                           variant={mode === 'system' ? 'default' : 'outline'}
                           onClick={() => setWorkspaceThemeMode(workspaceKey, 'system')}
                         >System</Button>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-medium">Theme Color</h3>
                    <p className="text-sm text-muted-foreground">Select the primary color for your workspace.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {themes.map((t) => (
                            <TooltipProvider key={t.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => setWorkspaceThemeId(workspaceKey, t.id)}
                                            className={cn(
                                                "h-8 w-8 rounded-full border-2 flex items-center justify-center",
                                                theme === t.id ? 'border-primary' : 'border-muted'
                                            )}
                                            style={{ backgroundColor: t.colors.primary }}
                                        >
                                            {theme === t.id && <Check className="h-4 w-4 text-primary-foreground" />}
                                            <span className="sr-only">{t.name}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
