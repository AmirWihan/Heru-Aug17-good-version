
'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalData } from "@/context/GlobalDataContext";
import { TeamMember } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Crown, DollarSign, Languages, Mail, MapPin, Phone, Twitter, Globe, Users, Award, Briefcase, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LawyerConnectDialog } from "@/components/pages/lawyer-connect-dialog";

const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ElementType }) => {
    const Icon = icon;
    return (
        <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
            <div className="bg-primary/10 p-3 rounded-full">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    );
};

export default function LawyerProfilePage() {
    const router = useRouter();
    const params = useParams();
    const { teamMembers } = useGlobalData();
    const lawyerId = parseInt(params.id as string, 10);
    const lawyer = teamMembers.find(m => m.id === lawyerId) as TeamMember;

    const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

    if (!lawyer) {
        notFound();
    }
    
    const isEnterprise = lawyer.plan === 'Enterprise';

    return (
        <>
            <div className="space-y-6">
                 <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Search Results
                </Button>

                <Card className="overflow-hidden">
                    <div className="bg-muted/50 p-8 flex flex-col md:flex-row items-center gap-8">
                        <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
                            <AvatarImage src={lawyer.avatar} />
                            <AvatarFallback>{lawyer.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h1 className="text-3xl font-bold font-headline">{lawyer.name}</h1>
                                {isEnterprise && <Crown className="h-7 w-7 text-yellow-500" />}
                            </div>
                            <p className="text-lg text-muted-foreground">{lawyer.role} at {lawyer.firmName}</p>
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start items-center gap-4">
                                <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground" /> {lawyer.location}</div>
                                <div className="flex items-center gap-1.5"><Award className="h-4 w-4 text-muted-foreground" /> Reg #: {lawyer.registrationNumber}</div>
                                <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-muted-foreground" /> Team of {lawyer.numEmployees}</div>
                                 <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-muted-foreground" /> {lawyer.consultationType} Consultation</div>
                            </div>
                             <div className="mt-4 flex justify-center md:justify-start gap-2">
                                {(lawyer.socials || []).map(social => (
                                    <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            {social.platform === 'linkedin' && <Briefcase className="h-4 w-4" />}
                                            {social.platform === 'twitter' && <Twitter className="h-4 w-4" />}
                                            {social.platform === 'website' && <Globe className="h-4 w-4" />}
                                        </Button>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Button size="lg" onClick={() => setIsConnectDialogOpen(true)}>Share Info & Connect</Button>
                        </div>
                    </div>
                </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lawyer.stats.map(stat => <StatCard key={stat.label} {...stat} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>About {lawyer.name.split(' ')[0]}</CardTitle></CardHeader>
                            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                                <p>With {lawyer.yearsOfPractice} years of dedicated experience in Canadian immigration law, {lawyer.name} has a proven track record of success. Specializing in {lawyer.specialties.join(', ')}, they offer expert guidance tailored to your unique situation.</p>
                                <p>{lawyer.name} is a member in good standing with the {lawyer.licenseNumber.split('-')[0]} and CICC, ensuring the highest standards of professionalism and ethics.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Client Testimonials</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-l-4 border-primary pl-4">
                                    <p className="italic">"{lawyer.name} was incredibly knowledgeable and supportive throughout my entire Express Entry application. I couldn't have done it without them."</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="font-semibold">- Alex M.</p>
                                        <div className="flex">{[...Array(5)].map((_,i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current"/>)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Community Involvement & Gallery</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                {(lawyer.gallery || []).map(item => (
                                    <div key={item.id}>
                                        <Image src={item.src} alt={item.alt} width={600} height={400} className="rounded-lg object-cover aspect-video" data-ai-hint={item.dataAiHint}/>
                                        <p className="text-sm text-muted-foreground mt-2">{item.alt}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                             <CardHeader><CardTitle>Specialties</CardTitle></CardHeader>
                             <CardContent className="flex flex-wrap gap-2">
                                {lawyer.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader><CardTitle>Languages Spoken</CardTitle></CardHeader>
                             <CardContent className="flex flex-wrap gap-2">
                                {lawyer.languages.map(lang => <Badge key={lang} variant="outline">{lang}</Badge>)}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <LawyerConnectDialog 
                lawyer={lawyer}
                isOpen={isConnectDialogOpen}
                onOpenChange={setIsConnectDialogOpen}
            />
        </>
    )
}
