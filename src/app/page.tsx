import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, User, Wand2, Users as UsersIcon, FileStack, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: <Wand2 className="h-8 w-8 text-primary" />,
        title: "AI-Powered Efficiency",
        description: "Draft messages, check applications, and summarize documents in seconds, freeing up your valuable time.",
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

export default function RoleSelectionPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-900 dark:via-background dark:to-background">
            <main className="flex-1">
                <section className="text-center pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="container mx-auto px-4">
                        <HeruLogoIcon className="mx-auto h-16 w-16" />
                        <h1 className="mt-6 font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                            The Future of Immigration Services is Here
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Heru is an intelligent CRM designed for modern immigration professionals. Streamline your practice, empower your clients, and grow your business with the power of AI.
                        </p>
                        <p className="mt-8 font-semibold text-foreground">First, please select your role to continue.</p>

                        <div className="mt-8 grid max-w-4xl mx-auto md:grid-cols-2 gap-8">
                           <Link href="/dashboard-select?role=client">
                                <Card className="group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 text-left h-full flex flex-col">
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
                
                <section id="why-heru" className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto">
                             <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Why Heru is Different</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                We've built the tools you've always needed, powered by the technology of tomorrow.
                                Go beyond traditional CRMs and embrace a smarter way to work.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
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
            </main>

            <footer className="bg-background">
                 <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
                    © 2024 MAAT Technologies. All rights reserved. <Link href="/dashboard-select?role=admin" className="underline hover:text-primary">Admin Login</Link>
                </div>
            </footer>
        </div>
    );
}