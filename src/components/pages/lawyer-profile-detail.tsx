'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { TeamMember } from "@/lib/data";
import { Mail, MessageSquare, Phone, Share2, Star, Crown, ArrowLeft, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export function LawyerProfileDetail({ lawyer }: { lawyer: TeamMember }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleConnect = (lawyerId: number) => {
        toast({ title: "Successfully Connected!", description: `You are now connected with ${lawyer.name}.` });
    };

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Directory
                </Button>
            </div>
            <Card>
                <CardHeader>
                     <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <Avatar className="w-32 h-32 border-4 border-primary">
                            <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                            <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 justify-center md:justify-start">
                                <CardTitle className="text-3xl">{lawyer.name}</CardTitle>
                                {lawyer.plan === 'Enterprise' && <Badge variant="warning"><Crown className="mr-1.5 h-3 w-3" /> Enterprise Partner</Badge>}
                            </div>
                            <CardDescription className="text-lg">{lawyer.role}</CardDescription>
                            <div className="flex items-center gap-1 text-yellow-500 mt-1 justify-center md:justify-start">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} />
                                <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {lawyer.name} is a seasoned immigration lawyer with {lawyer.yearsOfPractice} years of experience, specializing in a wide range of immigration matters. With a success rate of {lawyer.successRate}%, {lawyer.name.split(' ')[0]} is dedicated to providing clients with expert guidance and personalized strategies to navigate the complexities of Canadian immigration.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Specialties</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {lawyer.specialties.map(spec => (
                                    <Badge key={spec} variant="secondary" className="text-sm px-3 py-1">{spec}</Badge>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Additional Services & Community Engagement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-2">Service Highlights</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {lawyer.specialties?.includes('Post-Landing Services') && <Badge variant="outline">Post-Landing Services</Badge>}
                                        {lawyer.specialties?.includes('Court Representation') && <Badge variant="outline">Court Representation</Badge>}
                                        {lawyer.specialties?.includes('Legal Aid') && <Badge variant="outline">Legal Aid</Badge>}
                                    </div>
                                </div>
                                {(lawyer.gallery || []).length > 0 &&
                                    <div>
                                        <h4 className="font-semibold mb-2">Firm Gallery</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {(lawyer.gallery || []).map((photo) => (
                                                <div key={photo.id} className="relative aspect-[3/2] overflow-hidden rounded-lg">
                                                    <Image
                                                        src={photo.src}
                                                        alt={photo.alt}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                        className="object-cover"
                                                        data-ai-hint={photo.dataAiHint}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-1 space-y-6">
                         <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {lawyer.stats.map(stat => (
                                    <div key={stat.label} className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{stat.label}</span>
                                        <span className="font-semibold">{stat.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact & Connect</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" onClick={() => handleConnect(lawyer.id)}>
                                    <Share2 className="mr-2 h-4 w-4" /> Share Info & Connect
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                                </Button>
                                 {lawyer.firmWebsite && (
                                    <a href={lawyer.firmWebsite} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full">
                                            <Globe className="mr-2 h-4 w-4" /> Visit Website
                                        </Button>
                                    </a>
                                )}
                                 <div className="flex w-full gap-2 pt-2">
                                    <Button variant="outline" size="icon" className="flex-1">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="flex-1">
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
