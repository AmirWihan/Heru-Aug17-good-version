'use client';
import { useState } from "react";
import { teamMembers } from "@/lib/data";
import { Users } from "lucide-react";
import { LawyerProfileCard } from "@/components/lawyer-profile-card";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function MyLawyersPage({ setPage }: { setPage: (page: string) => void }) {
    const router = useRouter();
    // For demo, assume client is connected to first lawyer
    const [connectedLawyers, setConnectedLawyers] = useState<number[]>([1]);

    const handleViewProfile = (lawyer: typeof teamMembers[number]) => {
        router.push(`/client/lawyer/${lawyer.id}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Lawyers</CardTitle>
                <CardDescription>Your dedicated legal team. Ready to help.</CardDescription>
            </CardHeader>
            <CardContent>
                {connectedLawyers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.filter(l => connectedLawyers.includes(l.id)).map(lawyer => (
                        <LawyerProfileCard key={lawyer.id} lawyer={lawyer} onViewProfile={handleViewProfile} />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 mb-4" />
                        <p className="font-semibold">You haven't connected with any lawyers yet.</p>
                        <Button variant="link" onClick={() => setPage('find-lawyer')}>Find a lawyer to get started</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
