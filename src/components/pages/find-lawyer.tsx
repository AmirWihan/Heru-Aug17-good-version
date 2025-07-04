'use client';
import { useState } from "react";
import { teamMembers } from "@/lib/data";
import { Search } from "lucide-react";
import { LawyerProfileCard } from "@/components/lawyer-profile-card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FindLawyerPage() {
    const { toast } = useToast();
    const [connectedLawyers, setConnectedLawyers] = useState<number[]>([]);

    const handleConnect = (lawyerId: number) => {
        if (!connectedLawyers.includes(lawyerId)) {
            setConnectedLawyers([...connectedLawyers, lawyerId]);
            toast({ title: "Successfully Connected!", description: `You are now connected with ${teamMembers.find(l => l.id === lawyerId)?.name}.` });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Find an Immigration Professional</CardTitle>
                <CardDescription>Browse and connect with experienced lawyers and consultants.</CardDescription>
                <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or specialty..." className="pl-10" />
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map(lawyer => (
                    <LawyerProfileCard key={lawyer.id} lawyer={lawyer} onConnect={handleConnect} />
                ))}
            </CardContent>
        </Card>
    );
}
