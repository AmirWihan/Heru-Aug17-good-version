
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload } from "lucide-react";

export function DataSettings() {
    const { toast } = useToast();

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your data export is being prepared. You will receive an email with a download link shortly.",
        });
    };

    const handleImport = () => {
        toast({
            title: "Import Started",
            description: "Your file is being processed. You will be notified upon completion.",
        });
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Import Clients</CardTitle>
                    <CardDescription>
                        Bulk import client data from a CSV or Excel file. This is useful when migrating from another platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="import-file">Upload File (.csv, .xlsx)</Label>
                        <Input id="import-file" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Ensure your file has columns for 'name', 'email', 'phone', and 'caseType'. 
                        <a href="#" className="underline text-primary ml-1">Download a sample template</a>.
                    </p>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button onClick={handleImport}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Data
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>
                        Export all your firm's data, including client profiles, documents, tasks, and communications.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Your data will be provided as a zip file containing multiple CSV files.
                    </p>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Request Data Export
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
