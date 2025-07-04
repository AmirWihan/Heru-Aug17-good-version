import { HeruLogoIcon } from '@/components/icons/HeruLogoIcon';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Users, FolderKanban, CreditCard, Users2, ShieldCheck, CheckCircle, FileUp, MessageCircle, CalendarClock } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'AI-Powered Automation',
    description: 'Draft messages, summarize documents, and check applications for errors in seconds.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Unified Client Management',
    description: 'A single dashboard for all client data, communication, documents, and case progress.',
  },
  {
    icon: <FolderKanban className="h-6 w-6" />,
    title: 'Streamlined Case Tracking',
    description: 'Manage every stage of the immigration process with automated workflows and tasks.',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Integrated Billing & Invoicing',
    description: 'Create and send professional invoices and track payments without leaving the CRM.',
  },
  {
    icon: <Users2 className="h-6 w-6" />,
    title: 'Team Collaboration',
    description: 'Assign tasks, share notes, and communicate with your team members in one place.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Secure Client Portal',
    description: 'Provide clients a secure portal to upload documents, send messages, and track their case.',
  },
];

const applicantFeatures = [
    {
        icon: <CheckCircle className="h-6 w-6 text-primary" />,
        title: "Track Your Application Status",
        description: "Get real-time updates on your case progress, from submission to decision.",
    },
    {
        icon: <FileUp className="h-6 w-6 text-primary" />,
        title: "Secure Document Uploads",
        description: "Easily upload all your required documents to a secure, centralized portal.",
    },
    {
        icon: <MessageCircle className="h-6 w-6 text-primary" />,
        title: "Direct Communication",
        description: "Message your lawyer or consultant directly through our secure messaging system.",
    },
    {
        icon: <CalendarClock className="h-6 w-6 text-primary" />,
        title: "Appointment Scheduling",
        description: "View and schedule appointments with your legal team without the back-and-forth.",
    }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <HeruLogoIcon className="h-8 w-8" />
            <span className="font-bold text-lg">Heru</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#client-portal" className="text-muted-foreground transition-colors hover:text-foreground">Client Portal</Link>
          </nav>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link href="/dashboard-select?role=client">
                <Button variant="ghost">Client Login</Button>
            </Link>
            <Link href="/dashboard-select?role=lawyer">
                <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32">
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
              <svg
                  className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
                  viewBox="0 0 1155 678"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path
                  fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                  fillOpacity=".2"
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
          <div className="container">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight">
              The AI-Powered CRM for Immigration Professionals
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Streamline your practice, manage clients effortlessly, and leverage cutting-edge AI to save time and improve outcomes. Heru is the all-in-one platform designed for modern immigration law.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/dashboard-select?role=lawyer">
                <Button size="lg" className="bg-primary hover:bg-primary/90">Get Started Free</Button>
              </Link>
              <Link href="#">
                 <Button size="lg" variant="outline">Request a Demo</Button>
              </Link>
            </div>
            <div className="mt-16 shadow-2xl shadow-primary/10 rounded-xl">
                 <Image 
                    src="https://placehold.co/1200x800.png"
                    alt="Heru Dashboard Screenshot"
                    width={1200}
                    height={800}
                    className="rounded-xl border"
                    data-ai-hint="dashboard crm user interface"
                />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">A Smarter Way to Manage Your Practice</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Heru combines all the tools you need into one intelligent platform, designed to eliminate busywork and let you focus on what matters most: your clients.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card p-6 rounded-lg border border-border/50 text-center flex flex-col items-center">
                  <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold font-headline">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Portal Section */}
        <section id="client-portal" className="py-20 md:py-28">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="lg:pr-12">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">A Professional Portal for Your Clients</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Impress your clients with a secure, branded portal where they can track their case, upload documents, and communicate with you directly. No more endless email chains.
                        </p>
                        <ul className="mt-8 space-y-6">
                            {applicantFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
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
                    <div className="relative rounded-xl shadow-2xl shadow-primary/10">
                        <Image 
                            src="https://placehold.co/800x600.png"
                            alt="Client Portal Screenshot"
                            width={800}
                            height={600}
                            className="rounded-xl border"
                            data-ai-hint="dashboard user interface"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-20 md:py-28 border-t border-border/40">
            <div className="container text-center">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">Ready to Transform Your Practice?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Join hundreds of immigration professionals who use Heru to save time, reduce errors, and grow their firms.
                </p>
                <div className="mt-8">
                     <Link href="/dashboard-select?role=lawyer" passHref>
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Start Your Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-muted/30">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <HeruLogoIcon className="h-6 w-6" />
                <span>© 2024 MAAT Technologies. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
                 <Link href="/dashboard-select?role=admin" className="underline hover:text-primary">Admin Login</Link>
                 <Link href="/dashboard-select?role=client" className="underline hover:text-primary">Client Portal Login</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
