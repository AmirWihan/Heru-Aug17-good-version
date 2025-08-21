'use client';

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPlus, Phone, CheckCircle, XCircle } from "lucide-react";

export const leadSteps = [
  { name: 'New', icon: UserPlus as React.ElementType },
  { name: 'Contacted', icon: Phone as React.ElementType },
  { name: 'Qualified', icon: CheckCircle as React.ElementType },
  { name: 'Unqualified', icon: XCircle as React.ElementType },
] as const;

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified';

interface LeadStatusProgressProps {
  currentStatus: LeadStatus;
  onChange?: (next: LeadStatus) => void;
}

export function LeadStatusProgress({ currentStatus, onChange }: LeadStatusProgressProps) {
  const statusToIndex: Record<LeadStatus, number> = {
    New: 0,
    Contacted: 1,
    Qualified: 2,
    Unqualified: 3,
  };

  const activeIndex = statusToIndex[currentStatus] ?? 0;
  const progressValue = activeIndex > 0 ? (activeIndex / (leadSteps.length - 1)) * 100 : 5;

  const getStepStatus = (index: number) => {
    if (index < activeIndex) return 'complete' as const;
    if (index === activeIndex) return 'active' as const;
    return 'incomplete' as const;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-base">Lead Progress</h3>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progressValue} className="h-2" indicatorClassName="bg-gradient-to-r from-emerald-400 to-cyan-400" />
        </div>
        <div className="flex justify-between">
          {leadSteps.map((step, index) => {
            const status = getStepStatus(index);
            const StepIcon = step.icon;
            return (
              <button
                key={step.name}
                type="button"
                className="flex flex-col items-center w-1/4 focus:outline-none"
                onClick={() => onChange?.(step.name as LeadStatus)}
                title={`Set status to ${step.name}`}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs transition-colors",
                    status === 'complete' && "bg-primary border-primary text-primary-foreground",
                    status === 'active' && "bg-accent border-accent text-accent-foreground animate-pulse",
                    status === 'incomplete' && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground">{step.name}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
