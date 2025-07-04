import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, User, Wand2, Users as UsersIcon, FileStack, ShieldCheck, ArrowRight, CheckCircle, FileUp, MessageCircle, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const professionalFeatures = [
    {
        icon: <Wand2 className="h-8 w-8 text-primary" />,
        title: "AI-Powered Efficiency",
        description: "Draft messages, check applications, and summarize documents in seconds, freeing up valuable time.",
    },
    {
        icon: <UsersIcon className="h-8 w-8 text-primary" />,
        title: "Unified Client Management",
        description: "A single, organized dashboard for all client data, communication, documents, and case progress.",
    },
    {
        icon: <FileStack className="h-8 w-8 text-primary" />,
        title: "Streamlined Document Handling",
        description: "Request, upload, and manage all necessary immigration documents with automated checklists and reminders.",
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "Secure & Collaborative",
        description: "Communicate and share sensitive information securely with clients and team members in one platform.",
    },
];

const applicantFeatures = [
    {
        icon: <CheckCircle className="h-6 w-6 text-accent" />,
        title: "Track Your Application Status",
        description: "Get real-time updates on your case progress, from submission to decision.",
    },
    {
        icon: <FileUp className="h-6 w-6 text-accent" />,
        title: "Secure Document Uploads",
        description: "Easily upload all your required documents to a secure, centralized portal.",
    },
    {
        icon: <MessageCircle className="h-6 w-6 text-accent" />,
        title: "Direct Communication",
        description: "Message your lawyer or consultant directly through our secure messaging system.",
    },
    {
        icon: <CalendarClock className="h-6 w-6 text-accent" />,
        title: "Appointment Scheduling",
        description: "View and schedule appointments with your legal team without the back-and-forth.",
    }
];

export default function RoleSelectionPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-cyan-50 to-white dark:from-slate-900 dark:via-background dark:to-background">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="text-center pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="container mx-auto px-4">
                        <HeruLogoIcon className="mx-auto h-16 w-16" />
                        <h1 className="mt-6 font-headline text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-500 text-transparent bg-clip-text">
                            A Smarter Way to Navigate Immigration
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Welcome to Heru, the AI-powered platform that simplifies every step of the immigration journey for both professionals and applicants.
                        </p>
                        <p className="mt-8 font-semibold text-foreground">First, please select your role to continue.</p>

                        <div className="mt-8 grid max-w-4xl mx-auto md:grid-cols-2 gap-8">
                           <Link href="/dashboard-select?role=client">
                                <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 text-left h-full flex flex-col">
                                    <CardHeader className="flex flex-row items-center gap-4 p-6">
                                        <div className="flex-shrink-0 rounded-full bg-primary/10 p-4 text-primary">
                                            <User className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <CardTitle className="font-headline text-2xl font-bold">I'm an Applicant</CardTitle>
                                            <p className="text-muted-foreground text-sm">Start your journey.</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 flex-grow flex flex-col justify-between">
                                        <p className="text-muted-foreground">Track your application, upload documents, and connect with legal experts seamlessly.</p>
                                        <div className="mt-4 font-bold text-primary flex items-center">
                                            Go to Client Portal <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/dashboard-select?role=lawyer">
                                <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 text-left h-full flex flex-col">
                                     <CardHeader className="flex flex-row items-center gap-4 p-6">
                                        <div className="flex-shrink-0 rounded-full bg-accent/10 p-4 text-accent">
                                            <Briefcase className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <CardTitle className="font-headline text-2xl font-bold">I'm a Professional</CardTitle>
                                            <p className="text-muted-foreground text-sm">Manage your practice.</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6 flex-grow flex flex-col justify-between">
                                        <p className="text-muted-foreground">Manage clients, streamline cases, and leverage AI tools to enhance your practice.</p>
                                         <div className="mt-4 font-bold text-accent flex items-center">
                                            Go to CRM Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* Professional Features Section */}
                <section id="why-heru" className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto">
                             <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Why Professionals Choose Heru</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                We've built the tools you've always needed, powered by the technology of tomorrow.
                                Go beyond traditional CRMs and embrace a smarter way to work.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {professionalFeatures.map((feature, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-block bg-primary/10 p-4 rounded-full">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold font-headline">{feature.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Applicant Features Section */}
                <section id="for-applicants" className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="lg:pr-12">
                                <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Everything You Need, All in One Place</h2>
                                <p className="mt-4 text-lg text-muted-foreground">
                                    Our applicant portal is designed to give you clarity and control over your immigration process. Say goodbye to confusion and endless email chains.
                                </p>
                                <ul className="mt-8 space-y-6">
                                    {applicantFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 bg-accent/10 p-3 rounded-full">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold font-headline text-lg">{feature.title}</h3>
                                                <p className="text-muted-foreground">{feature.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative rounded-xl shadow-2xl shadow-purple-500/10">
                                <Image 
                                    src="https://placehold.co/800x600.png"
                                    alt="Applicant Dashboard Screenshot"
                                    width={800}
                                    height={600}
                                    className="rounded-xl"
                                    data-ai-hint="dashboard user interface"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Happy Family CTA Section */}
                <section id="cta" className="relative py-24 md:py-32">
                    <div className="absolute inset-0">
                        <Image
                            src="https://placehold.co/1600x800.png"
                            alt="Happy family in Canada"
                            fill={true}
                            objectFit="cover"
                            className="opacity-20"
                            data-ai-hint="happy family canada"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-background dark:via-background/80"></div>
                    </div>
                    <div className="container mx-auto px-4 relative text-center">
                        <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">Your Future in Canada Starts Here</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Ready to take the next step? Create your free account and get an instant estimate of your CRS score.
                        </p>
                        <div className="mt-8">
                             <Link href="/dashboard-select?role=client" passHref>
                                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                    Start Your Application Today
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="bg-background">
                 <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
                    © 2024 MAAT Technologies. All rights reserved. <Link href="/dashboard-select?role=admin" className="underline hover:text-primary">Admin Login</Link>
                </div>
            </footer>
        </div>
    );
}
