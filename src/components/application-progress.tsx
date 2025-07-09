'use client';

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { UserCheck, FileStack, ClipboardList, CheckCircle2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

export const applicationSteps = [
    { name: 'Profile', icon: UserCheck },
    { name: 'Docs', icon: FileStack },
    { name: 'Review', icon: ClipboardList },
    { name: 'Biometrics', icon: CheckCircle2 },
    { name: 'Decision', icon: CheckCircle },
];

export type ApplicationStatus =
    | 'Profile Setup'
    | 'Awaiting Documents'
    | 'Pending Review'
    | 'In Review'
    | 'Biometrics Required'
    | 'Awaiting Decision'
    | 'Approved'
    | 'Rejected';

const statusToStepIndex: Record<ApplicationStatus, number> = {
    'Profile Setup': 0,
    'Awaiting Documents': 1,
    'Pending Review': 1,
    'In Review': 2,
    'Biometrics Required': 3,
    'Awaiting Decision': 4,
    'Approved': 4,
    'Rejected': 4,
};

interface ApplicationProgressProps {
    currentStatus: ApplicationStatus;
}

export function ApplicationProgress({ currentStatus }: ApplicationProgressProps) {
    const activeIndex = statusToStepIndex[currentStatus] ?? 0;
    const progressValue = activeIndex > 0 ? (activeIndex / (applicationSteps.length - 1)) * 100 : 5;

    const getStepStatus = (index: number) => {
        if (index < activeIndex) return 'complete';
        if (index === activeIndex) return 'active';
        return 'incomplete';
    };

    return (
        <Card>
            <CardHeader>
                <h3 className="font-semibold text-base">Application Progress</h3>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Progress value={progressValue} className="h-2" indicatorClassName="bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>
                <div className="flex justify-between">
                    {applicationSteps.map((step, index) => {
                        const status = getStepStatus(index);
                        return (
                            <div key={step.name} className="flex flex-col items-center w-1/5">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs",
                                    status === 'complete' && "bg-primary border-primary text-primary-foreground",
                                    status === 'active' && "bg-accent border-accent text-accent-foreground animate-pulse",
                                    status === 'incomplete' && "bg-muted border-border text-muted-foreground"
                                )}>
                                    <step.icon className="h-4 w-4" />
                                </div>
                                <p className="text-xs text-center mt-1 text-muted-foreground">{step.name}</p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
