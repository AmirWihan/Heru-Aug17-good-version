
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useGlobalData } from "@/context/GlobalDataContext";
import { Download, Upload, ShieldAlert } from "lucide-react";

export function DataSettings() {
    const { toast } = useToast();
    const {
        getWorkspaceBackup,
        saveDailyBackup,
        isAutoBackupEnabled,
        setAutoBackupEnabled,
        getCurrentWorkspaceKey,
        getBackupSchedule,
        setBackupSchedule,
    } = useGlobalData();

    const key = getCurrentWorkspaceKey();

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

    const handleBackupNow = () => {
        saveDailyBackup(key);
        toast({ title: "Backup Saved", description: `Daily backup saved for workspace '${key}'.` });
    };

    const handleDownloadBackup = () => {
        const backup = getWorkspaceBackup(key);
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${key}-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Backup Downloaded", description: `Backup JSON downloaded for '${key}'.` });
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-blue-600" />
                        Workspace Backup
                    </CardTitle>
                    <CardDescription>Automatic daily backups at your scheduled time. Defaults to 10:00 PM local time.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={isAutoBackupEnabled()}
                            onCheckedChange={(val) => setAutoBackupEnabled(key, !!val)}
                        />
                        <span className="text-sm">Enable automatic daily backup</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Label htmlFor="backup-time" className="min-w-28">Backup time</Label>
                        <Input
                            id="backup-time"
                            type="time"
                            step={60}
                            value={getBackupSchedule()}
                            onChange={(e) => setBackupSchedule(key, e.target.value)}
                            className="w-40"
                        />
                        <span className="text-xs text-muted-foreground">Local time (24h)</span>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex items-center gap-2">
                    <Button variant="outline" onClick={handleBackupNow}>Backup Now</Button>
                    <Button onClick={handleDownloadBackup}>Download Latest</Button>
                </CardFooter>
            </Card>
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
