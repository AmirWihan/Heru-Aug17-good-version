
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRight, Crown, MapPin, Award, Users, Languages, DollarSign, Check } from "lucide-react";

type LawyerProfileCardProps = {
    lawyer: {
        id: number;
        name: string;
        role: string;
        avatar: string;
        location: string;
        registrationNumber: string;
        numEmployees?: number;
        languages?: string[];
        consultationType?: 'Free' | 'Paid';
        plan?: string;
    };
    onViewProfile: (lawyer: LawyerProfileCardProps['lawyer']) => void;
    isEnterprise?: boolean;
};

export function LawyerProfileCard({ lawyer, onViewProfile, isEnterprise }: LawyerProfileCardProps) {

    return (
        <TooltipProvider>
            <Card className={cn(
                "flex flex-col relative hover:shadow-lg transition-shadow duration-300",
                isEnterprise && "border-primary shadow-primary/20"
            )}>
                {isEnterprise && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute top-2 right-2 text-yellow-500">
                                <Crown className="h-5 w-5" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Enterprise Partner - Powered by AI</p>
                        </TooltipContent>
                    </Tooltip>
                )}
                <CardHeader className="items-center text-center pt-6 pb-2">
                    <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                        <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-base font-bold">{lawyer.name}</h3>
                    <p className="text-xs text-muted-foreground">{lawyer.role}</p>
                </CardHeader>
                <CardContent className="space-y-1.5 text-xs text-muted-foreground px-4 pb-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{lawyer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="h-3 w-3 shrink-0" />
                        <span>Reg #: {lawyer.registrationNumber}</span>
                    </div>
                    {lawyer.numEmployees && (
                        <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 shrink-0" />
                            <span>Team of {lawyer.numEmployees}</span>
                        </div>
                    )}
                    {lawyer.languages && lawyer.languages.length > 0 && (
                         <div className="flex items-center gap-2">
                            <Languages className="h-3 w-3 shrink-0" />
                            <span>{lawyer.languages.join(', ')}</span>
                        </div>
                    )}
                    {lawyer.consultationType && (
                         <div className="flex items-center gap-2">
                            {lawyer.consultationType === 'Free' ? <Check className="h-3 w-3 shrink-0 text-green-500" /> : <DollarSign className="h-3 w-3 shrink-0" />}
                            <span>{lawyer.consultationType} Consultation</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 p-4 pt-2 mt-auto">
                    <Button size="sm" className="w-full" onClick={() => onViewProfile(lawyer)}>
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </TooltipProvider>
    );
}
