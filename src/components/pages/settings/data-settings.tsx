
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

export function DataSettings() {
    const { toast } = useToast();

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your data export is being prepared. You will receive an email with a download link shortly.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export your workspace data.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    You can request an export of all your firm's data, including client profiles, documents, tasks, and communications. The data will be provided in CSV format.
                </p>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Request Data Export
                </Button>
            </CardFooter>
        </Card>
    );
}
