'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, UserPlus, FilePlus2 } from "lucide-react";

export function DashboardScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
             <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Welcome back, Sarah!</h2>
                            <p className="text-muted-foreground text-sm">You have 5 new client applications.</p>
                        </div>
                        <Button>View Applications <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>

                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive text-base">
                                <ShieldAlert className="h-5 w-5"/> AI Risk Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold">James Wilson</p>
                                    <p className="text-destructive">Missing "Proof of Funds" document.</p>
                                </div>
                                <Button size="sm" variant="outline">View</Button>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold">Adebola Okonjo</p>
                                    <p className="text-destructive">Case is stale (no activity in 30+ days).</p>
                                </div>
                                <Button size="sm" variant="outline">View</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                             <CardHeader>
                                <h3 className="font-semibold text-base">Quick Actions</h3>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="h-auto flex-col py-2 gap-1 text-xs"><UserPlus className="h-5 w-5 mb-1"/> New Client</Button>
                                <Button variant="outline" size="sm" className="h-auto flex-col py-2 gap-1 text-xs"><FilePlus2 className="h-5 w-5 mb-1"/> New Application</Button>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <h3 className="font-semibold text-base">Recent Activity</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Logged "Call" for Elena Rodriguez</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Card>
    )
}
