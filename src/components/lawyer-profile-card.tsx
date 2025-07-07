'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Crown, MapPin, Award, Users } from "lucide-react";

type LawyerProfileCardProps = {
    lawyer: {
        id: number;
        name: string;
        role: string;
        avatar: string;
        location: string;
        registrationNumber: string;
        numEmployees?: number;
    };
    onViewProfile: (lawyerId: number) => void;
    isEnterprise?: boolean;
};

export function LawyerProfileCard({ lawyer, onViewProfile, isEnterprise }: LawyerProfileCardProps) {

    return (
        <Card className={cn(
            "flex flex-col relative hover:shadow-lg transition-shadow duration-300",
            isEnterprise && "border-primary shadow-primary/20"
        )}>
            {isEnterprise && (
                <Badge variant="warning" className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Crown className="mr-1.5 h-3 w-3" />
                    Enterprise Partner
                </Badge>
            )}
            <CardHeader className="items-center text-center pt-8">
                <Avatar className="w-20 h-20 mb-3">
                    <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                    <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold">{lawyer.name}</h3>
                <p className="text-sm text-muted-foreground">{lawyer.role}</p>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground px-4">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{lawyer.location}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 shrink-0" />
                    <span>Reg #: {lawyer.registrationNumber}</span>
                </div>
                 {lawyer.numEmployees && (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>Team of {lawyer.numEmployees}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4">
                <Button className="w-full" onClick={() => onViewProfile(lawyer.id)}>
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
