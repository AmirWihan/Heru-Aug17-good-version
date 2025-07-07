'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, FileHeart, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { ClientDashboardScreenshot } from '@/components/client-dashboard-screenshot';
import { LawyerProfileCard } from '@/components/lawyer-profile-card';
import { useRouter } from 'next/navigation';
import { TestimonialCard } from '@/components/testimonial-card';
import { testimonials } from '@/lib/data';

const clientTestimonial = testimonials.find(t => t.role === 'client');

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
            <section className="py-20 md:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">
                        Your Clearest Path to Canada.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        The immigration process is complex. ImmiAssist simplifies it. Connect with verified legal experts, track your application with an AI-powered timeline, and manage your documents securely in one place.
                    </p>
                    <div className="mt-8">
                        <Link href="/register">
                            <Button size="lg">Create Your Free Account</Button>
                        </Link>
                    </div>
                </div>
            </section>

             {/* How it works Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                         <h2 className="text-3xl font-bold font-headline">Your Journey, Simplified</h2>
                         <p className="mt-4 text-muted-foreground">We guide you through every critical stage of your application, from planning to landing.</p>
                    </div>
                    <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                               <FileHeart className="h-8 w-8" />
                            </div>
                            <h3 className="font-semibold text-lg">1. Build Your Profile</h3>
                            <p className="text-muted-foreground mt-2">Start by completing our smart intake form and CRS score calculator to understand your standing.</p>
                        </div>
                         <div className="flex flex-col items-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                               <Search className="h-8 w-8" />
                            </div>
                            <h3 className="font-semibold text-lg">2. Find Your Expert</h3>
                            <p className="text-muted-foreground mt-2">Browse our directory of verified lawyers. Share your profile securely and connect with the right professional for your case.</p>
                        </div>
                         <div className="flex flex-col items-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                               <Users className="h-8 w-8" />
                            </div>
                            <h3 className="font-semibold text-lg">3. Collaborate & Track</h3>
                            <p className="text-muted-foreground mt-2">Use your secure portal to upload documents, message your lawyer, and track every milestone on your AI-powered timeline.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Feature 1: AI Timeline */}
             <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                     <div className="md:order-2 space-y-4">
                        <h2 className="text-3xl font-bold font-headline">Clarity at Every Step</h2>
                        <p className="text-lg text-muted-foreground">
                           No more guessing games. Our AI-powered timeline gives you a personalized, estimated roadmap of your entire immigration journey, from document submission to final decision.
                        </p>
                        <ul className="space-y-2 pt-2">
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Personalized Milestones</span></li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Real-time Status Updates</span></li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Estimated Processing Times</span></li>
                        </ul>
                    </div>
                    <div className="md:order-1">
                        <ClientDashboardScreenshot />
                    </div>
                </div>
            </section>
            
            {/* Testimonial Section */}
            {clientTestimonial &&
                <section className="py-20">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <TestimonialCard testimonial={clientTestimonial} />
                    </div>
                </section>
            }

            {/* Final CTA */}
            <section className="py-20 border-t bg-muted/30">
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
