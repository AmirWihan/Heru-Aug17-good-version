
import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Button } from '@/components/ui/button';
import { ArrowRight, Facebook, Linkedin, Twitter, Wand2, Users, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <HeruLogoIcon className="h-8 w-8" />
                        <span className="text-xl font-bold font-headline text-primary">Heru</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                        <Link href="#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">How It Works</Link>
                    </nav>
                    <div className="flex items-center gap-2">
                         <Link href="/dashboard-select?role=lawyer" passHref>
                            <Button variant="ghost" size="sm">For Legal Teams</Button>
                        </Link>
                        <Link href="/dashboard-select?role=client" passHref>
                            <Button size="sm">
                                Applicant Login <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
                    <div className="space-y-6">
                        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                            Navigate Your Immigration Journey with <span className="text-primary">Confidence</span>.
                        </h1>
                        <p className="max-w-xl text-lg text-muted-foreground">
                            Heru is the AI-powered platform that connects applicants with expert legal teams, simplifies the application process, and brings clarity to your case.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/dashboard-select?role=client" passHref>
                                <Button size="lg" className="w-full sm:w-auto">I'm an Applicant</Button>
                            </Link>
                            <Link href="/dashboard-select?role=lawyer" passHref>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">I'm a Legal Professional</Button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Image
                            src="https://placehold.co/600x400.png"
                            alt="A hopeful person looking at a cityscape"
                            width={600}
                            height={400}
                            className="rounded-xl shadow-2xl"
                            data-ai-hint="immigration journey"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-32 bg-muted/50">
                    <div className="container">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Heru?</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                An intelligent, all-in-one platform designed for modern immigration.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center p-8 bg-card rounded-lg shadow-md">
                                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                    <Wand2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">AI-Powered Assistance</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Leverage AI to check documents for errors, summarize legal text, and compose professional communication.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center p-8 bg-card rounded-lg shadow-md">
                                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Seamless Collaboration</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Connect directly with legal professionals, share documents securely, and track your application progress in real-time.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center p-8 bg-card rounded-lg shadow-md">
                                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                    <LayoutDashboard className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">All-in-One Platform</h3>
                                <p className="mt-2 text-muted-foreground">
                                    From CRS score calculation to final submission, manage every step of your process in one intuitive dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* How It Works Section */}
                <section id="how-it-works" className="container py-20 md:py-32">
                     <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Get Started in 3 Easy Steps</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                           Your streamlined path to success begins here.
                        </p>
                    </div>
                     <div className="relative mt-16">
                        <div className="absolute left-1/2 top-11 h-2/3 w-px bg-border -translate-x-1/2 md:block hidden"></div>
                         <div className="grid md:grid-cols-3 gap-16">
                           <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary font-bold text-xl">1</div>
                                <h3 className="font-headline text-xl font-bold">Create Your Profile</h3>
                                <p className="mt-2 text-muted-foreground">Sign up and use our AI tools to assess your eligibility and understand your options.</p>
                           </div>
                           <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary font-bold text-xl">2</div>
                                <h3 className="font-headline text-xl font-bold">Connect & Collaborate</h3>
                                <p className="mt-2 text-muted-foreground">Find the right legal expert and collaborate seamlessly through our secure platform.</p>
                           </div>
                           <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary font-bold text-xl">3</div>
                                <h3 className="font-headline text-xl font-bold">Achieve Your Goals</h3>
                                <p className="mt-2 text-muted-foreground">Track your case progress, manage documents, and move forward with confidence.</p>
                           </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                 <section className="bg-muted/50">
                    <div className="container py-20 md:py-32 text-center">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to take the next step?</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join Heru today and bring clarity and efficiency to your immigration process, whether you're an applicant or a seasoned legal professional.
                        </p>
                        <div className="mt-8 flex justify-center flex-col sm:flex-row gap-4">
                            <Link href="/dashboard-select?role=client" passHref>
                                <Button size="lg" className="w-full sm:w-auto">Start as an Applicant</Button>
                            </Link>
                            <Link href="/dashboard-select?role=lawyer" passHref>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">Start as a Legal Professional</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card">
              <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <HeruLogoIcon className="h-6 w-6" />
                        <span className="font-headline font-bold text-primary">Heru</span>
                    </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                    © 2024 MAAT Technologies. All rights reserved. <Link href="/dashboard-select?role=admin" className="underline hover:text-primary">Admin Login</Link>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary"><Facebook size={18} /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary"><Twitter size={18} /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={18} /></a>
                </div>
              </div>
            </footer>
        </div>
    );
}
