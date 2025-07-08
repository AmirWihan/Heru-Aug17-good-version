'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export function AiToolsScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>AI Application Checker</CardTitle>
                    <CardDescription>Analyze application documents for missing information, errors, or inconsistencies.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="app-type">Application Type</Label>
                        <Select defaultValue="Permanent Residency">
                            <SelectTrigger id="app-type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Permanent Residency">Permanent Residency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="app-doc-text">Document Text</Label>
                        <Textarea id="app-doc-text" placeholder="Paste the content of the application document here." rows={5} defaultValue="...client has indicated they have 2 years of foreign work experience but has only listed one employer for 1.5 years..." />
                    </div>
                    <Button>
                        <Sparkles className="mr-2 h-4 w-4" /> Check Application
                    </Button>
                    <div className="mt-4 space-y-4 rounded-lg border bg-muted/50 p-4">
                        <h4 className="font-bold">Analysis Results:</h4>
                        <div>
                            <h5 className="font-semibold">Inconsistencies Found:</h5>
                            <ul className="list-disc pl-5 text-sm text-yellow-600">
                                <li>Work experience duration mismatch.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}
