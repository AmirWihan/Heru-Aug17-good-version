'use client';

import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Rocket } from "lucide-react";

type TimelineStep = {
    title: string;
    status: 'Completed' | 'In Progress' | 'Upcoming';
    estimatedDuration: string;
    description: string;
    dueDate?: string;
};

type CaseTimelineProps = {
    timeline: TimelineStep[];
};

const statusConfig = {
    Completed: {
        icon: CheckCircle,
        className: "text-green-500",
        lineClassName: "bg-green-500",
    },
    'In Progress': {
        icon: Rocket,
        className: "text-primary animate-pulse",
        lineClassName: "bg-primary",
    },
    Upcoming: {
        icon: Circle,
        className: "text-muted-foreground",
        lineClassName: "bg-border",
    },
};

export function CaseTimeline({ timeline }: CaseTimelineProps) {
    return (
        <div className="space-y-8">
            {timeline.map((step, index) => {
                const config = statusConfig[step.status];
                const Icon = config.icon;
                return (
                    <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-muted", config.className)}>
                                <Icon className="h-5 w-5" />
                            </div>
                            {index < timeline.length - 1 && (
                                <div className={cn("w-px flex-1", config.lineClassName)}></div>
                            )}
                        </div>
                        <div className="flex-1 pb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-lg">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                                <div className="text-right text-sm text-muted-foreground whitespace-nowrap pl-4">
                                    <p className="font-medium">{step.estimatedDuration}</p>
                                    {step.dueDate && <p className="text-xs">Due: {step.dueDate}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
