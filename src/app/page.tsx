import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FileUp, MessageCircle, CalendarClock, Wand2, Users, FolderKanban } from 'lucide-react';
import { ClientDashboardScreenshot } from '@/components/client-dashboard-screenshot';

const professionalFeatures = [
    {
        icon: <Wand2 className="h-8 w-8 text-primary" />,
        title: "AI-Powered Efficiency",
        description: "Draft messages, summarize documents, and check applications for errors in seconds, freeing up valuable time.",
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Unified Client Management",
        description: "Access all client data, communication, documents, and case progress from a single, intuitive dashboard.",
    },
    {
        icon: <FolderKanban className="h-8 w-8 text-primary" />,
        title: "Seamless Collaboration",
        description: "Assign tasks, share notes, and communicate with your team members in one centralized platform.",
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


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
            <svg
                className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
                viewBox="0 0 1155 678"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                />
                <defs>
                <linearGradient
                    id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                    x1="1155.49"
                    x2="-78.208"
                    y1=".177"
                    y2="474.645"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="hsl(var(--primary))" />
                    <stop offset={1} stopColor="hsl(var(--accent))" />
                </linearGradient>
                </defs>
            </svg>
        </div>
      <header className="flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <HeruLogoIcon className="h-8 w-8" />
          <span className="text-xl font-bold">Heru</span>
        </Link>
        <div className="flex items-center gap-2">
            <Link href="/admin/dashboard">
              <Button variant="ghost">Admin Login</Button>
            </Link>
            <Link href="/lawyer/dashboard">
              <Button>Lawyer Login</Button>
            </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-16 text-center md:py-24">
          <h1 className="bg-gradient-to-br from-primary via-purple-500 to-accent bg-clip-text font-headline text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-7xl">
            The Future of Immigration Services
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Heru is an AI-powered platform designed to streamline immigration case management for legal professionals and provide a transparent, seamless experience for applicants.
          </p>
          <div className="w-full max-w-4xl space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link href="/client/dashboard" className="block">
                <div className="group rounded-xl border-2 border-transparent bg-card p-8 shadow-lg transition-all hover:border-accent hover:shadow-accent/20">
                    <h2 className="font-headline text-2xl font-bold">For Applicants</h2>
                    <p className="mt-2 text-muted-foreground">Track your case, communicate with your lawyer, and upload documents with ease.</p>
                    <div className="mt-4 font-semibold text-accent group-hover:underline">
                        Go to Client Portal <ArrowRight className="ml-1 inline h-4 w-4" />
                    </div>
                </div>
              </Link>
              <div className="group flex flex-col rounded-xl border-2 border-transparent bg-card p-8 shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/20">
                  <h2 className="font-headline text-2xl font-bold">For Professionals</h2>
                  <p className="mt-2 flex-grow text-muted-foreground">Manage your clients, automate tasks, and streamline your entire workflow with AI.</p>
                   <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Link href="/lawyer/register" passHref>
                           <Button className="w-full">Create an Account</Button>
                        </Link>
                        <Link href="/lawyer/dashboard" passHref>
                            <Button variant="outline" className="w-full">Log In</Button>
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <section id="why-heru" className="bg-muted/50 py-20 md:py-28">
            <div className="container mx-auto">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold">Why Heru?</h2>
                    <p className="mt-2 text-lg text-muted-foreground">A smarter way to manage your immigration practice.</p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {professionalFeatures.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                {feature.icon}
                            </div>
                            <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="for-applicants" className="py-20 md:py-28">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="lg:pr-12">
                     <h2 className="font-headline text-3xl font-bold">A Seamless Experience for Your Clients</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Empower your clients with a secure, branded portal where they can track their case, upload documents, and communicate with you directly.
                    </p>
                    <ul className="mt-8 space-y-6">
                        {applicantFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-accent/10 p-3 rounded-full">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                     <ClientDashboardScreenshot />
                </div>
            </div>
        </section>

        <section id="cta-final" className="relative overflow-hidden py-20 md:py-32">
             <Image 
                src="https://placehold.co/1920x1080.png"
                alt="Happy family"
                layout="fill"
                objectFit="cover"
                className="z-0"
                data-ai-hint="happy family nature"
            />
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="container mx-auto relative z-20 text-center text-white">
                <h2 className="font-headline text-4xl md:text-5xl font-bold">Begin Your Journey Today</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg">
                    Whether you are an applicant starting your immigration process or a legal professional seeking to optimize your practice, Heru is your trusted partner.
                </p>
                <div className="mt-8">
                     <Link href="/client/dashboard" passHref>
                        <Button size="lg" className="bg-accent hover:bg-accent/90">
                            Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <HeruLogoIcon className="h-6 w-6" />
                <span>© 2024 MAAT Technologies. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
                 <Link href="/client/dashboard" className="hover:text-primary">Applicant Login</Link>
                 <Link href="/lawyer/dashboard" className="hover:text-primary">Professional Login</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
