'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Share2, Mail, MessageSquare, Phone, Star } from "lucide-react";

type LawyerProfileCardProps = {
    lawyer: {
        id: number;
        name: string;
        role: string;
        avatar: string;
        email: string;
        phone: string;
        stats: {
            label: string;
            value: string;
        }[];
        specialties: string[];
    };
    onConnect: (lawyerId: number) => void;
    onMessage?: () => void;
};

export function LawyerProfileCard({ lawyer, onConnect, onMessage }: LawyerProfileCardProps) {
    const displayedStats = lawyer.stats.filter(
        stat => stat.label === 'Clients' || stat.label === 'Success Rate'
    );

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                    <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{lawyer.name}</h3>
                <p className="text-muted-foreground">{lawyer.role}</p>
                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} />
                    <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {displayedStats.map(stat => (
                        <div key={stat.label} className="bg-muted p-2 rounded text-center">
                            <p className="font-bold text-lg">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                        {lawyer.specialties.map(spec => (
                            <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => onConnect(lawyer.id)}>
                    <Share2 className="mr-2 h-4 w-4" /> Share Info & Connect
                </Button>
                <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={onMessage} disabled={!onMessage}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                    </Button>
                     <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
