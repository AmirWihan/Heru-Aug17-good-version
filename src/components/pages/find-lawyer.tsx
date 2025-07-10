
'use client';
import { useState, useMemo } from "react";
import { teamMembers } from "@/lib/data";
import { Search, X } from "lucide-react";
import { LawyerProfileCard } from "@/components/lawyer-profile-card";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function FindLawyerPage() {
    const router = useRouter();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [specialty, setSpecialty] = useState("all");
    const [location, setLocation] = useState("all");
    const [language, setLanguage] = useState("all");
    const [consultation, setConsultation] = useState("all");

    const specialties = useMemo(() => ['all', ...Array.from(new Set(teamMembers.flatMap(l => l.specialties)))], []);
    const locations = useMemo(() => ['all', ...Array.from(new Set(teamMembers.map(l => l.location)))], []);
    const languages = useMemo(() => ['all', ...Array.from(new Set(teamMembers.flatMap(l => l.languages)))], []);

    const filteredLawyers = useMemo(() => {
        const filtered = teamMembers.filter(lawyer => {
            if (lawyer.type !== 'legal' || lawyer.status !== 'Active') {
                return false;
            }
            const nameMatch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase());
            const specialtyMatch = specialty === 'all' || lawyer.specialties.includes(specialty);
            const locationMatch = location === 'all' || lawyer.location === location;
            const languageMatch = language === 'all' || lawyer.languages.includes(language);
            const consultationMatch = consultation === 'all' || lawyer.consultationType === consultation;
            
            return nameMatch && specialtyMatch && locationMatch && languageMatch && consultationMatch;
        });

        // Sort to bring Enterprise lawyers to the front
        return filtered.sort((a, b) => {
            const aIsEnterprise = a.plan === 'Enterprise';
            const bIsEnterprise = b.plan === 'Enterprise';
            if (aIsEnterprise === bIsEnterprise) return 0;
            return aIsEnterprise ? -1 : 1;
        });

    }, [searchTerm, specialty, location, language, consultation]);

    const resetFilters = () => {
        setSearchTerm("");
        setSpecialty("all");
        setLocation("all");
        setLanguage("all");
        setConsultation("all");
    };

    const handleViewProfile = (lawyerId: number) => {
        router.push(`/client/lawyer/${lawyerId}`);
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
                            {specialties.filter(s => s !== 'all' && s !== 'Awaiting Activation').map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger><SelectValue placeholder="Filter by Location" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.filter(l => l !== 'all').map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Language</SelectItem>
                            {languages.filter(l => l !== 'all' && l).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={consultation} onValueChange={setConsultation}>
                        <SelectTrigger><SelectValue placeholder="Consultation Fee" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Fee</SelectItem>
                            <SelectItem value="Free">Free Consultation</SelectItem>
                            <SelectItem value="Paid">Paid Consultation</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={resetFilters}>
                        <X className="mr-2 h-4 w-4" /> Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLawyers.length > 0 ? filteredLawyers.map(lawyer => (
                    <LawyerProfileCard 
                        key={lawyer.id} 
                        lawyer={lawyer} 
                        onViewProfile={() => handleViewProfile(lawyer.id)}
                        isEnterprise={lawyer.plan === 'Enterprise'}
                    />
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
