
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExportPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Application Code Export</CardTitle>
                        <CardDescription>
                            This feature has been temporarily disabled to ensure application stability. Please use the "Download Project" feature in the editor for a full code export.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                            <p className="text-muted-foreground">Export functionality is currently disabled.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
