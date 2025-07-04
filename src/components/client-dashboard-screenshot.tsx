
'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileStack, ClipboardList, CheckCircle2, UserCheck, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const applicationSteps = [
    { name: 'Profile', icon: UserCheck, status: 'complete' as const },
    { name: 'Docs', icon: FileStack, status: 'complete' as const },
    { name: 'Review', icon: ClipboardList, status: 'active' as const },
    { name: 'Biometrics', icon: CheckCircle2, status: 'incomplete' as const },
    { name: 'Decision', icon: CheckCircle, status: 'incomplete' as const },
];

export function ClientDashboardScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold">Welcome, John! 👋</h2>
                        <p className="text-white/90 text-sm mt-1">Your application status is: In Review</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <h3 className="font-semibold text-base">Application Progress</h3>
                        </CardHeader>
                        <CardContent>
                             <div className="mb-4">
                                <Progress value={50} className="h-2" indicatorClassName="bg-gradient-to-r from-emerald-400 to-cyan-400" />
                            </div>
                            <div className="flex justify-between">
                                {applicationSteps.map((step) => (
                                    <div key={step.name} className="flex flex-col items-center w-1/5">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs",
                                            step.status === 'complete' && "bg-primary border-primary text-primary-foreground",
                                            step.status === 'active' && "bg-accent border-accent text-accent-foreground animate-pulse",
                                            step.status === 'incomplete' && "bg-muted border-border text-muted-foreground"
                                        )}>
                                            <step.icon className="h-4 w-4" />
                                        </div>
                                        <p className="text-xs text-center mt-1 text-muted-foreground">{step.name}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                             <CardHeader>
                                <h3 className="font-semibold text-base">Quick Actions</h3>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full justify-start text-xs"><FileText className="mr-2 h-4 w-4"/> View Documents</Button>
                                <Button variant="outline" size="sm" className="w-full justify-start text-xs"><MessageSquare className="mr-2 h-4 w-4"/> Message Lawyer</Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold text-base">Next Appointment</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="bg-muted text-primary rounded-md p-2 flex flex-col items-center">
                                        <span className="text-xs font-bold">JUL</span>
                                        <span className="text-lg font-bold">28</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs">Follow-up with Emma</p>
                                        <p className="text-xs text-muted-foreground">July 28, 2024 at 2:00 PM</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Card>
    );
}
