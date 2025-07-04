'use client';
import { useState, useMemo } from "react";
import { teamMembers } from "@/lib/data";
import { Search, X } from "lucide-react";
import { LawyerProfileCard } from "@/components/lawyer-profile-card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FindLawyerPage() {
    const { toast } = useToast();
    const [connectedLawyers, setConnectedLawyers] = useState<number[]>([]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [specialty, setSpecialty] = useState("all");
    const [location, setLocation] = useState("all");
    const [experience, setExperience] = useState("all");
    const [successRate, setSuccessRate] = useState("all");

    const specialties = useMemo(() => ['all', ...Array.from(new Set(teamMembers.flatMap(l => l.specialties)))], []);
    const locations = useMemo(() => ['all', ...Array.from(new Set(teamMembers.map(l => l.location)))], []);

    const filteredLawyers = useMemo(() => {
        return teamMembers.filter(lawyer => {
            const nameMatch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase());
            const specialtyMatch = specialty === 'all' || lawyer.specialties.includes(specialty);
            const locationMatch = location === 'all' || lawyer.location === location;
            const experienceMatch = experience === 'all' || lawyer.yearsOfPractice >= parseInt(experience);
            const successRateMatch = successRate === 'all' || lawyer.successRate >= parseInt(successRate);
            
            return nameMatch && specialtyMatch && locationMatch && experienceMatch && successRateMatch;
        });
    }, [searchTerm, specialty, location, experience, successRate]);

    const handleConnect = (lawyerId: number) => {
        if (!connectedLawyers.includes(lawyerId)) {
            setConnectedLawyers([...connectedLawyers, lawyerId]);
            toast({ title: "Successfully Connected!", description: `You are now connected with ${teamMembers.find(l => l.id === lawyerId)?.name}.` });
        }
    };
    
    const resetFilters = () => {
        setSearchTerm("");
        setSpecialty("all");
        setLocation("all");
        setExperience("all");
        setSuccessRate("all");
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Find an Immigration Professional</CardTitle>
                <CardDescription>Browse and connect with experienced lawyers and consultants.</CardDescription>
                <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
                    <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger><SelectValue placeholder="Filter by Specialty" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Specialties</SelectItem>
                            {specialties.filter(s => s !== 'all').map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger><SelectValue placeholder="Filter by Location" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.filter(l => l !== 'all').map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger><SelectValue placeholder="Years of Experience" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Experience</SelectItem>
                            <SelectItem value="5">5+ Years</SelectItem>
                            <SelectItem value="10">10+ Years</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={successRate} onValueChange={setSuccessRate}>
                        <SelectTrigger><SelectValue placeholder="Success Rate" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Success Rate</SelectItem>
                            <SelectItem value="95">95%+ Success</SelectItem>
                            <SelectItem value="90">90%+ Success</SelectItem>
                            <SelectItem value="85">85%+ Success</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={resetFilters}>
                        <X className="mr-2 h-4 w-4" /> Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.length > 0 ? filteredLawyers.map(lawyer => (
                    <LawyerProfileCard key={lawyer.id} lawyer={lawyer} onConnect={handleConnect} />
                )) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p className="font-semibold">No professionals match your criteria.</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
