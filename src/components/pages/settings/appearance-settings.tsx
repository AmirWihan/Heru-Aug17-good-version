
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalData } from "@/context/GlobalDataContext";
import { themes } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export function AppearanceSettings() {
    const { theme, setTheme } = useGlobalData();

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
                 <div>
                    <h3 className="text-lg font-medium">Theme Color</h3>
                    <p className="text-sm text-muted-foreground">Select the primary color for your workspace.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {themes.map((t) => (
                            <TooltipProvider key={t.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => setTheme(t.id)}
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
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
    );
}
