'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { ClientDashboardScreenshot } from '@/components/client-dashboard-screenshot';
import { LawyerProfileCard } from '@/components/lawyer-profile-card';
import { useRouter } from 'next/navigation';

export default function ForClientsPage() {
    const router = useRouter();
    const dummyLawyer = {
        id: 1, name: 'Emma Johnson', role: 'Senior Immigration Lawyer', avatar: 'https://i.pravatar.cc/150?u=emma',
        location: 'Toronto, ON', registrationNumber: 'ICCRC-R45678', numEmployees: 8
    };

    const handleViewProfile = (id: number) => {
        router.push(`/client/lawyer/${id}`);
    }

    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">
                        Navigate Your Canadian Dream
                        <br />
                        <span className="text-primary">with Confidence.</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Your immigration journey is complex. ImmiAssist simplifies it. Connect with verified legal experts, track your application progress with an AI-powered timeline, and manage your documents securely in one place.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg">Sign Up for Free</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature 1: Find Lawyers */}
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="inline-block bg-primary/10 text-primary p-3 rounded-full">
                            <Search className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold font-headline">Find Your Perfect Legal Match</h2>
                        <p className="text-lg text-muted-foreground">
                            Don't leave your future to chance. Browse our directory of vetted immigration lawyers and consultants. Filter by specialty, location, and success rate to find the expert who's right for you.
                        </p>
                        <ul className="space-y-2 pt-2">
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Verified Credentials</span></li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Transparent Success Rates</span></li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Direct and Secure Communication</span></li>
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full max-w-xs">
                             <LawyerProfileCard lawyer={dummyLawyer} onViewProfile={handleViewProfile} isEnterprise />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: AI Timeline */}
             <section className="py-16">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="md:order-2 space-y-4">
                        <h2 className="text-3xl font-bold font-headline">Clarity at Every Step</h2>
                        <p className="text-lg text-muted-foreground">
                           No more guessing games. Our AI-powered timeline gives you a personalized, estimated roadmap of your entire immigration journey, from document submission to final decision.
                        </p>
                    </div>
                    <div className="md:order-1">
                        <ClientDashboardScreenshot />
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
            <section className="py-20 border-t">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Start Your Journey?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Create your free account and take the first step towards Canada.</p>
                    <div className="mt-6">
                        <Link href="/register">
                            <Button size="lg">Sign Up Free <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
